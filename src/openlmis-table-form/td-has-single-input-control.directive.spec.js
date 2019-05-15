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

describe('TD has single input control', function() {

    beforeEach(function() {
        module('openlmis-table-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        var markup =
            '<table>' +
                '<tr>' +
                    '<td>' +
                        '<input />' +
                    '</td>' +
                '</tr>' +
            '</table>';

        this.$scope = this.$rootScope.$new();
        this.element = this.$compile(markup)(this.$scope);
        this.$scope.$apply();
        this.tableCell = this.element.find('td');
    });

    it('adds has-single-input-control class to table cell elements with a single input', function() {
        expect(this.tableCell.hasClass('has-single-input-control')).toBe(true);
    });

    it('removes has-single-input-control, if there is more than one input-control', function() {
        expect(this.tableCell.hasClass('has-single-input-control')).toBe(true);

        var newInput = angular.element('<input />');
        this.tableCell.append(newInput);

        this.$compile(newInput)(this.$scope);
        this.$scope.$apply();

        expect(this.tableCell.hasClass('has-single-input-control')).toBe(false);
    });

});