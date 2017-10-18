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
    var $compile, scope, input, html, previousWidth;

    beforeEach(module('openlmis-table-form'));

    beforeEach(inject(function($injector) {
        $compile = $injector.get('$compile');
        scope = $injector.get('$rootScope').$new();
    }));

    beforeEach(function(){
        html = compileMarkup('<td><input type="text" value="100"/></td>');
        input = html.find('input');

        previousWidth = input[0].style.width;
    });

    it('should set width value as greater than zero if input is not empty', function() {
        expect(previousWidth).toBeGreaterThan('0px');
    });

    it('should stretch input if value is longer than previous', function(){
        input[0].value = 100000;

        $compile(html)(scope);
        scope.$apply();

        $compile(html)(scope);
        scope.$apply();

        expect(input[0].style.width).toBeGreaterThan(previousWidth);
    });

    it('should shrink input if value is shorter than previous', function(){
        input[0].value = 1;

        $compile(html)(scope);
        scope.$apply();

        expect(input[0].style.width).toBeLessThan(previousWidth);
        expect(input[0].style.width).toBeGreaterThan('0px');
    });

    function compileMarkup(markup) {
        var element = $compile(markup)(scope);
        scope.$apply();

        return element;
    }
});