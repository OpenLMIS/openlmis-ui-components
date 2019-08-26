/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

describe('OpenlmisCachedResource', function() {

    beforeEach(function() {
        module('openlmis-cached-repository');
        module('openlmis-repository');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.OpenlmisCachedResource = $injector.get('OpenlmisCachedResource');
            this.OpenlmisResource = $injector.get('OpenlmisResource');
            this.LocalDatabase = $injector.get('LocalDatabase');
        });

        this.getDeferred = this.$q.defer();
        this.allDocsByIndexDeferred = this.$q.defer();
        this.lastModifiedDateDeferred = this.$q.defer();
        this.queryDeferred = this.$q.defer();
        this.allDocsWithLatestVersionDeferred = this.$q.defer();
        this.database = new this.LocalDatabase('testDatabase');
        this.config = {
            cache: true
        };
        this.BASE_URL = 'some.url/com';

        this.openlmisCachedResource = new this.OpenlmisCachedResource(
            this.BASE_URL, 'testDatabase', this.config
        );
    });

    describe('get', function() {

        beforeEach(function() {
            spyOn(this.LocalDatabase.prototype, 'allDocsByIndex').andReturn(this.allDocsByIndexDeferred.promise);
            spyOn(this.OpenlmisResource.prototype, 'get').andReturn(this.getDeferred.promise);
            spyOn(this.LocalDatabase.prototype, 'putVersioned').andReturn(this.response);
            spyOn(this.LocalDatabase.prototype, 'put').andReturn(this.response);

            this.id = 'some-id';

            this.response = {
                id: 'some-id',
                _id: 'some-id',
                _rev: 'some-rev',
                some: 'test-response',
                lastModified: 'Thu, 22 Aug 2019 09:18:43 GMT'
            };
        });

        it('should cache response on successful request', function() {
            this.openlmisCachedResource.isVersioned = false;

            this.openlmisCachedResource.get(this.id);
            this.allDocsByIndexDeferred.resolve(this.response);
            this.getDeferred.resolve(this.response);
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.allDocsByIndex).toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.putVersioned).not.toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.put).toHaveBeenCalled();
        });

        it('should cache versioned response on successful request', function() {
            this.openlmisCachedResource.isVersioned = true;

            this.openlmisCachedResource.get(this.id);
            this.allDocsByIndexDeferred.resolve(this.response);
            this.getDeferred.resolve(this.response);
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.allDocsByIndex).toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.putVersioned).toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.put).not.toHaveBeenCalled();
        });

        it('should return record from local database when response has status 304', function() {
            this.page = [{
                id: 'some-id',
                _id: 'some-id/2',
                latest: true
            }, {
                id: 'some-id',
                _id: 'some-id/1',
                latest: false
            }];

            this.reject = {
                status: 304
            };
            this.openlmisCachedResource.isVersioned = true;

            this.allDocsByIndexDeferred.resolve(this.page);
            this.getDeferred.reject(this.reject);
            var result = this.openlmisCachedResource.get(this.id);
            this.$rootScope.$apply();

            expect(result.$$state.value).toEqual(this.page[0]);
            expect(this.LocalDatabase.prototype.allDocsByIndex).toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.putVersioned).not.toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.put).not.toHaveBeenCalled();
        });

        it('should no request if record with the specified version is in the local database', function() {
            this.page = [{
                id: 'some-id',
                _id: 'some-id/2',
                latest: true
            }, {
                id: 'some-id',
                _id: 'some-id/1',
                latest: false
            }];

            this.openlmisCachedResource.isVersioned = true;

            this.allDocsByIndexDeferred.resolve(this.page);
            var result = this.openlmisCachedResource.get(this.id, 1);
            this.$rootScope.$apply();

            expect(result.$$state.value).toEqual(this.page[0]);
            expect(this.LocalDatabase.prototype.allDocsByIndex).toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.putVersioned).not.toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.put).not.toHaveBeenCalled();
        });

        it('should reject on failed request', function() {
            this.openlmisCachedResource.get(this.id);

            this.getDeferred.reject();
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.allDocsByIndex).toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.putVersioned).not.toHaveBeenCalled();
        });

        it('should reject if null was given', function() {
            var rejected;
            this.openlmisCachedResource.get()
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

    describe('query', function() {

        beforeEach(function() {
            spyOn(this.OpenlmisResource.prototype, 'query').andReturn(this.queryDeferred.promise);
            spyOn(this.LocalDatabase.prototype, 'get').andReturn(this.getDeferred.promise);
            spyOn(this.LocalDatabase.prototype, 'allDocsWithLatestVersion')
                .andReturn(this.allDocsWithLatestVersionDeferred.promise);

            this.pageWithLastModified = {
                content: {
                    content: [{
                        id: 'obj-one',
                        lastModified: 'Thu, 22 Aug 2019 09:18:43 GMT',
                        _id: 'obj-one'
                    }, {
                        id: 'obj-two',
                        lastModified: 'Thu, 22 Aug 2019 09:18:43 GMT',
                        _id: 'obj-two'
                    }]
                }
            };

            this.pageVersioned = {
                content: {
                    content: [{
                        id: 'obj-one',
                        lastModified: 'Thu, 22 Aug 2019 09:18:43 GMT',
                        _id: 'obj-one/1',
                        meta: {
                            versionNumber: 1
                        }
                    }, {
                        id: 'obj-two',
                        lastModified: 'Thu, 22 Aug 2019 09:18:43 GMT',
                        _id: 'obj-two/1',
                        meta: {
                            versionNumber: 1
                        }
                    }]
                }
            };

            this.lastModified = {
                date: 'Thu, 22 Aug 2019 09:18:43 GMT'
            };

        });

        it('should save nonversioned records to localdatabase', function() {
            this.openlmisCachedResource.isVersioned = false;
            spyOn(this.LocalDatabase.prototype, 'putVersioned').andReturn(this.pageWithLastModified.content.content[0]);
            spyOn(this.LocalDatabase.prototype, 'put').andReturn(this.pageWithLastModified.content.content[0]);

            this.openlmisCachedResource.query(undefined);
            this.getDeferred.resolve(this.lastModified);
            this.queryDeferred.resolve(this.pageWithLastModified);
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.putVersioned).not.toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.put).toHaveBeenCalled();
        });

        it('should save versioned records to localdatabase', function() {
            this.openlmisCachedResource.isVersioned = true;
            spyOn(this.LocalDatabase.prototype, 'putVersioned').andReturn(this.pageVersioned.content.content[0]);
            spyOn(this.LocalDatabase.prototype, 'put').andReturn(this.pageVersioned.content.content[0]);

            this.openlmisCachedResource.query(undefined);
            this.getDeferred.resolve(this.lastModified);
            this.queryDeferred.resolve(this.pageVersioned);
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.putVersioned).toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.put).toHaveBeenCalled();
        });

        it('should return record from local database when response has status 304', function() {
            this.reject = {
                status: 304
            };

            var pageVersioned = {
                docs: {
                    content: [{
                        id: 'obj-one',
                        lastModified: 'Thu, 22 Aug 2019 09:18:43 GMT',
                        _id: 'obj-one/1',
                        meta: {
                            versionNumber: 1
                        }
                    }, {
                        id: 'obj-two',
                        lastModified: 'Thu, 22 Aug 2019 09:18:43 GMT',
                        _id: 'obj-two/1',
                        meta: {
                            versionNumber: 1
                        }
                    }]
                }
            };

            this.openlmisCachedResource.isVersioned = true;
            spyOn(this.LocalDatabase.prototype, 'putVersioned').andReturn(this.pageVersioned.content.content[0]);
            spyOn(this.LocalDatabase.prototype, 'put').andReturn(this.pageVersioned.content.content[0]);

            this.getDeferred.resolve(this.lastModified);

            this.queryDeferred.reject(this.reject);
            this.allDocsWithLatestVersionDeferred.resolve(pageVersioned);
            var result = this.openlmisCachedResource.query(undefined);
            this.$rootScope.$apply();

            expect(result.$$state.value.content).toEqual(pageVersioned.docs);
            expect(this.LocalDatabase.prototype.get).toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.putVersioned).not.toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.put).not.toHaveBeenCalled();
        });
    });
});
