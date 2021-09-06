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

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$rootScope = $injector.get('$rootScope');
            this.$timeout = $injector.get('$timeout');
        });

        this.scope = this.$rootScope.$new();
        this.scope.object = {
            requisitionLineItems: [
                {
                    value: 1
                }
            ]
        };

        this.vm = this.$controller('SavingIndicatorController', {
            $scope: this.scope
        });
    });

    describe('onInit', function() {

        beforeEach(function() {
            spyOn(this.scope, '$watch').and.callThrough();
        });

        it('should set icon class and message', function() {
            this.vm.$onInit();

            expect(this.vm.iconClass).toBe('saved');
            expect(this.vm.message).toBe('openlmisForm.changesSaved');
        });

        it('should set watcher', function() {
            this.vm.$onInit();

            expect(this.scope.$watch).toHaveBeenCalled();
        });
    });

    describe('saving status', function() {

        beforeEach(function() {
            this.vm.$onInit();
            this.scope.$digest();
        });

        it('should not change status if changes were not made', function() {
            this.scope.object.requisitionLineItems[0].value = 1;
            this.scope.$digest();

            expect(this.vm.iconClass).toBe('saved');
            expect(this.vm.message).toBe('openlmisForm.changesSaved');
        });

        it('should change status to saving after changes were made', function() {
            this.scope.object.requisitionLineItems[0].value = 2;
            this.scope.$digest();

            expect(this.vm.iconClass).toBe('saving');
            expect(this.vm.message).toBe('openlmisForm.savingChanges');
        });

        it('should change status back to saved after timeout', function() {
            this.scope.object.requisitionLineItems[0].value = 2;
            this.scope.$digest();
            this.$timeout.flush();

            expect(this.vm.iconClass).toBe('saved');
            expect(this.vm.message).toBe('openlmisForm.changesSaved');
        });
    });
});
