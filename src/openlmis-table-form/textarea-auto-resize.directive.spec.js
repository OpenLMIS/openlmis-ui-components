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

describe('Textarea automatic resize directive', function() {

    beforeEach(function() {
        module('openlmis-table-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.compileMarkup = function(markup) {
            const element = this.$compile(markup)(this.$scope);
            angular.element('body').append(element);
            this.$scope.$apply();
            return element;
        };

        this.$scope = this.$rootScope.$new();

        const markup =
            '<table><tr><td>' +
                '<textarea>short</textarea>' +
            '</td></tr></table>';

        this.html = this.compileMarkup(markup);
        this.textarea = this.html.find('textarea');
    });

    it('should set an explicit width and height when textarea has a value', function() {
        expect(Number.parseInt(this.textarea[0].style.width, 10)).toBeGreaterThan(0);
        expect(Number.parseInt(this.textarea[0].style.height, 10)).toBeGreaterThan(0);
    });

    it('should grow width when value becomes longer', function() {
        const previousWidth = Number.parseInt(this.textarea[0].style.width, 10);

        this.textarea[0].value = 'a value that is clearly longer than the initial one';
        this.$scope.$apply();

        expect(Number.parseInt(this.textarea[0].style.width, 10)).toBeGreaterThan(previousWidth);
    });

    it('should grow height when value spans multiple lines', function() {
        const previousHeight = Number.parseInt(this.textarea[0].style.height, 10);

        this.textarea[0].value = 'first line\nsecond line\nthird line\nfourth line';
        this.$scope.$apply();

        expect(Number.parseInt(this.textarea[0].style.height, 10)).toBeGreaterThan(previousHeight);
    });

    it('should do nothing for a textarea outside of a table cell', function() {
        const markup =
            '<form>' +
                '<textarea>outside</textarea>' +
            '</form>';

        const element = this.compileMarkup(markup);
        const textarea = element.find('textarea');

        expect(textarea[0].style.width).toEqual('');
        expect(textarea[0].style.height).toEqual('');
    });
});
