describe('requisitionValidator', function() {

    var validator, Columns, Source, calculations;

    var validations;

    var lineItem, column, columns;

    beforeEach(module('requisition-validation'));

    beforeEach(module(function($provide) {
        var methods = ['nonNegative', 'nonEmptyIfPropertyIsSet', 'nonEmpty', 'validateCalculation'];
        validations = jasmine.createSpyObj('validations', methods);

        $provide.service('validations', function() {
            return validations;
        });
    }));

    beforeEach(inject(function(_requisitionValidator_, _Columns_, _Source_, _calculations_) {
        validator = _requisitionValidator_;
        Columns = _Columns_;
        Source = _Source_;
        calculations = _calculations_;
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
                column(Columns.TOTAL_CONSUMED_QUANTITY),
                column(Columns.BEGINNING_BALANCE),
                column(Columns.STOCK_ON_HAND)
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
            column.name = Columns.BEGINNING_BALANCE;

            var result = validator.validateLineItemField(lineItem, column, columns);

            expect(result).toBe(true);
        })

        it('should return true if column is Total Losses and Adjustments', function() {
            column.name = Columns.TOTAL_LOSSES_AND_ADJUSTMENTS;

            var result = validator.validateLineItemField(lineItem, column, columns);

            expect(result).toBe(true);
        });

        it('should return false if field is required but no set', function() {
            lineItem['requiredButNotSet'] = undefined;
            column.required = true;
            column.name = 'requiredButNotSet';
            validations.nonEmpty.andReturn('required');

            var result = validator.validateLineItemField(lineItem, column, columns);

            expect(result).toBe(false);
            expect(validations.nonEmpty).toHaveBeenCalledWith(undefined);
        });

        it('should return false if any validation fails', function() {
            lineItem[Columns.STOCK_ON_HAND] = -10;
            column.name = Columns.STOCK_ON_HAND;
            column.required = true;
            column.source = Source.CALCULATED;
            validations.nonNegative.andReturn('negative');

            var result = validator.validateLineItemField(lineItem, column, columns);

            expect(result).toBe(false);
            expect(lineItem.$errors[Columns.STOCK_ON_HAND]).toBe('negative');
            expect(validations.nonEmpty).toHaveBeenCalledWith(-10);
            expect(validations.nonNegative).toHaveBeenCalledWith(-10, lineItem);
        });

        it('should return false if calculation validation fails', function() {
            var name = Columns.STOCK_ON_HAND,
                calculationSpy = jasmine.createSpy();

            calculationSpy.andReturn('invalidCalculation');
            column.source = Source.USER_INPUT;
            column.name = name;
            columns.push({
                name: Columns.TOTAL_CONSUMED_QUANTITY,
                source: Source.USER_INPUT
            });
            validations.validateCalculation.andReturn(calculationSpy);

            var result = validator.validateLineItemField(lineItem, column, columns);

            expect(result).toBe(false);
            expect(validations.validateCalculation).toHaveBeenCalledWith(calculations[name])
            expect(calculationSpy).toHaveBeenCalledWith(lineItem[name], lineItem);
        });

        it('should skip calculation validation if counterpart is calculated', function() {
            column.source = Source.CALCULATED;
            column.name = Columns.STOCK_ON_HAND;
            columns.push({
                name: Columns.TOTAL_CONSUMED_QUANTITY,
                source: Source.CALCULATED
            });

            var result = validator.validateLineItemField(lineItem, column, columns);

            expect(result).toBe(true);
            expect(validations.validateCalculation).not.toHaveBeenCalled();
        });

    });

    describe('isLineItemValid', function() {

        beforeEach(function() {
            lineItem = lineItemSpy('One');
        });

        it('should return true if no field has error', function() {
            lineItem.$errors[Columns.STOCK_ON_HAND] = undefined;

            var result = validator.isLineItemValid(lineItem);

            expect(result).toBe(true);
        });

        it('should return false if any field has error', function() {
            lineItem.$errors[Columns.STOCK_ON_HAND] = 'invalid';
            lineItem.$errors[Columns.TOTAL_CONSUMED_QUANTITY] = undefined;

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
