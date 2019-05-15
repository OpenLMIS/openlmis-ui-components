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

describe('Input automatic resize directive', function() {

    beforeEach(function() {
        module('openlmis-table-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');

        });

        this.compileMarkup = function(markup) {
            var element = this.$compile(markup)(this.$scope);
            this.$scope.$apply();
            return element;
        };

        var markup =
            '<td>' +
                '<input type="text" value="100"/>' +
            '</td>';

        this.$scope = this.$rootScope.$new();
        this.html = this.compileMarkup(markup);
        this.input = this.html.find('input');

        this.previousWidth = parseInt(this.input[0].style.width, 10);
    });

    it('should set width value as greater than zero if input is not empty', function() {
        expect(this.previousWidth).toBeGreaterThan(0);
    });

    it('should stretch input if value is longer than previous', function() {
        this.input[0].value = 100000;

        this.$compile(this.html)(this.$scope);
        this.$scope.$apply();

        this.$compile(this.html)(this.$scope);
        this.$scope.$apply();

        expect(parseInt(this.input[0].style.width, 10)).toBeGreaterThan(this.previousWidth);
    });

    it('should shrink input if value is shorter than previous', function() {
        this.input[0].value = 1;

        this.$compile(this.html)(this.$scope);
        this.$scope.$apply();

        var width = parseInt(this.input[0].style.width, 10);

        expect(width).toBeLessThan(this.previousWidth);
        expect(width).toBeGreaterThan(0);
    });

    it('should do nothing for date input', function() {
        var markup =
            '<td>' +
                '<input type="text" openlmis-datepicker ng-model="date"/>' +
            '</td>';

        var input = this.compileMarkup(markup);
        this.previousWidth = input[0].style.width;

        input[0].value = 'some-invalid-date';
        this.$scope.$apply();

        expect(input[0].style.width).toEqual(this.previousWidth);
    });
});