describe('requisitionValidator', function() {

    var validator, TEMPLATE_COLUMNS, COLUMN_SOURCES, calculationFactory;

    var validationFactory;

    var lineItem, column, columns;

    beforeEach(module('requisition-validation'));

    beforeEach(module(function($provide) {
        var methods = ['nonNegative', 'nonEmptyIfPropertyIsSet', 'nonEmpty', 'validateCalculation'];
        validationFactory = jasmine.createSpyObj('validationFactory', methods);

        $provide.service('validationFactory', function() {
            return validationFactory;
        });
    }));

    beforeEach(inject(function(_requisitionValidator_, _TEMPLATE_COLUMNS_, _COLUMN_SOURCES_,
                               _calculationFactory_) {

        validator = _requisitionValidator_;
        TEMPLATE_COLUMNS = _TEMPLATE_COLUMNS_;
        COLUMN_SOURCES = _COLUMN_SOURCES_;
        calculationFactory = _calculationFactory_;
    }));

    beforeEach(function() {
        lineItem = lineItemSpy('One');
    });

    describe('validateRequisition', function() {

        var lineItems;

        beforeEach(function() {
            var template = jasmine.createSpyObj('template', ['getColumns']);
            template.getColumns.andCallFake(function (nonFullSupply) {
                return nonFullSupply ? nonFullSupplyColumns() : fullSupplyColumns();
            });

            requisition = {
                $template: template,
                $fullSupplyCategories: fullSupplyCategories(),
                $nonFullSupplyCategories: nonFullSupplyCategories()
            };
        });

        it('should return true if requisition is valid', function() {
            spyOn(validator, 'validateLineItem').andReturn(true);

            var result = validator.validateRequisition(requisition);

            expect(result).toBe(true);

            requisition.$fullSupplyCategories.forEach(function(category) {
                category.lineItems.forEach(function(lineItem) {
                    expect(validator.validateLineItem)
                        .toHaveBeenCalledWith(lineItem, requisition.$template.getColumns());
                });
            });

            requisition.$nonFullSupplyCategories.forEach(function(category) {
                category.lineItems.forEach(function(lineItem) {
                    expect(validator.validateLineItem)
                        .toHaveBeenCalledWith(lineItem, requisition.$template.getColumns(true));
                });
            });
        });

        it('should return false if any of the line items is invalid', function() {
            spyOn(validator, 'validateLineItem').andCallFake(function(lineItem) {
                return lineItem !== requisition.$fullSupplyCategories[0].lineItems[0];
            });

            var result = validator.validateRequisition(requisition);

            expect(result).toBe(false);

            requisition.$fullSupplyCategories.forEach(function(category) {
                category.lineItems.forEach(function(lineItem) {
                    expect(validator.validateLineItem)
                        .toHaveBeenCalledWith(lineItem, requisition.$template.getColumns());
                });
            });

            requisition.$nonFullSupplyCategories.forEach(function(category) {
                category.lineItems.forEach(function(lineItem) {
                    expect(validator.validateLineItem)
                        .toHaveBeenCalledWith(lineItem, requisition.$template.getColumns(true));
                });
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

            var result = validator.validateLineItem(lineItem, columns);

            expect(result).toBe(true);
            columns.forEach(function(column) {
                expect(validator.validateLineItemField)
                    .toHaveBeenCalledWith(lineItem, column, columns);
            });
        });

        it('should return false if any field is invalid', function() {
            spyOn(validator, 'validateLineItemField').andCallFake(function(lineItem, column) {
                return column !== columns[1];
            });

            var result = validator.validateLineItem(lineItem, columns);

            expect(result).toBe(false);
            columns.forEach(function(column) {
                expect(validator.validateLineItemField)
                    .toHaveBeenCalledWith(lineItem, column, columns);
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
            column.required = true;
            column.name = 'requiredButNotSet';
            validationFactory.nonEmpty.andReturn('required');

            var result = validator.validateLineItemField(lineItem, column, columns);

            expect(result).toBe(false);
            expect(validationFactory.nonEmpty).toHaveBeenCalledWith(undefined);
        });

        it('should return false if any validation fails', function() {
            lineItem[TEMPLATE_COLUMNS.STOCK_ON_HAND] = -10;
            column.name = TEMPLATE_COLUMNS.STOCK_ON_HAND;
            column.required = true;
            column.source = COLUMN_SOURCES.CALCULATED;
            validationFactory.nonNegative.andReturn('negative');

            var result = validator.validateLineItemField(lineItem, column, columns);

            expect(result).toBe(false);
            expect(lineItem.$errors[TEMPLATE_COLUMNS.STOCK_ON_HAND]).toBe('negative');
            expect(validationFactory.nonEmpty).toHaveBeenCalledWith(-10);
            expect(validationFactory.nonNegative).toHaveBeenCalledWith(-10, lineItem);
        });

        it('should return false if calculation validation fails', function() {
            var name = TEMPLATE_COLUMNS.STOCK_ON_HAND,
                calculationSpy = jasmine.createSpy();

            calculationSpy.andReturn('invalidCalculation');
            column.source = COLUMN_SOURCES.USER_INPUT;
            column.name = name;
            columns.push({
                name: TEMPLATE_COLUMNS.TOTAL_CONSUMED_QUANTITY,
                source: COLUMN_SOURCES.USER_INPUT
            });
            validationFactory.validateCalculation.andReturn(calculationSpy);

            var result = validator.validateLineItemField(lineItem, column, columns);

            expect(result).toBe(false);
            expect(validationFactory.validateCalculation).toHaveBeenCalledWith(calculationFactory[name])
            expect(calculationSpy).toHaveBeenCalledWith(lineItem[name], lineItem);
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
            expect(validationFactory.validateCalculation).not.toHaveBeenCalled();
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

    })

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
