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

describe('AdjustmentsModalController', function() {
/**
    var vm, $q, $controller, requisition, adjustments, reasons, lineItem, modalDeferred;

    beforeEach(function() {
        module('openlmis-adjustments');

        inject(function($injector) {
            $q = $injector.get('$q');
            $controller = $injector.get('$controller');
        });

        adjustments = [];
        reasons = [];

        modalDeferred = $q.defer();

        vm = $controller('AdjustmentsModalController', {
            adjustments: adjustments,
            reasons: reasons,
            modalDeferred: modalDeferred,
            title: 'Some title',
            totals: undefined,
            message: undefined,
            getReasonName: undefined
        });
    });

    describe('$onInit', function() {

        it('should expose adjustments', function() {
            vm.$onInit();

            expect(vm.adjustments).toBe(adjustments);
        });

        it('should fetch stock adjustment reasons', function() {
            vm.$onInit();

            expect(vm.reasons).toBe(reasons);
        });

    });

    describe('addAdjustment', function() {

        var adjustment;

        beforeEach(function() {
            adjustment = {
                reason: {
                    id: 2
                },
                quantity: 10
            };

            vm.adjustment = angular.merge({}, adjustment);

            vm.$onInit();
        });

        it('should add adjustment to stock adjustments', function() {
            vm.addAdjustment();

            expect(adjustments).toEqual([{
                reasonId: adjustment.reason.id,
                quantity: adjustment.quantity
            }]);
        });

        it('should clear form after adding adjustment', function() {
            expect(vm.adjustment.quantity).not.toBeUndefined();
            expect(vm.adjustment.reason).not.toBeUndefined();

            vm.addAdjustment();

            expect(vm.adjustment.quantity).toBeUndefined();
            expect(vm.adjustment.reason).toBeUndefined();
        });

    });

    describe('removeAdjustment', function() {

        var adjustment;

        beforeEach(function() {
            adjustment = {
                reasonId: 321,
                quantity: 11
            };

            vm.adjustments = [
                {
                    reasonId: 123,
                    quantity: 10
                },
                adjustment
            ];
        });

        it('should remove adjustment', function() {
            vm.removeAdjustment(adjustment);

            expect(vm.adjustments).toEqual([{
                reasonId: 123,
                quantity: 10
            }]);
        });
    });*/
});
