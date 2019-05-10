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

describe('Input Control Invalid directive', function() {

    var form, element, inputs, scope;

    beforeEach(module('openlmis-form'));

    beforeEach(inject(function($compile, $rootScope) {
        scope = $rootScope.$new();

        var markup = '<form name="exampleForm">' +
                '<div input-control openlmis-invalid >' +
                    '<input ng-model="example" required /><input ng-model="foo" />' +
                '</div>' +
            '</form>';
        form = $compile(markup)(scope);

        angular.element('body').append(form);

        scope.exampleForm.$setSubmitted();

        scope.$apply();

        element = form.find('[input-control]');
        inputs = element.find('input');
    }));

    it('reacts to error state of child inputs', function() {
        expect(angular.element(inputs[0]).hasClass('ng-invalid')).toBe(true);
        expect(element.hasClass('is-invalid')).toBe(true);

        // setting value for required input
        scope.example = '123';
        scope.$apply();

        expect(angular.element(inputs[0]).hasClass('ng-invalid')).toBe(false);
        expect(element.hasClass('is-invalid')).toBe(false);
    });

});