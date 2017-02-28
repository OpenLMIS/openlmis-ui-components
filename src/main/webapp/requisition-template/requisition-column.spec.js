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

describe('RequisitionColumn', function() {

    var RequisitionColumn, REQUISITION_STATUS, TEMPLATE_COLUMNS, COLUMN_SOURCES, COLUMN_TYPES;

    var columnDef, requisition;

    beforeEach(module('requisition-template'));

    beforeEach(inject(function(_RequisitionColumn_, _REQUISITION_STATUS_, _TEMPLATE_COLUMNS_,
                               _COLUMN_SOURCES_, _COLUMN_TYPES_) {

        RequisitionColumn = _RequisitionColumn_;
        REQUISITION_STATUS = _REQUISITION_STATUS_;
        TEMPLATE_COLUMNS = _TEMPLATE_COLUMNS_;
        COLUMN_SOURCES = _COLUMN_SOURCES_;
        COLUMN_TYPES = _COLUMN_TYPES_;
    }));

    beforeEach(function() {
        columnDef = {
            name: TEMPLATE_COLUMNS.STOCK_ON_HAND,
            source: COLUMN_SOURCES.CALCULATED,
            label: 'Stock on Hand',
            isDisplayed: true,
            displayOrder: 1,
            columnDefinition: {
                columnType: COLUMN_TYPES.NUMERIC
            }
        };
        requisition = {
            status: REQUISITION_STATUS.SUBMITTED,
            $isAfterAuthorize: function() {
                return false;
            }
        };
    });

    it('should create RequisitionColumn from definition', function() {
        var column = new RequisitionColumn(columnDef, requisition);

        expect(column.name).toBe(TEMPLATE_COLUMNS.STOCK_ON_HAND);
        expect(column.source).toBe(COLUMN_SOURCES.CALCULATED);
        expect(column.$type).toBe(COLUMN_TYPES.NUMERIC);
        expect(column.label).toBe('Stock on Hand');
        expect(column.$display).toBe(true);
        expect(column.displayOrder).toBe(1);
        expect(column.$required).toBe(false);
        expect(column.$fullSupplyOnly).toBe(true);
        expect(column.$dependencies).toEqual([
            TEMPLATE_COLUMNS.BEGINNING_BALANCE,
            TEMPLATE_COLUMNS.TOTAL_RECEIVED_QUANTITY,
            TEMPLATE_COLUMNS.TOTAL_CONSUMED_QUANTITY,
            TEMPLATE_COLUMNS.TOTAL_LOSSES_AND_ADJUSTMENTS
        ]);
    });

    it('should hide column if it is invisible', function() {
        columnDef.isDisplayed = false;

        var column = new RequisitionColumn(columnDef, requisition);

        expect(column.$display).toBe(false);
    });

    [
        {
            name: 'should be required if it is mandatory and user input',
            column: 'stockOnHand',
            source: 'USER_INPUT',
            result: true
        }, {
            name: 'should not be required if it is not mandatory',
            column: 'remarks',
            source: 'USER_INPUT',
            result: false
        }, {
            name: 'should not be required if it mandatory but not use input',
            column: 'stockOnHand',
            source: 'CALCULATED',
            result: false
        }
    ].forEach(function(testCase) {
        it(testCase.name, function() {
            columnDef.name = testCase.column;
            columnDef.source = testCase.source;

            var column = new RequisitionColumn(columnDef, requisition);

            expect(column.$required).toBe(testCase.result);
        });
    });

    [
        {
            name: 'should hide Approved Quantity column if status is before authorize',
            column: 'approvedQuantity',
            afterAuthorize: false,
            result: false
        },
        {
            name: 'should hide Remarks column if status is before authorize',
            column: 'remarks',
            afterAuthorize: false,
            result: false
        },
        {
            name: 'should show Approved Quantity column if status is after authorize',
            column: 'approvedQuantity',
            afterAuthorize: true,
            result: true
        },
        {
            name: 'should show Remarks column if status is after authorize',
            column: 'remarks',
            afterAuthorize: true,
            result: true
        }
    ].forEach(function(testCase) {
        it(testCase.name, function() {
            columnDef.name = testCase.column;
            requisition.$isAfterAuthorize = function() {
                return testCase.afterAuthorize;
            };

            var column = new RequisitionColumn(columnDef, requisition);

            expect(column.$display).toBe(testCase.result);
        });
    });
});
