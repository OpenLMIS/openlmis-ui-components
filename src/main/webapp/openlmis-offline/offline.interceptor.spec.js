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

describe('offlineInterceptor', function() {

    var provider, offlineService, alertServiceMock;

    beforeEach(function() {
        module('openlmis-offline', function($provide, $httpProvider) {
            interceptors = $httpProvider.interceptors;

            alertServiceMock = jasmine.createSpyObj('alertService', ['error']);
            $provide.service('alertService', function() {
                return alertServiceMock;
            });
        });

        inject(function(offlineInterceptor, _$rootScope_, _$q_, _offlineService_) {
            provider = offlineInterceptor;
            $q = _$q_;
            $rootScope = _$rootScope_;
            offlineService = _offlineService_;
        });


    });

    describe('request', function() {

        var promise,
            returnedConfig,
            config = {
                url: 'some.url'
            };

        beforeEach(function() {
            spyOn(offlineService, 'isOffline').andReturn(true);
            alertServiceMock.error.andCallFake(function() {
                promise = $q.defer();
                return promise.promise;
            });
            returnedConfig = provider.request(config);
        });

        it('should be registered', function() {
            expect(interceptors.indexOf('offlineInterceptor') > -1).toBe(true);
        });

        it('should check if is offline', function() {
            expect(offlineService.isOffline).toHaveBeenCalled();
        });

        it('should show alert modal', function() {
            expect(alertServiceMock.error).toHaveBeenCalledWith('error.actionNotAllowedOffline');
        });

        it('should not show second alert modal when first is not closed', function() {
            provider.request(config);
            expect(alertServiceMock.error.callCount).toBe(1);
        });

        it('should show second alert modal when first is not closed', function() {
            promise.resolve();
            $rootScope.$apply();
            provider.request(config);
            expect(alertServiceMock.error.callCount).toBe(2);
        });

        it('should resolve cancel promise', function() {
            var isResolved = false;
            returnedConfig.timeout.then(function() {
                isResolved = true;
            });
            $rootScope.$apply();
            expect(isResolved).toBe(true);
        });

        it('should pass through .html urls', function() {

            var isResolved = false;
            config = {
                url: 'some.html'
            };

            returnedConfig = provider.request(config);

            returnedConfig.timeout.then(function() {
                isResolved = true;
            });
            $rootScope.$apply();

            expect(isResolved).toBe(false);
        });
    });
});
