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

describe('offline', function() {

    beforeEach(function() {
        module('openlmis-offline');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.offlineService = $injector.get('offlineService');
            this.$compile = $injector.get('$compile');
        });

        this.scope = this.$rootScope.$new();
    });

    it('should show offline label if user is offline', function() {
        spyOn(this.offlineService, 'isOffline').andReturn(true);

        var rootElement = angular.element('<a offline ng-show="isOffline">Offline</a>');
        this.directiveElem = this.$compile(rootElement)(this.scope);
        this.scope.$digest();

        expect(this.directiveElem.hasClass('ng-hide')).toBe(false);
    });

    it('should not show offline label if user is online', function() {
        spyOn(this.offlineService, 'isOffline').andReturn(false);

        var rootElement = angular.element('<a offline ng-show="isOffline">Offline</a>');
        this.directiveElem = this.$compile(rootElement)(this.scope);
        this.scope.$digest();

        expect(this.directiveElem.hasClass('ng-hide')).toBe(true);
    });

    it('should update scope.isOffline if offline status changes', function() {
        var offlineStatus = false;
        spyOn(this.offlineService, 'isOffline').andCallFake(function() {
            return offlineStatus;
        });

        this.$compile('<a offline ng-show="isOffline">Offline</a>')(this.scope);
        this.scope.$digest();

        expect(this.scope.isOffline).toBe(false);

        offlineStatus = true;
        this.scope.$apply();

        expect(this.scope.isOffline).toBe(true);
    });

    it('should call connection check after clicking on offline label', function() {
        spyOn(this.offlineService, 'isOffline').andReturn(true);
        spyOn(this.offlineService, 'checkConnection');

        var rootElement = angular.element('<a offline ng-show="isOffline" ng-click="checkConnection()">Offline</a>');
        this.directiveElem = this.$compile(rootElement)(this.scope);
        this.scope.$digest();

        this.directiveElem.click();

        expect(this.offlineService.checkConnection).toHaveBeenCalled();
        expect(this.directiveElem.hasClass('ng-hide')).toBe(false);
    });

    it('should change class if user is offline', function() {
        spyOn(this.offlineService, 'isOffline').andReturn(true);

        var rootElement = angular.element('<div offline ng-class="{\'isOffline\':isOffline}"></div>');
        this.directiveElem = this.$compile(rootElement)(this.scope);
        this.scope.$digest();

        expect(this.directiveElem.hasClass('isOffline')).toBe(true);
    });

    it('should not change class if user is online', function() {
        spyOn(this.offlineService, 'isOffline').andReturn(false);

        var rootElement = angular.element('<div offline ng-class="{\'isOffline\':isOffline}"></div>');
        this.directiveElem = this.$compile(rootElement)(this.scope);
        this.scope.$digest();

        expect(this.directiveElem.hasClass('isOffline')).toBe(false);
    });
});
