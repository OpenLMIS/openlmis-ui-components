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

describe('TR is Invalid', function() {
    'use strict';

    var $compile, scope;

    beforeEach(module('openlmis-templates'));
    beforeEach(module('openlmis-table'));

    beforeEach(inject(function(_$compile_, $rootScope){        
        $compile = _$compile_;
        scope = $rootScope.$new();
    }));

    it('TR gets is-invalid class when child element has is-invalid class', function(){
        var table = compileMarkup('<table><tr><td></td></tr></table>');

        expect(table.find('tr.is-invalid').length).toBe(0);

        table.find('td').addClass('is-invalid');
        scope.$apply();

        expect(table.find('tr.is-invalid').length).toBe(1);
    });

    it('TR gets is-invalid class when any descendent element has is-invalid class', function(){
        var table = compileMarkup('<table><tr><td><p><a></a></p></td></tr></table>');

        expect(table.find('tr.is-invalid').length).toBe(0);

        table.find('a').addClass('is-invalid');
        scope.$apply();

        expect(table.find('tr.is-invalid').length).toBe(1);
    });


    function compileMarkup(markup) {
        var element = $compile(markup)(scope);

        angular.element('body').append(element);
        scope.$apply();

        return element;
    }

});
