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

    beforeEach(function() {
        module('openlmis-app-cache');

        inject(function($injector) {
            this.$window = $injector.get('$window');
            this.confirmService = $injector.get('confirmService');
            this.$rootScope = $injector.get('$rootScope');
            this.$controller = $injector.get('$controller');
            this.$q = $injector.get('$q');
        });

        this.applicationCacheMock = jasmine.createSpyObj('applicationCache', [
            'addEventListener', 'swapCache'
        ]);
        this.applicationCacheMock.UPDATEREADY = this.$window.applicationCache.UPDATEREADY;

        this.locationMock = jasmine.createSpyObj('location', ['reload']);

        spyOn(this.confirmService, 'confirm');

        this.vm = this.$controller('OpenlmisAppCacheController', {
            $window: {
                applicationCache: this.applicationCacheMock,
                location: this.locationMock
            }
        });
    });

    describe('$onInit', function() {

        it('should set updateReady flag to true if update is ready', function() {
            this.applicationCacheMock.status = this.$window.applicationCache.UPDATEREADY;

            this.vm.$onInit();

            expect(this.vm.updateReady).toBe(true);
        });

        it('should set updateReady flag to false if update is not ready', function() {
            this.applicationCacheMock.status = this.$window.applicationCache.CHECKING;

            this.vm.$onInit();

            expect(this.vm.updateReady).toBe(false);
        });

        it('should set a listener for appCache.UPDATEREADY', function() {
            var callback;
            this.applicationCacheMock.addEventListener.and.callFake(function(event, handler) {
                if (event === 'updateready') {
                    callback = handler;
                }
            });

            this.vm.$onInit();

            expect(this.vm.updateReady).toBe(false);

            this.applicationCacheMock.status = this.$window.applicationCache.UPDATEREADY;

            callback();

            expect(this.vm.updateReady).toBe(true);
        });

    });

    describe('updateCache', function() {

        beforeEach(function() {
            this.vm.$onInit();
        });

        it('should do nothing if update is not ready', function() {
            this.vm.updateReady = false;

            this.vm.updateCache();
            this.$rootScope.$apply();

            expect(this.confirmService.confirm).not.toHaveBeenCalled();
            expect(this.applicationCacheMock.swapCache).not.toHaveBeenCalled();
            expect(this.locationMock.reload).not.toHaveBeenCalled();
        });

        it('should open confirmation modal before anything', function() {
            this.vm.updateReady = true;
            this.confirmService.confirm.and.returnValue(this.$q.resolve());

            this.vm.updateCache();

            expect(this.confirmService.confirm).toHaveBeenCalledWith(
                'openlmisAppCache.cacheUpdate.message',
                'openlmisAppCache.cacheUpdate.label',
                'openlmisAppCache.cacheUpdate.cancel',
                'openlmisAppCache.cacheUpdate.title'
            );

            expect(this.applicationCacheMock.swapCache).not.toHaveBeenCalled();
            expect(this.locationMock.reload).not.toHaveBeenCalled();
        });

        it('should swap cache and reload after confirmation', function() {
            this.vm.updateReady = true;
            this.confirmService.confirm.and.returnValue(this.$q.resolve());

            this.vm.updateCache();
            this.$rootScope.$apply();

            expect(this.confirmService.confirm).toHaveBeenCalled();
            expect(this.applicationCacheMock.swapCache).toHaveBeenCalled();
            expect(this.locationMock.reload).toHaveBeenCalled();
        });

        it('should swap cache and reload on logout after rejection', function() {
            this.vm.updateReady = true;
            this.confirmService.confirm.and.returnValue(this.$q.reject());

            this.vm.updateCache();
            this.$rootScope.$apply();

            expect(this.confirmService.confirm).toHaveBeenCalled();
            expect(this.applicationCacheMock.swapCache).toHaveBeenCalled();
            expect(this.locationMock.reload).not.toHaveBeenCalled();

            this.$rootScope.$emit('openlmis-auth.logout');

            expect(this.locationMock.reload).toHaveBeenCalled();
        });

    });

});
