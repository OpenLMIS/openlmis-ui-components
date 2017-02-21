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

    'use strict';

    var scope, directiveElem, offlineService, compile;

    beforeEach(function() {
        module('openlmis-offline');

        inject(function($rootScope, _offlineService_, $compile){
            scope = $rootScope.$new();
            offlineService = _offlineService_;
            compile = $compile;
        });
    });

        it('should show offline label if user is offline', function () {
            spyOn(offlineService, 'isOffline').andReturn(true);

            var rootElement = angular.element('<a offline ng-show="isOffline">Offline</a>');
            directiveElem = compile(rootElement)(scope);
            scope.$digest();

            expect(directiveElem.hasClass('ng-hide')).toBe(false);
        });

        it('should not show offline label if user is online', function () {
            spyOn(offlineService, 'isOffline').andReturn(false);

            var rootElement = angular.element('<a offline ng-show="isOffline">Offline</a>');
            directiveElem = compile(rootElement)(scope);
            scope.$digest();

            expect(directiveElem.hasClass('ng-hide')).toBe(true);
        });

        it('should update scope.isOffline if offline status changes', function(){
            var offlineStatus = false;
            spyOn(offlineService, 'isOffline').andCallFake(function(){
                return offlineStatus;
            });

            var element = compile('<a offline ng-show="isOffline">Offline</a>')(scope);
            scope.$digest();

            expect(scope.isOffline).toBe(false);

            offlineStatus = true;
            scope.$apply();

            expect(scope.isOffline).toBe(true);
        });

        it('should call connection check after clicking on offline label', function () {
            spyOn(offlineService, 'isOffline').andReturn(true);
            spyOn(offlineService, 'checkConnection');

            var rootElement = angular.element('<a offline ng-show="isOffline" ng-click="checkConnection()">Offline</a>');
            directiveElem = compile(rootElement)(scope);
            scope.$digest();

            directiveElem.click();

            expect(offlineService.checkConnection).toHaveBeenCalled();
            expect(directiveElem.hasClass('ng-hide')).toBe(false);
        });

        it('should change class if user is offline', function () {
            spyOn(offlineService, 'isOffline').andReturn(true);

            var rootElement = angular.element('<div offline ng-class="{\'isOffline\':isOffline}"></div>');
            directiveElem = compile(rootElement)(scope);
            scope.$digest();

            expect(directiveElem.hasClass('isOffline')).toBe(true);
        });

        it('should not change class if user is online', function () {
            spyOn(offlineService, 'isOffline').andReturn(false);

            var rootElement = angular.element('<div offline ng-class="{\'isOffline\':isOffline}"></div>');
            directiveElem = compile(rootElement)(scope);
            scope.$digest();

            expect(directiveElem.hasClass('isOffline')).toBe(false);
        });
    });
