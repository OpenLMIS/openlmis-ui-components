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

describe('openlmisLongText directive', function() {

    beforeEach(function() {
        module('openlmis-table-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.$scope = this.$rootScope.$new();

        this.compileMarkup = function(markup) {
            const element = this.$compile(markup)(this.$scope);
            angular.element('body').append(element);
            this.$scope.$apply();
            return element;
        };
    });

    it('should set an explicit width and height on a textarea with the class', function() {
        const textarea = this.compileMarkup('<textarea class="openlmis-long-text">short</textarea>');

        expect(Number.parseInt(textarea[0].style.width, 10)).toBeGreaterThan(0);
        expect(Number.parseInt(textarea[0].style.height, 10)).toBeGreaterThan(0);
    });

    it('should grow width when the value becomes longer', function() {
        const textarea = this.compileMarkup('<textarea class="openlmis-long-text">short</textarea>');
        const previousWidth = Number.parseInt(textarea[0].style.width, 10);

        textarea[0].value = 'a value that is clearly longer than the initial one';
        this.$scope.$apply();

        expect(Number.parseInt(textarea[0].style.width, 10)).toBeGreaterThan(previousWidth);
    });

    it('should grow height when the value spans multiple lines', function() {
        const textarea = this.compileMarkup('<textarea class="openlmis-long-text">short</textarea>');
        const previousHeight = Number.parseInt(textarea[0].style.height, 10);

        textarea[0].value = 'first line\nsecond line\nthird line\nfourth line';
        this.$scope.$apply();

        expect(Number.parseInt(textarea[0].style.height, 10)).toBeGreaterThan(previousHeight);
    });

    it('should not resize a textarea that does not have the class', function() {
        const textarea = this.compileMarkup('<textarea>plain</textarea>');

        expect(textarea[0].style.width).toEqual('');
        expect(textarea[0].style.height).toEqual('');
    });

    it('should not set an inline size on a read-only span with the class', function() {
        const span = this.compileMarkup('<span class="openlmis-long-text">read only</span>');

        expect(span[0].style.width).toEqual('');
        expect(span[0].style.height).toEqual('');
    });

    it('should not collapse a textarea that is hidden when linked', function() {
        const textarea = this.compileMarkup(
            '<textarea class="openlmis-long-text" style="display: none;">hidden</textarea>'
        );

        // A hidden textarea reports scrollHeight 0; sizing it then would bake height:0 and
        // leave it collapsed once shown (e.g. an ng-show free-text comment). It must be skipped.
        expect(textarea[0].style.height).not.toEqual('0px');
    });
});
