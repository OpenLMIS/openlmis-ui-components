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

describe('OpenlmisAppCacheController', function() {

    var vm, $controller, $window, $rootScope, confirmService, applicationCacheMock, locationMock,
        $q;

    beforeEach(function() {
        module('openlmis-app-cache');

        inject(function($injector) {
            $window = $injector.get('$window');
            confirmService = $injector.get('confirmService');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            $q = $injector.get('$q');
        });

        applicationCacheMock = jasmine.createSpyObj('applicationCache', [
            'addEventListener', 'swapCache'
        ]);
        applicationCacheMock.UPDATEREADY = $window.applicationCache.UPDATEREADY;

        locationMock = jasmine.createSpyObj('location', ['reload']);

        spyOn(confirmService, 'confirm');

        vm = $controller('OpenlmisAppCacheController', {
            $window: {
                applicationCache: applicationCacheMock,
                location: locationMock
            }
        });
    });

    describe('$onInit', function() {

        it('should set updateReady flag to true if update is ready', function() {
            applicationCacheMock.status = $window.applicationCache.UPDATEREADY;

            vm.$onInit();

            expect(vm.updateReady).toBe(true);
        });

        it('should set updateReady flag to false if update is not ready', function() {
            applicationCacheMock.status = $window.applicationCache.CHECKING;

            vm.$onInit();

            expect(vm.updateReady).toBe(false);
        });

        it('should set a listener for appCache.UPDATEREADY', function() {
            var callback;
            applicationCacheMock.addEventListener.andCallFake(function(event, handler) {
                if (event === 'updateready') {
                    callback = handler;
                }
            });

            vm.$onInit();

            expect(vm.updateReady).toBe(false);

            applicationCacheMock.status = $window.applicationCache.UPDATEREADY;

            callback();

            expect(vm.updateReady).toBe(true);
        });

    });

    describe('updateCache', function() {

        beforeEach(function() {
            vm.$onInit();
        });

        it('should do nothing if update is not ready', function() {
            vm.updateReady = false;

            vm.updateCache();
            $rootScope.$apply();

            expect(confirmService.confirm).not.toHaveBeenCalled();
            expect(applicationCacheMock.swapCache).not.toHaveBeenCalled();
            expect(locationMock.reload).not.toHaveBeenCalled();
        });

        it('should open confirmation modal before anything', function() {
            vm.updateReady = true;
            confirmService.confirm.andReturn($q.resolve());

            vm.updateCache();

            expect(confirmService.confirm).toHaveBeenCalledWith(
                'openlmisAppCache.cacheUpdate.message',
                'openlmisAppCache.cacheUpdate.label',
                'openlmisAppCache.cacheUpdate.cancel',
                'openlmisAppCache.cacheUpdate.title'
            );
            expect(applicationCacheMock.swapCache).not.toHaveBeenCalled();
            expect(locationMock.reload).not.toHaveBeenCalled();
        });

        it('should swap cache and reload after confirmation', function() {
            vm.updateReady = true;
            confirmService.confirm.andReturn($q.resolve());

            vm.updateCache();
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalled();
            expect(applicationCacheMock.swapCache).toHaveBeenCalled();
            expect(locationMock.reload).toHaveBeenCalled();
        });

        it('should swap cache and reload on logout after rejection', function() {
            vm.updateReady = true;
            confirmService.confirm.andReturn($q.reject());

            vm.updateCache();
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalled();
            expect(applicationCacheMock.swapCache).toHaveBeenCalled();
            expect(locationMock.reload).not.toHaveBeenCalled();

            $rootScope.$emit('openlmis-auth.logout');

            expect(locationMock.reload).toHaveBeenCalled();
        });

    });

});
