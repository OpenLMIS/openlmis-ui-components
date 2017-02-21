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

describe('requisitionValidator', function() {

    var validator, TEMPLATE_COLUMNS, COLUMN_SOURCES, calculationFactory, validationFactory,
        lineItem, lineItems, column, columns, requisition;

    beforeEach(function() {
        module('requisition-validation', function($provide) {
            var methods = [
                'stockOnHand',
                'totalConsumedQuantity',
                'requestedQuantityExplanation'
            ];
            validationFactory = jasmine.createSpyObj('validationFactory', methods);

            $provide.service('validationFactory', function() {
                return validationFactory;
            });
        });

        inject(function(_requisitionValidator_, _TEMPLATE_COLUMNS_, _COLUMN_SOURCES_,
                                   _calculationFactory_) {

            validator = _requisitionValidator_;
            TEMPLATE_COLUMNS = _TEMPLATE_COLUMNS_;
            COLUMN_SOURCES = _COLUMN_SOURCES_;
            calculationFactory = _calculationFactory_;
        });

        lineItem = lineItemSpy('One');

        var template = jasmine.createSpyObj('template', ['getColumns']);
        template.getColumns.andCallFake(function (nonFullSupply) {
            return nonFullSupply ? nonFullSupplyColumns() : fullSupplyColumns();
        });

        lineItems = [{
            $program: {
                fullSupply: true
            }
        }, {
            $program: {
                fullSupply: false
            }
        },{
            $program: {
                fullSupply: true
            }
        }, {
            $program: {
                fullSupply: false
            }
        }];

        requisition = {
            template: template,
            requisitionLineItems: lineItems
        };
    });

    describe('validateRequisition', function() {

        it('should return true if requisition is valid', function() {
            spyOn(validator, 'validateLineItem').andReturn(true);

            var result = validator.validateRequisition(requisition);

            expect(result).toBe(true);

            [lineItems[0], lineItems[2]].forEach(function(lineItem) {
                expect(validator.validateLineItem).toHaveBeenCalledWith(
                    lineItem,
                    requisition.template.getColumns(),
                    requisition
                );
            });

            [lineItems[1], lineItems[3]].forEach(function(lineItem) {
                expect(validator.validateLineItem).toHaveBeenCalledWith(
                    lineItem,
                    requisition.template.getColumns(true),
                    requisition
                );
            });
        });

        it('should return false if any of the line items is invalid', function() {
            spyOn(validator, 'validateLineItem').andCallFake(function(lineItem) {
                return lineItem !== lineItems[0];
            });

            var result = validator.validateRequisition(requisition);

            expect(result).toBe(false);

            [lineItems[0], lineItems[2]].forEach(function(lineItem) {
                expect(validator.validateLineItem).toHaveBeenCalledWith(
                    lineItem,
                    requisition.template.getColumns(),
                    requisition
                );
            });

            [lineItems[1], lineItems[3]].forEach(function(lineItem) {
                expect(validator.validateLineItem).toHaveBeenCalledWith(
                    lineItem,
                    requisition.template.getColumns(true),
                    requisition
                );
            });
        });

    });

    describe('validateLineItem', function() {

        beforeEach(function() {
            columns = [
                column(TEMPLATE_COLUMNS.TOTAL_CONSUMED_QUANTITY),
                column(TEMPLATE_COLUMNS.BEGINNING_BALANCE),
                column(TEMPLATE_COLUMNS.STOCK_ON_HAND)
            ];
        });

        it('should return true if all fields are valid', function() {
            spyOn(validator, 'validateLineItemField').andReturn(true);

            var result = validator.validateLineItem(lineItem, columns, requisition);

            expect(result).toBe(true);
            columns.forEach(function(column) {
                expect(validator.validateLineItemField)
                    .toHaveBeenCalledWith(lineItem, column, columns, requisition);
            });
        });

        it('should return false if any field is invalid', function() {
            spyOn(validator, 'validateLineItemField').andCallFake(function(lineItem, column) {
                return column !== columns[1];
            });

            var result = validator.validateLineItem(lineItem, columns, requisition);

            expect(result).toBe(false);
            columns.forEach(function(column) {
                expect(validator.validateLineItemField)
                    .toHaveBeenCalledWith(lineItem, column, columns, requisition);
            });
        })

    });

    describe('validateLineItemField', function() {

        beforeEach(function() {
            column = {};
            columns = [column];
        });

        it('should return true if field is valid', function() {
            column.name = TEMPLATE_COLUMNS.BEGINNING_BALANCE;

            var result = validator.validateLineItemField(lineItem, column, columns);

            expect(result).toBe(true);
        })

        it('should return true if column is Total Losses and Adjustments', function() {
            column.name = TEMPLATE_COLUMNS.TOTAL_LOSSES_AND_ADJUSTMENTS;

            var result = validator.validateLineItemField(lineItem, column, columns);

            expect(result).toBe(true);
        });

        it('should return false if field is required but no set', function() {
            lineItem['requiredButNotSet'] = undefined;
            column.$required = true;
            column.name = 'requiredButNotSet';

            var result = validator.validateLineItemField(lineItem, column, columns);

            expect(result).toBe(false);
        });

        it('should return false if any validation fails', function() {
            lineItem[TEMPLATE_COLUMNS.STOCK_ON_HAND] = -10;
            column.name = TEMPLATE_COLUMNS.STOCK_ON_HAND;
            column.$required = true;
            column.source = COLUMN_SOURCES.CALCULATED;
            validationFactory.stockOnHand.andReturn('negative');

            var result = validator.validateLineItemField(lineItem, column, columns);

            expect(result).toBe(false);
            expect(lineItem.$errors[TEMPLATE_COLUMNS.STOCK_ON_HAND]).toBe('negative');
        });

        it('should return false if calculation validation fails', function() {
            var name = TEMPLATE_COLUMNS.STOCK_ON_HAND;

            column.source = COLUMN_SOURCES.USER_INPUT;
            column.name = name;


            columns = {
                stockOnHand: column,
                totalConsumedQuantity: {
                    name: TEMPLATE_COLUMNS.TOTAL_CONSUMED_QUANTITY,
                    source: COLUMN_SOURCES.USER_INPUT
                }
            };

            var result = validator.validateLineItemField(lineItem, column, columns);

            expect(result).toBe(false);
        });

        it('should skip calculation validation if counterpart is calculated', function() {
            column.source = COLUMN_SOURCES.CALCULATED;
            column.name = TEMPLATE_COLUMNS.STOCK_ON_HAND;
            columns.push({
                name: TEMPLATE_COLUMNS.TOTAL_CONSUMED_QUANTITY,
                source: COLUMN_SOURCES.CALCULATED
            });

            var result = validator.validateLineItemField(lineItem, column, columns);

            expect(result).toBe(true);
        });

    });

    describe('isLineItemValid', function() {

        beforeEach(function() {
            lineItem = lineItemSpy('One');
        });

        it('should return true if no field has error', function() {
            lineItem.$errors[TEMPLATE_COLUMNS.STOCK_ON_HAND] = undefined;

            var result = validator.isLineItemValid(lineItem);

            expect(result).toBe(true);
        });

        it('should return false if any field has error', function() {
            lineItem.$errors[TEMPLATE_COLUMNS.STOCK_ON_HAND] = 'invalid';
            lineItem.$errors[TEMPLATE_COLUMNS.TOTAL_CONSUMED_QUANTITY] = undefined;

            var result = validator.isLineItemValid(lineItem);

            expect(result).toBe(false);
        });

    });

    describe('areLineItemsValid', function() {

        var lineItems;

        beforeEach(function() {
            lineItems = [
                lineItemSpy('one'),
                lineItemSpy('two')
            ];

            spyOn(validator, 'isLineItemValid').andReturn(true);
        });

        it('should return true if all line items are valid', function() {
            expect(validator.areLineItemsValid(lineItems)).toBe(true);
        });

        it('should return false if any of the line items is invalid', function() {
            validator.isLineItemValid.andCallFake(function(lineItem) {
                return lineItem !== lineItems[1];
            });

            expect(validator.areLineItemsValid(lineItems)).toBe(false);
        });

    });

    function fullSupplyCategories() {
        return [
            category('CategoryOne', [lineItemSpy('One'), lineItemSpy('Two')]),
            category('CategoryTwo', [lineItemSpy('Three'), lineItemSpy('Four')])
        ];
    }

    function nonFullSupplyCategories() {
        return [
            category('CategoryThree', [lineItemSpy('Five'), lineItemSpy('Six')]),
            category('CategoryFour', [lineItemSpy('Seven'), lineItemSpy('Eight')])
        ];
    }

    function nonFullSupplyColumns() {
        return [
            column('Three'),
            column('Four')
        ];
    }

    function fullSupplyColumns() {
        return [
            column('One'),
            column('Two')
        ];
    }

    function column(name) {
        return {
            name: name
        };
    }

    function category(name, lineItems) {
        return {
            name: name,
            lineItems: lineItems
        };
    }

    function lineItemSpy(suffix) {
        var lineItemSpy = jasmine.createSpyObj('lineItem' + suffix, ['areColumnsValid']);
        lineItemSpy.areColumnsValid.andReturn(true);
        lineItemSpy.$errors = {};
        return lineItemSpy;
    }

});
