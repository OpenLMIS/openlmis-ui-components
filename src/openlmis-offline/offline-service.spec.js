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

describe('offlineService', function() {

    beforeEach(function() {
        this.storedFlag = jasmine.createSpyObj('storedFlag', ['put', 'clearAll', 'getAll']);
        this.storedFlag.getAll.and.returnValue([false]);

        var storedFlag = this.storedFlag;
        module('openlmis-offline', function($provide) {
            $provide.factory('localStorageFactory', function() {
                return function() {
                    return storedFlag;
                };
            });
        });

        inject(function($injector) {
            this.offlineService = $injector.get('offlineService');
            this.Offline = $injector.get('Offline');
            this.$timeout = $injector.get('$timeout');
            this.$rootScope = $injector.get('$rootScope');
        });
    });

    describe('init', function() {
        it('should restore offline flag if it was stored in local storage', function() {
            expect(this.storedFlag.getAll).toHaveBeenCalled();
            expect(this.offlineService.isOffline()).toBe(false);
        });
    });

    describe('isOffline', function() {

        it('should return false when there is internet connection', function() {
            var spy = jasmine.createSpy();
            this.$rootScope.$on('openlmis.online', spy);

            var Offline = this.Offline;
            spyOn(Offline, 'check').and.callFake(function() {
                Offline.trigger('confirmed-up');
            });

            this.offlineService.checkConnection();
            this.$timeout.flush(30001);

            var isOffline = this.offlineService.isOffline();

            expect(isOffline).toBe(false);
            expect(this.storedFlag.clearAll).toHaveBeenCalled();
            expect(this.storedFlag.put).toHaveBeenCalledWith(false);
            expect(spy).toHaveBeenCalled();
        });

        it('should return true when there is no internet connection', function() {
            var spy = jasmine.createSpy();
            this.$rootScope.$on('openlmis.offline', spy);

            var Offline = this.Offline;
            spyOn(Offline, 'check').and.callFake(function() {
                Offline.trigger('confirmed-down');
            });

            this.offlineService.checkConnection();
            this.$timeout.flush(30001);

            var isOffline = this.offlineService.isOffline();

            expect(isOffline).toBe(true);
            expect(this.storedFlag.clearAll).toHaveBeenCalled();
            expect(this.storedFlag.put).toHaveBeenCalledWith(true);
            expect(spy).toHaveBeenCalled();
        });

        it('should return false when the connection has gone from down to up', function() {
            var spy = jasmine.createSpy();
            this.$rootScope.$on('openlmis.online', spy);

            var Offline = this.Offline;
            spyOn(Offline, 'check').and.callFake(function() {
                Offline.trigger('up');
            });

            this.offlineService.checkConnection();
            this.$timeout.flush(30001);

            var isOffline = this.offlineService.isOffline();

            expect(isOffline).toBe(false);
            expect(this.storedFlag.clearAll).toHaveBeenCalled();
            expect(this.storedFlag.put).toHaveBeenCalledWith(false);
            expect(spy).toHaveBeenCalled();
        });

        it('should return true when the connection has gone from up to down', function() {
            var spy = jasmine.createSpy();
            this.$rootScope.$on('openlmis.offline', spy);

            var Offline = this.Offline;
            spyOn(Offline, 'check').and.callFake(function() {
                Offline.trigger('down');
            });

            this.offlineService.checkConnection();
            this.$timeout.flush(30001);

            var isOffline = this.offlineService.isOffline();

            expect(isOffline).toBe(true);
            expect(this.storedFlag.clearAll).toHaveBeenCalled();
            expect(this.storedFlag.put).toHaveBeenCalledWith(true);
            expect(spy).toHaveBeenCalled();
        });

    });

});
