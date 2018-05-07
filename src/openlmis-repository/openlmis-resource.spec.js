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

    var BASE_URL = 'some.url/com';

    var openlmisResource, OpenlmisResource, $httpBackend, $rootScope, PageDataBuilder, page,
        parameterSplitterMock, openlmisUrlFactory;

    beforeEach(function() {
        module('openlmis-pagination');
        module('openlmis-repository', function($provide) {
            $provide.factory('ParameterSplitter', function() {
                return function() {
                    parameterSplitterMock = jasmine.createSpyObj('ParameterSplitter', ['split']);
                    return parameterSplitterMock;
                };
            });
        });

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            OpenlmisResource = $injector.get('OpenlmisResource');
            PageDataBuilder = $injector.get('PageDataBuilder');
            openlmisUrlFactory = $injector.get('openlmisUrlFactory');
        });

        openlmisResource = new OpenlmisResource(BASE_URL);

        page = new PageDataBuilder().build();
    });

    describe('constructor', function() {

        var SOME_ID = 'some-id';

        it('should accept url ending with slash', function() {
            $httpBackend
                .expectGET(openlmisUrlFactory(BASE_URL + '/' + SOME_ID))
                .respond(200, page);

            new OpenlmisResource(BASE_URL + '/').get(SOME_ID);
            $httpBackend.flush();
        });

        it('should accept url not ending with slash', function() {
            $httpBackend
                .expectGET(openlmisUrlFactory(BASE_URL + '/' + SOME_ID))
                .respond(200, page);

            new OpenlmisResource(BASE_URL).get(SOME_ID);
            $httpBackend.flush();
        });

    });

    describe('query for page', function() {

        var params, pageTwo;

        beforeEach(function() {
            openlmisResource = new OpenlmisResource(BASE_URL);

            parameterSplitterMock.split.andReturn([{
                some: ['paramOne']
            }, {
                some: ['paramTwo']
            }]);

            page = PageDataBuilder.buildWithContent([{
                id: 'obj-one'
            }, {
                id: 'obj-two'
            }]);

            pageTwo = PageDataBuilder.buildWithContent([{
                id: 'obj-three'
            }, {
                id: 'obj-four'
            }]);
        });

        it('should return page if only one request was sent', function() {
            var params = {
                some: 'param'
            };

            parameterSplitterMock.split.andReturn([params]);

            $httpBackend
                .expectGET(openlmisUrlFactory(BASE_URL + '?some=param'))
                .respond(200, page);

            var result;
            openlmisResource.query(params)
                .then(function(response) {
                    result = response;
                });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(page));
        });

        it('should reject if any of the requests fails', function() {
            $httpBackend
                .expectGET(openlmisUrlFactory(BASE_URL + '?some=paramOne'))
                .respond(200, page);

            $httpBackend
                .expectGET(openlmisUrlFactory(BASE_URL + '?some=paramTwo'))
                .respond(500);

            var rejected;
            openlmisResource.query(params)
                .catch(function() {
                    rejected = true;
                });
            $httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should return merged page if multiple requests were sent', function() {
            $httpBackend
                .expectGET(openlmisUrlFactory(BASE_URL + '?some=paramOne'))
                .respond(200, page);

            $httpBackend
                .expectGET(openlmisUrlFactory(BASE_URL + '?some=paramTwo'))
                .respond(200, pageTwo);

            var result;
            openlmisResource.query(params)
                .then(function(response) {
                    result = response;
                });
            $httpBackend.flush();

            expect(result.content).toEqual([page.content[0], page.content[1], pageTwo.content[0], pageTwo.content[1]]);
            expect(result.numberOfElements).toEqual(4);
            expect(result.totalElements).toEqual(4);
            expect(result.size).toEqual(page.size);
        });

    });

    describe('query for list', function() {

        var params, response, responseTwo;

        beforeEach(function() {
            openlmisResource = new OpenlmisResource(BASE_URL, {
                paginated: false
            });

            parameterSplitterMock.split.andReturn([{
                some: ['paramOne']
            }, {
                some: ['paramTwo']
            }]);

            response = [{
                id: 'obj-one'
            }, {
                id: 'obj-two'
            }];

            responseTwo = [{
                id: 'obj-three'
            }, {
                id: 'obj-four'
            }];
        });

        it('should return response if only one request was sent', function() {
            var params = {
                some: 'param'
            };

            parameterSplitterMock.split.andReturn([params]);

            $httpBackend
                .expectGET(openlmisUrlFactory(BASE_URL + '?some=param'))
                .respond(200, response);

            var result;
            openlmisResource.query(params)
            .then(function(response) {
                result = response;
            });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(response));
        });

        it('should reject if any of the requests fails', function() {
            $httpBackend
                .expectGET(openlmisUrlFactory(BASE_URL + '?some=paramOne'))
                .respond(200, response);

            $httpBackend
                .expectGET(openlmisUrlFactory(BASE_URL + '?some=paramTwo'))
                .respond(500);

            var rejected;
            openlmisResource.query(params)
            .catch(function() {
                rejected = true;
            });
            $httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should return merged list if multiple requests were sent', function() {
            $httpBackend
                .expectGET(openlmisUrlFactory(BASE_URL + '?some=paramOne'))
                .respond(200, response);

            $httpBackend
                .expectGET(openlmisUrlFactory(BASE_URL + '?some=paramTwo'))
                .respond(200, responseTwo);

            var result;
            openlmisResource.query(params)
            .then(function(response) {
                result = response;
            });
            $httpBackend.flush();

            expect(angular.toJson(result))
                .toEqual(angular.toJson([response[0], response[1], responseTwo[0], responseTwo[1]]));
        });

    });

    describe('get', function() {

        var response;

        beforeEach(function() {
            response = {
                id: 'some-id',
                some: 'test-object'
            };
        });

        it('should resolve to server response on successful request', function() {
            $httpBackend
                .expectGET(openlmisUrlFactory(BASE_URL + '/' + response.id))
                .respond(200, response);

            var result;
            openlmisResource.get(response.id)
                .then(function(response) {
                    result = response;
                });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(response));
        });

        it('should reject on failed request', function() {
            $httpBackend
                .expectGET(openlmisUrlFactory(BASE_URL + '/' + response.id))
                .respond(400);

            var rejected;
            openlmisResource.get(response.id)
                .catch(function() {
                    rejected = true;
                });
            $httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should reject if null was given', function() {
            var rejected;
            openlmisResource.get()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

    describe('create', function() {

        var response, object;

        beforeEach(function() {
            response = {
                id: 'some-id',
                some: 'test-response'
            };

            object = {
                some: 'test-response'
            };
        });

        it('should resolve to server response on successful request', function() {
            $httpBackend
                .expectPOST(openlmisUrlFactory(BASE_URL), object)
                .respond(200, response);

            var result;
            openlmisResource.create(object)
                .then(function(response) {
                    result = response;
                });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(response));
        });

        it('should reject on failed request', function() {
            $httpBackend
                .expectPOST(openlmisUrlFactory(BASE_URL), object)
                .respond(400);

            var rejected;
            openlmisResource.create(object)
                .catch(function() {
                    rejected = true;
                });
            $httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should reject if null was given', function() {
            var rejected;
            openlmisResource.create()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

    describe('update', function() {

        var object;

        beforeEach(function() {
            object = {
                id: 'some-id',
                some: 'test-response'
            };
        });

        it('should resolve to server response on successful request', function() {
            $httpBackend
                .expectPUT(openlmisUrlFactory(BASE_URL + '/' + object.id), object)
                .respond(200, object);

            var result;
            openlmisResource.update(object)
                .then(function(object) {
                    result = object;
                });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(object));
        });

        it('should reject on failed request', function() {
            $httpBackend
                .expectPUT(openlmisUrlFactory(BASE_URL + '/' + object.id), object)
                .respond(400);

            var rejected;
            openlmisResource.update(object)
                .catch(function() {
                    rejected = true;
                });
            $httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should reject if null was given', function() {
            var rejected;
            openlmisResource.update()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

    describe('delete', function() {

        var response;

        beforeEach(function() {
            response = {
                id: 'some-id',
                some: 'test-object'
            };
        });

        it('should resolve on successful request', function() {
            $httpBackend
                .expectDELETE(openlmisUrlFactory(BASE_URL + '/' + response.id))
                .respond(200);

            var resolved;
            openlmisResource.delete(response)
                .then(function() {
                    resolved = true;
                });
            $httpBackend.flush();

            expect(resolved).toEqual(true);
        });

        it('should reject on failed request', function() {
            $httpBackend
                .expectDELETE(openlmisUrlFactory(BASE_URL + '/' + response.id))
                .respond(400);

            var rejected;
            openlmisResource.delete(response)
                .catch(function() {
                    rejected = true;
                });
            $httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should reject if null was given', function() {
            var rejected;
            openlmisResource.delete()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

    describe('throwMethodNotSupported', function() {

        it('should throw error', function() {
            expect(function() {
                openlmisResource.throwMethodNotSupported();
            }).toThrow('Method not supported');
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });

});
