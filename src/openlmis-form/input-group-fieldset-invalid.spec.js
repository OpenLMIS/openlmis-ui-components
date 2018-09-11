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

describe('Input Group Fieldset Invalid', function() {
    var scope;

    beforeEach(module('openlmis-form'));

    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
    }));

    it('Adds error message below fieldset legend', inject(function($compile) {
        var markup = '<fieldset>' +
                '<legend></legend>' +
                '<input type="radio" name="example" ng-model="example" required />' +
            '</fieldset>',
            fieldset = $compile(markup)(scope),
            legend = fieldset.find('legend');

        scope.$apply();

        expect(legend.next().hasClass('openlmis-invalid')).toBe(true);
    }));

    it('Adds error message to top of fieldset if no legend', inject(function($compile) {
        var markup = '<fieldset><input type="radio" name="example" ng-model="example" required /></fieldset>',
            fieldset = $compile(markup)(scope);

        scope.$apply();

        expect(fieldset.children().first()
            .hasClass('openlmis-invalid')).toBe(true);
    }));

});