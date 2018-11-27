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

describe('OpenlmisResource', function() {

    beforeEach(function() {
        module('openlmis-pagination');

        var context = this;
        module('openlmis-repository', function($provide) {
            $provide.factory('ParameterSplitter', function() {
                return function() {
                    context.parameterSplitterMock = jasmine.createSpyObj('ParameterSplitter', ['split']);
                    return context.parameterSplitterMock;
                };
            });
        });

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
            this.OpenlmisResource = $injector.get('OpenlmisResource');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
            this.openlmisUrlFactory = $injector.get('openlmisUrlFactory');
        });

        this.BASE_URL = 'some.url/com';
        this.openlmisResource = new this.OpenlmisResource(this.BASE_URL);

        this.page = new this.PageDataBuilder().build();
    });

    describe('constructor', function() {

        beforeEach(function() {
            this.SOME_ID = 'some-id';
        });

        it('should accept url ending with slash', function() {
            var $httpBackend = this.$httpBackend;

            $httpBackend.expectGET(this.openlmisUrlFactory(this.BASE_URL + '/' + this.SOME_ID))
                .respond(200, this.page);

            new this.OpenlmisResource(this.BASE_URL + '/').get(this.SOME_ID);
            $httpBackend.flush();
        });

        it('should accept url not ending with slash', function() {
            var $httpBackend = this.$httpBackend;

            $httpBackend
                .expectGET(this.openlmisUrlFactory(this.BASE_URL + '/' + this.SOME_ID))
                .respond(200, this.page);

            new this.OpenlmisResource(this.BASE_URL).get(this.SOME_ID);
            $httpBackend.flush();
        });

    });

    describe('query for page', function() {

        beforeEach(function() {
            this.openlmisResource = new this.OpenlmisResource(this.BASE_URL);

            this.params = {
                some: 'param'
            };

            this.parameterSplitterMock.split.andReturn([{
                some: ['paramOne']
            }, {
                some: ['paramTwo']
            }]);

            this.page = this.PageDataBuilder.buildWithContent([{
                id: 'obj-one'
            }, {
                id: 'obj-two'
            }]);

            this.pageTwo = this.PageDataBuilder.buildWithContent([{
                id: 'obj-three'
            }, {
                id: 'obj-four'
            }]);
        });

        it('should return page if only one request was sent', function() {
            this.parameterSplitterMock.split.andReturn([this.params]);

            this.$httpBackend
                .expectGET(this.openlmisUrlFactory(this.BASE_URL + '?some=param'))
                .respond(200, this.page);

            var result;
            this.openlmisResource.query(this.params)
                .then(function(response) {
                    result = response;
                });
            this.$httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.page));
        });

        it('should reject if any of the requests fails', function() {
            this.$httpBackend
                .expectGET(this.openlmisUrlFactory(this.BASE_URL + '?some=paramOne'))
                .respond(200, this.page);

            this.$httpBackend
                .expectGET(this.openlmisUrlFactory(this.BASE_URL + '?some=paramTwo'))
                .respond(500);

            var rejected;
            this.openlmisResource
                .query({
                    some: 'param'
                })
                .catch(function() {
                    rejected = true;
                });
            this.$httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should return merged page if multiple requests were sent', function() {
            this.$httpBackend
                .expectGET(this.openlmisUrlFactory(this.BASE_URL + '?some=paramOne'))
                .respond(200, this.page);

            this.$httpBackend
                .expectGET(this.openlmisUrlFactory(this.BASE_URL + '?some=paramTwo'))
                .respond(200, this.pageTwo);

            var result;
            this.openlmisResource.query(this.params)
                .then(function(response) {
                    result = response;
                });
            this.$httpBackend.flush();

            expect(result.content).toEqual([
                this.page.content[0],
                this.page.content[1],
                this.pageTwo.content[0],
                this.pageTwo.content[1]
            ]);

            expect(result.numberOfElements).toEqual(4);
            expect(result.totalElements).toEqual(4);
            expect(result.size).toEqual(this.page.size);
        });

        it('should return response if params are not defined', function() {
            this.parameterSplitterMock.split.andReturn([undefined]);

            this.$httpBackend
                .expectGET(this.openlmisUrlFactory(this.BASE_URL))
                .respond(200, this.page);

            var result;
            this.openlmisResource.query()
                .then(function(response) {
                    result = response;
                });
            this.$httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.page));
        });

    });

    describe('query for list', function() {

        beforeEach(function() {
            this.openlmisResource = new this.OpenlmisResource(this.BASE_URL, {
                paginated: false
            });

            this.parameterSplitterMock.split.andReturn([{
                some: ['paramOne']
            }, {
                some: ['paramTwo']
            }]);

            this.response = [{
                id: 'obj-one'
            }, {
                id: 'obj-two'
            }];

            this.responseTwo = [{
                id: 'obj-three'
            }, {
                id: 'obj-four'
            }];
        });

        it('should return response if only one request was sent', function() {
            var params = {
                some: 'param'
            };

            this.parameterSplitterMock.split.andReturn([params]);

            this.$httpBackend
                .expectGET(this.openlmisUrlFactory(this.BASE_URL + '?some=param'))
                .respond(200, this.response);

            var result;
            this.openlmisResource.query(params)
                .then(function(response) {
                    result = response;
                });
            this.$httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.response));
        });

        it('should reject if any of the requests fails', function() {
            this.$httpBackend
                .expectGET(this.openlmisUrlFactory(this.BASE_URL + '?some=paramOne'))
                .respond(200, this.response);

            this.$httpBackend
                .expectGET(this.openlmisUrlFactory(this.BASE_URL + '?some=paramTwo'))
                .respond(500);

            var rejected;
            this.openlmisResource.query(this.params)
                .catch(function() {
                    rejected = true;
                });
            this.$httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should return merged list if multiple requests were sent', function() {
            this.$httpBackend
                .expectGET(this.openlmisUrlFactory(this.BASE_URL + '?some=paramOne'))
                .respond(200, this.response);

            this.$httpBackend
                .expectGET(this.openlmisUrlFactory(this.BASE_URL + '?some=paramTwo'))
                .respond(200, this.responseTwo);

            var result;
            this.openlmisResource.query(this.params)
                .then(function(response) {
                    result = response;
                });
            this.$httpBackend.flush();

            expect(angular.toJson(result))
                .toEqual(angular.toJson([
                    this.response[0],
                    this.response[1],
                    this.responseTwo[0],
                    this.responseTwo[1]
                ]));
        });

    });

    describe('get', function() {

        beforeEach(function() {
            this.response = {
                id: 'some-id',
                some: 'test-object'
            };
        });

        it('should resolve to server response on successful request', function() {
            this.$httpBackend
                .expectGET(this.openlmisUrlFactory(this.BASE_URL + '/' + this.response.id))
                .respond(200, this.response);

            var result;
            this.openlmisResource.get(this.response.id)
                .then(function(response) {
                    result = response;
                });
            this.$httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.response));
        });

        it('should reject on failed request', function() {
            this.$httpBackend
                .expectGET(this.openlmisUrlFactory(this.BASE_URL + '/' + this.response.id))
                .respond(400);

            var rejected;
            this.openlmisResource.get(this.response.id)
                .catch(function() {
                    rejected = true;
                });
            this.$httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should reject if null was given', function() {
            var rejected;
            this.openlmisResource.get()
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
                id: 'some-id',
                some: 'test-response'
            };

            this.object = {
                some: 'test-response'
            };
        });

        it('should resolve to server response on successful request', function() {
            this.$httpBackend
                .expectPOST(this.openlmisUrlFactory(this.BASE_URL), this.object)
                .respond(200, this.response);

            var result;
            this.openlmisResource.create(this.object)
                .then(function(response) {
                    result = response;
                });
            this.$httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.response));
        });

        it('should reject on failed request', function() {
            this.$httpBackend
                .expectPOST(this.openlmisUrlFactory(this.BASE_URL), this.object)
                .respond(400);

            var rejected;
            this.openlmisResource.create(this.object)
                .catch(function() {
                    rejected = true;
                });
            this.$httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should reject if null was given', function() {
            var rejected;
            this.openlmisResource.create()
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

    describe('update', function() {

        beforeEach(function() {
            this.object = {
                id: 'some-id',
                some: 'test-response',
                customId: 'custom-id-value'
            };
        });

        it('should resolve to server response on successful request', function() {
            this.$httpBackend
                .expectPUT(this.openlmisUrlFactory(this.BASE_URL + '/' + this.object.id), this.object)
                .respond(200, this.object);

            var result;
            this.openlmisResource.update(this.object)
                .then(function(object) {
                    result = object;
                });
            this.$httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.object));
        });

        it('should reject on failed request', function() {
            this.$httpBackend
                .expectPUT(this.openlmisUrlFactory(this.BASE_URL + '/' + this.object.id), this.object)
                .respond(400);

            var rejected;
            this.openlmisResource.update(this.object)
                .catch(function() {
                    rejected = true;
                });
            this.$httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should reject if null was given', function() {
            var rejected;
            this.openlmisResource.update()
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
        });

        it('should respect idParam option', function() {
            this.openlmisResource = new this.OpenlmisResource(this.BASE_URL, {
                idParam: 'customId'
            });

            var $httpBackend = this.$httpBackend;
            $httpBackend
                .expectPUT(this.openlmisUrlFactory(this.BASE_URL + '/' + this.object.customId), this.object)
                .respond(200, this.object);

            this.openlmisResource.update(this.object);
            $httpBackend.flush();
        });

    });

    describe('delete', function() {

        beforeEach(function() {
            this.object = {
                id: 'some-id',
                some: 'test-object',
                customId: 'custom-id-value'
            };
        });

        it('should resolve on successful request', function() {
            this.$httpBackend
                .expectDELETE(this.openlmisUrlFactory(this.BASE_URL + '/' + this.object.id))
                .respond(200);

            var resolved;
            this.openlmisResource.delete(this.object)
                .then(function() {
                    resolved = true;
                });
            this.$httpBackend.flush();

            expect(resolved).toEqual(true);
        });

        it('should reject on failed request', function() {
            this.$httpBackend
                .expectDELETE(this.openlmisUrlFactory(this.BASE_URL + '/' + this.object.id))
                .respond(400);

            var rejected;
            this.openlmisResource.delete(this.object)
                .catch(function() {
                    rejected = true;
                });
            this.$httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should reject if null was given', function() {
            var rejected;
            this.openlmisResource.delete()
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
        });

        it('should respect idParam option', function() {
            this.openlmisResource = new this.OpenlmisResource(this.BASE_URL, {
                idParam: 'customId'
            });

            var $httpBackend = this.$httpBackend;
            $httpBackend
                .expectDELETE(this.openlmisUrlFactory(this.BASE_URL + '/' + this.object.customId))
                .respond(200);

            this.openlmisResource.delete(this.object);
            $httpBackend.flush();
        });

    });

    describe('getAll for list', function() {

        beforeEach(function() {
            this.response = [{
                id: 'obj-one'
            }, {
                id: 'obj-two'
            }];

            this.openlmisResource = new this.OpenlmisResource(this.BASE_URL, {
                paginated: false
            });

            spyOn(this.openlmisResource, 'query').andReturn(this.$q.resolve(this.response));
        });

        it('should call query', function() {
            var params = {
                paramOne: 'paramOne'
            };

            this.openlmisResource.getAll(params);
            this.$rootScope.$apply();

            expect(this.openlmisResource.query).toHaveBeenCalledWith(params);
        });

        it('should return the list', function() {
            var result;
            this.openlmisResource.getAll()
                .then(function(list) {
                    result = list;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.response);
        });

    });

    describe('getAll for page', function() {

        beforeEach(function() {
            this.page = this.PageDataBuilder.buildWithContent([{
                id: 'obj-one'
            }, {
                id: 'obj-two'
            }]);

            this.openlmisResource = new this.OpenlmisResource(this.BASE_URL);

            spyOn(this.openlmisResource, 'query').andReturn(this.$q.resolve(this.page));
        });

        it('should call query', function() {
            var params = {
                paramOne: 'paramOne'
            };

            this.openlmisResource.getAll(params);
            this.$rootScope.$apply();

            expect(this.openlmisResource.query).toHaveBeenCalledWith(params);
        });

        it('should return the list', function() {
            var result;
            this.openlmisResource.getAll()
                .then(function(list) {
                    result = list;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.page.content);
        });

    });

    describe('throwMethodNotSupported', function() {

        it('should throw error', function() {
            var openlmisResource = this.openlmisResource;

            expect(function() {
                openlmisResource.throwMethodNotSupported();
            }).toThrow('Method not supported');
        });

    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingRequest();
        this.$httpBackend.verifyNoOutstandingExpectation();
    });

});
