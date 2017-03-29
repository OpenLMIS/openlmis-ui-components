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

describe('NonFullSupplyController', function() {

    var vm, RequisitionCategory, addProductModalService, requisition, $q, requisitionValidator,
        lineItems, $rootScope, $controller, LineItem, stateParams, $state;

    beforeEach(function(){
        module('requisition-non-full-supply');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            $state = $injector.get('$state');
        });

        requisitionValidator = jasmine.createSpyObj('requisitionValidator', ['isLineItemValid']);
        addProductModalService = jasmine.createSpyObj('addProductModalService', ['show']);

        requisition = jasmine.createSpyObj('requisition', ['$isApproved', '$isAuthorized', '$isInApproval', '$isReleased']);
        requisition.template = jasmine.createSpyObj('RequisitionTemplate', ['getColumns']);
        requisition.requisitionLineItems = [
            lineItemSpy(0, 'One', true),
            lineItemSpy(1, 'Two', true),
            lineItemSpy(2, 'One', true),
            lineItemSpy(3, 'Two', true),
            lineItemSpy(4, 'Three', false)
        ];
        lineItems = [requisition.requisitionLineItems];

        stateParams = {
            page: 0,
            size: 10
        };
    });

    describe('initialization', function() {

        it('should bind requisitionValidator.isLineItemValid method to vm', function() {
            requisition.$isApproved.andReturn(false);
            requisition.$isAuthorized.andReturn(false);

            initController();

            expect(vm.isLineItemValid).toBe(requisitionValidator.isLineItemValid);
        });

        it('should bind requisition property to vm', function() {
            requisition.$isApproved.andReturn(false);
            requisition.$isAuthorized.andReturn(false);

            initController();

            expect(vm.requisition).toBe(requisition);
        });

        it('should display add product button if requisition is not authorized or approved', function() {
            requisition.$isApproved.andReturn(false);
            requisition.$isAuthorized.andReturn(false);

            initController();

            expect(vm.displayAddProductButton).toBe(true);
        });

        it('should not display add product button if requisition is authorized', function() {
            requisition.$isApproved.andReturn(false);
            requisition.$isAuthorized.andReturn(true);

            initController();

            expect(vm.displayAddProductButton).toBe(false);
        });

        it('should not display add product button if requisition is approved', function() {
            requisition.$isApproved.andReturn(true);
            requisition.$isAuthorized.andReturn(false);

            initController();

            expect(vm.displayAddProductButton).toBe(false);
        });

        it('should not display add product button if requisition is in approval', function() {
            requisition.$isApproved.andReturn(false);
            requisition.$isAuthorized.andReturn(false);
            requisition.$isReleased.andReturn(false);
            requisition.$isInApproval.andReturn(true);

            initController();

            expect(vm.displayAddProductButton).toBe(false);
        });

        it('should not display add product button if requisition is released', function() {
            requisition.$isApproved.andReturn(false);
            requisition.$isAuthorized.andReturn(false);
            requisition.$isReleased.andReturn(true);

            initController();

            expect(vm.displayAddProductButton).toBe(false);
        });

    });

    describe('deleteLineItem', function() {

        beforeEach(function() {
            requisition.$isApproved.andReturn(false);
            requisition.$isAuthorized.andReturn(false);
            initController();
            spyOn($state, 'reload').andReturn();
        });

        it('should delete line item if it exist', function() {
            var lineItem = requisition.requisitionLineItems[2];
            var product = lineItem.orderable;

            vm.deleteLineItem(lineItem);

            expect(requisition.requisitionLineItems.length).toBe(4);
            expect(requisition.requisitionLineItems.indexOf(lineItem)).toBe(-1);
        });

        it('should not delete lineItem if it doesn\'t exist', function() {
            spyOn(requisition.requisitionLineItems, 'splice');

            vm.deleteLineItem(lineItemSpy(5, 'Three', false));

            expect(requisition.requisitionLineItems.length).toBe(5);
            expect(requisition.requisitionLineItems.splice).not.toHaveBeenCalled();
        });

        it('should not make the product visible if the item wasn\'t removed', function() {
            var lineItem = lineItemSpy(5, 'Three', false);
            var product = lineItem.orderable;

            vm.deleteLineItem(lineItem);

            expect(product.$visible).toBe(false);
        });

    });

    describe('addProduct', function() {

        beforeEach(function() {
            LineItem = jasmine.createSpy();
            requisition.program = {
                id: 'program-id'
            };
            initController();
        });

        it('should add product', function() {
            addProductModalService.show.andReturn($q.when(lineItemSpy(5, 'Three', false)));

            vm.addProduct();
            $rootScope.$apply();

            expect(addProductModalService.show).toHaveBeenCalled();
            expect(requisition.requisitionLineItems.length).toBe(6);
        });

        it('should not add product if modal was dismissed', function() {
            var deferred = $q.defer();
            spyOn(requisition.requisitionLineItems, 'push');
            addProductModalService.show.andReturn(deferred.promise);

            vm.addProduct();
            deferred.reject();
            $rootScope.$apply();

            expect(addProductModalService.show).toHaveBeenCalled();
            expect(requisition.requisitionLineItems.length).toBe(5);
            expect(requisition.requisitionLineItems.push).not.toHaveBeenCalled();
        });

    });

    describe('displayDeleteColumn', function() {

        beforeEach(function() {
            initController();
        });

        it('should return true if any line item is deletable', function() {
            requisition.requisitionLineItems[1].$deletable = true;

            var result = vm.displayDeleteColumn();

            expect(result).not.toBe(false);
        });

        it('should return false if none of the line items is deletable', function() {
            var result = vm.displayDeleteColumn();

            expect(result).not.toBe(true);
        });

    });

    function initController() {
        vm = $controller('NonFullSupplyController', {
            allItems: [],
            columns: [],
            LineItem: LineItem,
            requisition: requisition,
            addProductModalService: addProductModalService,
            requisitionValidator: requisitionValidator
        });
    }

    function lineItemSpy(id, category, fullSupply) {
        var lineItem = jasmine.createSpyObj('lineItem', ['canBeSkipped']);
        lineItem.canBeSkipped.andReturn(true);
        lineItem.skipped = false;
        lineItem.$id = id;
        lineItem.orderable = {
            $visible: false
        };
        lineItem.$program = {
            orderableCategoryDisplayName: category,
            fullSupply: fullSupply
        };
        return lineItem;
    }

});
