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

describe('openlmis-table-form.directive:checkboxInputTD', function() {

    var $compile, $rootScope, element;

    beforeEach(function() {
        module('openlmis-table-form');

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
        });
    });

    it('will wrap a label element around a checkbox input directly placed in a table cell', function() {
        var markup = '<td><input type="checkbox" /></td>';
        element = $compile(markup)($rootScope.$new());

        expect(element.find('input').parent()[0].nodeName.toLowerCase()).toBe('label');
        expect(element.find('input').parents('label')
            .hasClass('checkbox')).toBe(true);
    });

    it('will not add a label to an input already wrapped with a label', function() {
        var markup = '<td><label><input type="checkbox" />Example</label></td>';
        element = $compile(markup)($rootScope.$new());

        expect(element.find('input').parents('label').length).toEqual(1);
    });
});