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

describe('Autofocus', function() {

    var scope, $rootScope, timeout, $compile, element;

    beforeEach(function() {
        module('openlmis-autofocus');

        inject(function($injector) {
            timeout = $injector.get('$timeout');
            $rootScope = $injector.get('$rootScope');
            scope = $rootScope.$new();
            $compile = $injector.get('$compile');
        });

        element = angular.element('<form><input type="text" name="first" /><input type="text" name="second" autofocus/></form>');
        $compile(element)(scope);
        scope.$digest();
    });

    it('should set focus to first autofocus element', function() {
        var input = element.find('input');
        spyOn(input[1], 'focus');
        timeout.flush();
        expect(input[1].focus).toHaveBeenCalled();
    });

});
