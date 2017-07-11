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

describe('OpenLMIS Invalid TD', function() {
    'use strict';

    var element, tableCell, scope;

    beforeEach(module('openlmis-templates'));
    beforeEach(module('openlmis-table'));
    beforeEach(module('openlmis-form'));

    beforeEach(inject(function($compile, $rootScope){
        var markup = '<table><tr><td openlmis-invalid="{{invalidMessage}}" ></td></tr></table>';
        
        scope = $rootScope.$new();
        element = $compile(markup)(scope);

        scope.$apply();

        tableCell = element.find('td');
    }));

    it('adds is-invalid class to a table cell that has openlmis-invalid message', function(){
        expect(tableCell.hasClass('is-invalid')).toBe(false);

        scope.invalidMessage = "Error!";
        scope.$apply();

        expect(tableCell.hasClass('is-invalid')).toBe(true);
    });

    it('does not show openlmis-invalid messages inside table cell', function(){
        expect(tableCell.children('.openlmis-invalid').length).toBe(0);

        scope.invalidMessage = "Error!";
        scope.$apply();

        expect(tableCell.children('.openlmis-invalid').length).toBe(0); 
    });
});
