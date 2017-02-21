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

describe('validationFactory', function() {

    var validationFactory, TEMPLATE_COLUMNS, messageServiceMock, columnUtilsMock,
        calculationFactoryMock, requisitionMock, lineItem;

    beforeEach(function() {
        module('requisition-validation', function($provide) {
            messageServiceMock = jasmine.createSpyObj('messageService', ['get']);
            calculationFactoryMock = jasmine.createSpyObj('calculationFactory', ['calculatedOrderQuantity']);

            $provide.factory('messageService', function() {
                return messageServiceMock;
            });

            $provide.factory('calculationFactory', function() {
                return calculationFactoryMock;
            });
        });

        inject(function($injector) {
            validationFactory = $injector.get('validationFactory');
            TEMPLATE_COLUMNS = $injector.get('TEMPLATE_COLUMNS');
        });

        requisitionMock = {
            template: jasmine.createSpyObj('template', ['getColumn'])
        };

        lineItem = {};
    });

    describe('stockOnHand', function() {

        beforeEach(function() {
            messageServiceMock.get.andReturn('negative');
        });

        it('should return undefined if stock on hand is non negative', function() {
            lineItem.stockOnHand = 0;

            expect(validationFactory.stockOnHand(lineItem)).toBeUndefined();
        });

        it('should return "negative" if stock on hand is negative', function() {
            lineItem.stockOnHand = -1;

            expect(validationFactory.stockOnHand(lineItem)).toEqual('negative');
        });

    });

    describe('totalConsumedQuantity', function() {

        beforeEach(function() {
            messageServiceMock.get.andReturn('negative');
        });

        it('should return undefined if stock on hand is non negative', function() {
            lineItem.totalConsumedQuantity = 0;

            expect(validationFactory.totalConsumedQuantity(lineItem)).toBeUndefined();
        });

        it('should return "negative" if stock on hand is negative', function() {
            lineItem.totalConsumedQuantity = -1;

            expect(validationFactory.totalConsumedQuantity(lineItem)).toEqual('negative');
        });

    });

    describe('requestedQuantityExplanation', function() {

        var jColumn, iColumn;

        beforeEach(function() {
            jColumn = {
                name: TEMPLATE_COLUMNS.REQUESTED_QUANTITY,
                $display: true
            };

            iColumn = {
                name: TEMPLATE_COLUMNS.CALCULATED_ORDER_QUANTITY,
                $display: true
            };

            messageServiceMock.get.andReturn('required');
            requisitionMock.template.getColumn.andCallFake(function(name) {
                if (name === TEMPLATE_COLUMNS.REQUESTED_QUANTITY) return jColumn;
                if (name === TEMPLATE_COLUMNS.CALCULATED_ORDER_QUANTITY) return iColumn;
            });
        });

        it('should return undefined if requestedQuantity column is not present', function() {
            requisitionMock.template.getColumn.andReturn(undefined);

            expect(validationFactory.requestedQuantityExplanation(lineItem, requisitionMock))
                .toBeUndefined();
        });

        it('should return undefined if requestedQuantity column is not displayed', function() {
            jColumn.$display = false;

            expect(validationFactory.requestedQuantityExplanation(lineItem, requisitionMock))
                .toBeUndefined();
        });

        it('should return undefined if requestedQuantity is null', function() {
            lineItem.requestedQuantity = null;

            expect(validationFactory.requestedQuantityExplanation(lineItem, requisitionMock))
                .toBeUndefined();
        });

        it('should return undefined if requestedQuantity is undefined', function() {
            lineItem.requestedQuantity = undefined;

            expect(validationFactory.requestedQuantityExplanation(lineItem, requisitionMock))
                .toBeUndefined();
        });

        it('should return "required" if quantities differ and explanation is missing', function() {
            lineItem.requestedQuantity = 10;
            lineItem.requestedQuantityExplanation = undefined;
            calculationFactoryMock.calculatedOrderQuantity.andReturn(5);

            expect(validationFactory.requestedQuantityExplanation(lineItem, requisitionMock))
                .toEqual('required');
        });

        it('should return undefined if quantities differ and explanation is given', function() {
            lineItem.requestedQuantity = 10;
            lineItem.requestedQuantityExplanation = 'explanation';
            calculationFactoryMock.calculatedOrderQuantity.andReturn(5);

            expect(validationFactory.requestedQuantityExplanation(lineItem, requisitionMock))
                .toBeUndefined();
        });

        it('should return undefined if quantities are equal and explanation is missing', function() {
            lineItem.requestedQuantity = 10;
            lineItem.requestedQuantityExplanation = undefined;
            calculationFactoryMock.calculatedOrderQuantity.andReturn(10);

            expect(validationFactory.requestedQuantityExplanation(lineItem, requisitionMock))
                .toBeUndefined();
        });

        it('should return "required" if requestedQuantity is greater than 0 and explanation is missing', function() {
            requisitionMock.template.getColumn.andCallFake(function(name) {
                if (name === TEMPLATE_COLUMNS.REQUESTED_QUANTITY) return jColumn;
            });
            lineItem.requestedQuantity = 10;
            lineItem.requestedQuantityExplanation = undefined;

            expect(validationFactory.requestedQuantityExplanation(lineItem, requisitionMock))
                .toEqual('required');
        });

        it('should return undefined if requestedQuantity is 0 and explanation is missing', function() {
            requisitionMock.template.getColumn.andCallFake(function(name) {
                if (name === TEMPLATE_COLUMNS.REQUESTED_QUANTITY) return jColumn;
            });
            lineItem.requestedQuantity = 0;
            lineItem.requestedQuantityExplanation = undefined;

            expect(validationFactory.requestedQuantityExplanation(lineItem, requisitionMock))
                .toBeUndefined();
        });

        it('should return undefined if requestedQuantity is greater than 0 and explanation is given', function() {
            requisitionMock.template.getColumn.andCallFake(function(name) {
                if (name === TEMPLATE_COLUMNS.REQUESTED_QUANTITY) return jColumn;
            });
            lineItem.requestedQuantity = 10;
            lineItem.requestedQuantityExplanation = 'explanation';

            expect(validationFactory.requestedQuantityExplanation(lineItem, requisitionMock))
                .toBeUndefined();
        });

    });

    describe('totalStockoutDays', function() {

        beforeEach(function() {
            messageServiceMock.get.andReturn('valueExceedPeriodDuration');
        });

        var period = {
            durationInMonths: 1
        };

        it('should return undefined if total stock out days are non negative', function() {
            lineItem.totalStockoutDays = 0;

            expect(validationFactory.totalStockoutDays(lineItem, {processingPeriod: period})).toBeUndefined();
        });

        it('should return "valueExceedPeriodDuration" if total stock out days exceed number of days in period', function() {
            lineItem.totalStockoutDays = 100;

            expect(validationFactory.totalStockoutDays(lineItem, {processingPeriod: period}))
                .toEqual('valueExceedPeriodDuration');
        });

    });

});
