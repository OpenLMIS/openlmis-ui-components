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
        module('openlmis-offline');
        module('openlmis-modal');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.OpenlmisCachedResource = $injector.get('OpenlmisCachedResource');
            this.OpenlmisResource = $injector.get('OpenlmisResource');
            this.LocalDatabase = $injector.get('LocalDatabase');
            this.alertService = $injector.get('alertService');
            this.offlineService = $injector.get('offlineService');
        });

        this.updateDeferred = this.$q.defer();
        this.createDeferred = this.$q.defer();
        this.deleteDeferred = this.$q.defer();
        this.getDeferred = this.$q.defer();
        this.searchDeferred = this.$q.defer();
        this.allDocsByIndexDeferred = this.$q.defer();
        this.lastModifiedDateDeferred = this.$q.defer();
        this.queryDeferred = this.$q.defer();
        this.allDocsWithLatestVersionDeferred = this.$q.defer();
        this.database = new this.LocalDatabase('testDatabase');
        this.config = {
            cache: true,
            offlineMessage: 'offline.message'
        };
        this.BASE_URL = 'some.url/com';

        this.openlmisCachedResource = new this.OpenlmisCachedResource(
            this.BASE_URL, 'testDatabase', this.config
        );
        spyOn(this.offlineService, 'isOffline').andReturn(false);
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

    describe('getByVersionIdentities', function() {

        beforeEach(function() {
            this.listIds = [{
                id: 'one-id',
                versionNumber: 1
            }];
            //eslint-disable-next-line camelcase
            this.response_1 = {
                id: 'one-id',
                _id: 'one-id',
                _rev: 'one-rev',
                some: 'test-response',
                lastModified: 'Thu, 22 Aug 2019 09:18:43 GMT'
            };
            //eslint-disable-next-line camelcase
            this.response_2 = {
                content: {
                    content: [{
                        id: 'one-id',
                        _id: 'one-id',
                        _rev: 'one-rev',
                        some: 'test-response',
                        lastModified: 'Thu, 22 Aug 2019 09:18:43 GMT'
                    }]
                }
            };
        });

        it('should return records from local database and not send a request to the server', function() {
            spyOn(this.LocalDatabase.prototype, 'get').andReturn(this.getDeferred.promise);
            spyOn(this.OpenlmisResource.prototype, 'search').andReturn(this.searchDeferred.promise);
            spyOn(this.LocalDatabase.prototype, 'putVersioned').andReturn(this.response_1);

            this.openlmisCachedResource.isVersioned = true;
            var result;
            this.openlmisCachedResource.getByVersionIdentities(this.listIds)
                .then(function(response) {
                    result = response;
                });
            this.getDeferred.resolve(this.response_1);
            this.$rootScope.$apply();

            expect(result).toEqual([this.response_1]);
            expect(this.LocalDatabase.prototype.get).toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.putVersioned).not.toHaveBeenCalled();
            expect(this.OpenlmisResource.prototype.search).not.toHaveBeenCalled();
        });

        it('should send a request to the server if records are not in the local database', function() {
            spyOn(this.LocalDatabase.prototype, 'get').andReturn(this.getDeferred.promise);
            spyOn(this.OpenlmisResource.prototype, 'search').andReturn(this.searchDeferred.promise);
            spyOn(this.LocalDatabase.prototype, 'putVersioned').andReturn(this.response_2);

            this.openlmisCachedResource.isVersioned = true;
            var result;
            this.openlmisCachedResource.getByVersionIdentities(this.listIds)
                .then(function(response) {
                    result = response;
                });
            this.getDeferred.reject();
            this.searchDeferred.resolve(this.response_2);
            this.$rootScope.$apply();

            expect(result).toEqual(this.response_2.content.content);
            expect(this.LocalDatabase.prototype.get).toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.putVersioned).toHaveBeenCalled();
            expect(this.OpenlmisResource.prototype.search).toHaveBeenCalled();
        });

        it('should not send a request to the server if offline', function() {
            this.offlineService.isOffline.andReturn(true);
            spyOn(this.LocalDatabase.prototype, 'get').andReturn(this.getDeferred.promise);
            spyOn(this.OpenlmisResource.prototype, 'search').andReturn(this.searchDeferred.promise);
            spyOn(this.LocalDatabase.prototype, 'putVersioned').andReturn(this.response_2);
            spyOn(this.alertService, 'error');

            this.openlmisCachedResource.isVersioned = true;
            this.openlmisCachedResource.getByVersionIdentities(this.listIds);
            this.getDeferred.reject();
            this.$rootScope.$apply();

            expect(this.alertService.error).toHaveBeenCalledWith(this.config.offlineMessage);
            expect(this.LocalDatabase.prototype.get).toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.putVersioned).not.toHaveBeenCalled();
            expect(this.OpenlmisResource.prototype.search).not.toHaveBeenCalled();
        });

        it('should reject on failed request', function() {
            spyOn(this.LocalDatabase.prototype, 'get').andReturn(this.getDeferred.promise);
            spyOn(this.OpenlmisResource.prototype, 'search').andReturn(this.searchDeferred.promise);
            spyOn(this.LocalDatabase.prototype, 'putVersioned').andReturn(this.response_1);

            this.openlmisCachedResource.getByVersionIdentities(this.listIds);
            this.getDeferred.reject();
            this.searchDeferred.reject();
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.get).toHaveBeenCalled();
            expect(this.OpenlmisResource.prototype.search).toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.putVersioned).not.toHaveBeenCalled();
        });

        it('should reject if null was given', function() {
            spyOn(this.LocalDatabase.prototype, 'allDocsByIndex').andReturn(this.allDocsByIndexDeferred.promise);
            spyOn(this.OpenlmisResource.prototype, 'search').andReturn(this.searchDeferred.promise);

            var rejected;
            this.openlmisCachedResource.getByVersionIdentities()
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

    describe('update', function() {

        beforeEach(function() {
            this.response = {
                content: {
                    id: 'some-id',
                    doc: {
                        _id: 'some-id',
                        _rev: 'some-rev',
                        object: {
                            id: 'some-id',
                            some: 'test-response',
                            customId: 'custom-id-value'
                        }
                    }
                }
            };

            spyOn(this.OpenlmisResource.prototype, 'update').andReturn(this.updateDeferred.promise);
            spyOn(this.LocalDatabase.prototype, 'get').andReturn(this.getDeferred.promise);
            spyOn(this.LocalDatabase.prototype, 'put').andReturn(this.response.content.doc);
            spyOn(this.LocalDatabase.prototype, 'putVersioned').andReturn(this.response.content.doc);
            this.openlmisCachedResource.isVersioned = false;

        });

        it('should cache non-versioned response on successful request', function() {
            this.openlmisCachedResource.update(this.response);

            this.updateDeferred.resolve(this.response);
            this.getDeferred.resolve(this.response.content.doc);
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.get).toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.put).toHaveBeenCalled();
        });

        it('should cache non-versioned response when not found in cache', function() {
            var notFoundError = new Error();
            notFoundError.name = 'not_found';

            this.openlmisCachedResource.update(this.response);

            this.updateDeferred.resolve(this.response);
            this.getDeferred.reject(notFoundError);
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.get).toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.put).toHaveBeenCalled();
        });

        it('should cache versioned response on successful request', function() {
            this.openlmisCachedResource.isVersioned = true;

            this.openlmisCachedResource.update(this.response);
            this.updateDeferred.resolve(this.response);
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.get).not.toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.putVersioned).toHaveBeenCalled();
        });

        it('should reject on failed request', function() {
            this.openlmisCachedResource.update(this.response);

            this.updateDeferred.reject();
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.get).not.toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.put).not.toHaveBeenCalled();
        });

        it('should reject if null was given', function() {
            var rejected;
            this.openlmisCachedResource.update()
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
        });
    });

    describe('create', function() {

        beforeEach(function() {

            this.response = {
                content: {
                    id: 'some-id',
                    doc: {
                        _id: 'some-id',
                        _rev: 'some-rev',
                        object: {
                            id: 'some-id',
                            some: 'test-response',
                            customId: 'custom-id-value'
                        }
                    }
                }
            };

            spyOn(this.OpenlmisResource.prototype, 'create').andReturn(this.createDeferred.promise);
            spyOn(this.LocalDatabase.prototype, 'put').andReturn(this.response.content.doc);
            spyOn(this.LocalDatabase.prototype, 'putVersioned').andReturn(this.response.content.doc);
            this.openlmisCachedResource.isVersioned = false;

        });

        it('should cache non-versioned response on successful request', function() {
            this.openlmisCachedResource.create(this.response);

            this.createDeferred.resolve(this.response);
            this.getDeferred.resolve(this.response.content.doc);
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.put).toHaveBeenCalled();
        });

        it('should cache versioned response on successful request', function() {
            this.openlmisCachedResource.isVersioned = true;

            this.openlmisCachedResource.create(this.response);
            this.createDeferred.resolve(this.response);
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.put).not.toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.putVersioned).toHaveBeenCalled();
        });

        it('should reject on failed request', function() {
            this.openlmisCachedResource.create(this.response);

            this.createDeferred.reject();
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.put).not.toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.putVersioned).not.toHaveBeenCalled();
        });

    });

    describe('delete', function() {

        beforeEach(function() {

            this.results = [
                {
                    content: {
                        id: 'some-id',
                        doc: {
                            _id: 'some-id',
                            _rev: 'some-rev',
                            object: {
                                id: 'some-id',
                                some: 'test-response',
                                customId: 'custom-id-value'
                            }
                        }
                    }
                }
            ];

            spyOn(this.OpenlmisResource.prototype, 'delete').andReturn(this.deleteDeferred.promise);
            spyOn(this.LocalDatabase.prototype, 'get').andReturn(this.getDeferred.promise);
            spyOn(this.LocalDatabase.prototype, 'allDocsByIndex').andReturn(this.allDocsByIndexDeferred.promise);
            spyOn(this.LocalDatabase.prototype, 'remove');
            this.openlmisCachedResource.isVersioned = false;

        });

        it('should resolve non versioned on successful request', function() {
            this.openlmisCachedResource.delete(this.results[0].content);

            this.deleteDeferred.resolve(this.results[0]);
            this.allDocsByIndexDeferred.resolve(this.results);
            this.getDeferred.resolve(this.results[0].content.doc);
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.get).toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.remove).toHaveBeenCalled();
        });

        it('should resolve versioned on successful request', function() {
            this.openlmisCachedResource.isVersioned = true;
            this.openlmisCachedResource.delete(this.results[0].content);

            this.deleteDeferred.resolve(this.results[0]);
            this.allDocsByIndexDeferred.resolve(this.results[0]);
            this.getDeferred.resolve(this.results[0].content.doc);
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.get).toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.remove).toHaveBeenCalled();
        });

        it('should resolve all found versioned on successful request', function() {
            var anotherResult = {
                content: {
                    id: 'some-id',
                    doc: {
                        _id: 'some-id',
                        _rev: 'some-rev2',
                        object: {
                            id: 'some-id',
                            some: 'test-response',
                            customId: 'custom-id-value'
                        }
                    }
                }
            };

            this.results.push(anotherResult);
            this.openlmisCachedResource.isVersioned = true;
            this.openlmisCachedResource.delete(this.results[0].content);

            this.deleteDeferred.resolve(this.results[0]);
            this.allDocsByIndexDeferred.resolve(this.results);
            this.getDeferred.resolve(this.results[0].content.doc);
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.get).toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.remove).toHaveBeenCalled();
        });

        it('should reject on failed request', function() {
            this.openlmisCachedResource.delete(this.results[0].content);

            this.deleteDeferred.reject();
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.get).not.toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.remove).not.toHaveBeenCalled();
        });

        it('should reject on failed request to local database', function() {
            this.openlmisCachedResource.delete(this.results[0].content);

            this.deleteDeferred.resolve(this.response);
            this.getDeferred.reject();
            this.$rootScope.$apply();

            expect(this.LocalDatabase.prototype.remove).not.toHaveBeenCalled();
        });
    });

    describe('getAll', function() {
        beforeEach(function() {

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

        it('should resolve for paginated', function() {
            var config = {
                cache: true,
                paginated: true
            };

            var openlmisCachedResource = new this.OpenlmisCachedResource(
                this.BASE_URL, 'testDatabase', config
            );

            spyOn(this.OpenlmisResource.prototype, 'query').andReturn(this.queryDeferred.promise);
            spyOn(this.LocalDatabase.prototype, 'get').andReturn(this.getDeferred.promise);
            spyOn(this.LocalDatabase.prototype, 'allDocsWithLatestVersion')
                .andReturn(this.allDocsWithLatestVersionDeferred.promise);

            openlmisCachedResource.isVersioned = false;
            spyOn(this.LocalDatabase.prototype, 'putVersioned').andReturn(this.pageWithLastModified.content.content[0]);
            spyOn(this.LocalDatabase.prototype, 'put').andReturn(this.pageWithLastModified.content.content[0]);

            var result = openlmisCachedResource.getAll(undefined);
            this.getDeferred.resolve(this.lastModified);
            this.queryDeferred.resolve(this.pageWithLastModified);
            this.$rootScope.$apply();

            expect(result.$$state.value).toEqual(this.pageWithLastModified.content);
            expect(this.LocalDatabase.prototype.putVersioned).not.toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.put).toHaveBeenCalled();
        });

        it('should resolve for non paginated', function() {
            var config = {
                cache: true,
                paginated: false
            };

            var openlmisCachedResource = new this.OpenlmisCachedResource(
                this.BASE_URL, 'testDatabase', config
            );

            spyOn(this.OpenlmisResource.prototype, 'query').andReturn(this.queryDeferred.promise);
            spyOn(this.LocalDatabase.prototype, 'get').andReturn(this.getDeferred.promise);
            spyOn(this.LocalDatabase.prototype, 'allDocsWithLatestVersion')
                .andReturn(this.allDocsWithLatestVersionDeferred.promise);

            openlmisCachedResource.isVersioned = false;
            spyOn(this.LocalDatabase.prototype, 'putVersioned').andReturn(this.pageWithLastModified.content.content[0]);
            spyOn(this.LocalDatabase.prototype, 'put').andReturn(this.pageWithLastModified.content.content[0]);

            var result = openlmisCachedResource.getAll(undefined);
            this.getDeferred.resolve(this.lastModified);
            this.queryDeferred.resolve(this.pageWithLastModified);
            this.$rootScope.$apply();

            expect(result.$$state.value).toEqual(this.pageWithLastModified);
            expect(this.LocalDatabase.prototype.putVersioned).not.toHaveBeenCalled();
            expect(this.LocalDatabase.prototype.put).toHaveBeenCalled();
        });

    });

    describe('throwMethodNotSupported', function() {

        it('should throw error', function() {
            var openlmisCachedResource = this.openlmisCachedResource;

            expect(function() {
                openlmisCachedResource.throwMethodNotSupported();
            }).toThrow('Method not supported');
        });
    });

});
