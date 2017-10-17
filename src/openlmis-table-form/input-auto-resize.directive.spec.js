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
    var $compile, scope, input, html;

    beforeEach(module('openlmis-table-form'));

    beforeEach(inject(function($injector) {
        $compile = $injector.get('$compile');
        scope = $injector.get('$rootScope').$new();
    }));

    beforeEach(function(){
        html = compileMarkup('<table class="openlmis-table"><td><div class="input-control"><input class="number" type="text"/></div></td></table>');
        input = html.find('input');
    });

    it('should not stretch input if value is empty', function() {
        expect(input.attr('style')).toBe('width: 0px;');
    });

    it('should stretch input if value is longer', function(){
        input.attr('value', '100000');

        $compile(html)(scope);
        scope.$apply();

        expect(input.attr('style')).toBe('width: 60px;');

        input.attr('value', '100');

        $compile(html)(scope);
        scope.$apply();

        expect(input.attr('style')).toBe('width: 30px;');
    });

    function compileMarkup(markup) {
        var element = $compile(markup)(scope);
        scope.$apply();

        return element;
    }
});