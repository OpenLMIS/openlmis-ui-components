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

describe('TD input-control popover directive', function() {
    var $compile, scope, input;

    beforeEach(module('openlmis-table-form'));

    beforeEach(inject(function(_$compile_, $rootScope) {
        $compile = _$compile_;
        scope = $rootScope.$new();      
    }));

    beforeEach(function(){
        var html = '<td><div input-control openlmis-invalid="{{error}}"></div></td>',
            element = $compile(html)(scope);

        input = element.find('[input-control]:first');
    });

    it('Adds openlmis-popover to input-control directives in a TD', function(){
        expect(input.controller('popover')).not.toBeUndefined();
    });

    it('Displays error messages in the popover', function(){
        var popoverCtrl = input.controller('popover');
        spyOn(popoverCtrl, 'addElement').andCallThrough();

        scope.error = "Error!";
        scope.$apply();

        expect(popoverCtrl.addElement).toHaveBeenCalled();
    });

    it('Sets input-control tabindex to -1', function() {
        expect(input.attr('tabindex')).toBeUndefined();

        scope.error = "Error!";
        scope.$apply();

        expect(input.attr('tabindex')).toBe("-1");
    });

});