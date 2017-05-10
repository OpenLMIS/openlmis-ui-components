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

describe('SavingIndicatorController', function() {

    var vm, scope, $timeout, $rootScope, $controller;

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            $timeout = $injector.get('$timeout');
        });

        scope = $rootScope.$new();
        scope.object = {
            requisitionLineItems: [
                {
                    value: 1
                }
            ]
        };

        vm = $controller('SavingIndicatorController', {
            $scope: scope
        });
    });

    describe('onInit', function() {

        beforeEach(function() {
            spyOn(scope, '$watch').andCallThrough();
        });

        it('should set icon class and message', function() {
            vm.$onInit();

            expect(vm.iconClass).toBe('saved');
            expect(vm.message).toBe('openlmisForm.changesSaved');
        });

        it('should set watcher', function() {
            vm.$onInit();

            expect(scope.$watch).toHaveBeenCalled();
        });
    });

    describe('saving status', function() {

        beforeEach(function() {
            vm.$onInit();
            scope.$digest();
        });

        it('should not change status if changes were not made', function() {
            scope.object.requisitionLineItems[0].value = 1;
            scope.$digest();

            $timeout.verifyNoPendingTasks();
            expect(vm.iconClass).toBe('saved');
            expect(vm.message).toBe('openlmisForm.changesSaved');
        });

        it('should change status to saving after changes were made', function() {
            scope.object.requisitionLineItems[0].value = 2;
            scope.$digest();

            expect(vm.iconClass).toBe('saving');
            expect(vm.message).toBe('openlmisForm.savingChanges');
        });

        it('should change status back to saved after timeout', function() {
            scope.object.requisitionLineItems[0].value = 2;
            scope.$digest();
            $timeout.flush();

            expect(vm.iconClass).toBe('saved');
            expect(vm.message).toBe('openlmisForm.changesSaved');
        });
    });
});
