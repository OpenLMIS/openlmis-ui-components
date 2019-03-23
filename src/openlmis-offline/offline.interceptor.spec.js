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

    var offlineInterceptor, offlineService, alertServiceMock, interceptors, $rootScope, $q;

    beforeEach(function() {
        module('openlmis-offline', function($provide, $httpProvider) {
            interceptors = $httpProvider.interceptors;

            alertServiceMock = jasmine.createSpyObj('alertService', ['error']);
            $provide.service('alertService', function() {
                return alertServiceMock;
            });
        });

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            offlineService = $injector.get('offlineService');
            offlineInterceptor = $injector.get('offlineInterceptor');
        });

    });

    describe('request', function() {

        var promise,
            returnedConfig,
            config = {
                url: 'some.url'
            };

        beforeEach(function() {
            spyOn(offlineService, 'isOffline').and.returnValue(true);
            alertServiceMock.error.and.callFake(function() {
                promise = $q.defer();
                return promise.promise;
            });
            returnedConfig = offlineInterceptor.request(config);
        });

        it('should be registered', function() {
            expect(interceptors.indexOf('offlineInterceptor')).toBeGreaterThan(-1);
        });

        it('should check if is offline', function() {
            expect(offlineService.isOffline).toHaveBeenCalled();
        });

        it('should show alert modal', function() {
            expect(alertServiceMock.error).toHaveBeenCalledWith('openlmisOffline.actionNotAllowedOffline');
        });

        it('should not show second alert modal when first is not closed', function() {
            offlineInterceptor.request(config);

            expect(alertServiceMock.error.calls.count()).toBe(1);
        });

        it('should show second alert modal when first is not closed', function() {
            promise.resolve();
            $rootScope.$apply();
            offlineInterceptor.request(config);

            expect(alertServiceMock.error.calls.count()).toBe(2);
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

            returnedConfig = offlineInterceptor.request(config);

            returnedConfig.timeout.then(function() {
                isResolved = true;
            });
            $rootScope.$apply();

            expect(isResolved).toBe(false);
        });
    });
});
