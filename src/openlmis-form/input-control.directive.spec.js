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

describe('Input Control directive', function() {

    var form, element, inputs, scope;

    beforeEach(module('openlmis-form'));

    beforeEach(inject(function($compile, $rootScope) {
        scope = $rootScope.$new();

        var markup = '<form name="exampleForm">' +
            '<div input-control openlmis-invalid>' +
                '<input ng-model="example" ng-hide="hideOne" required />' +
                '<input ng-model="foo" ng-hide="hideTwo" />' +
            '</div>' +
        '</form>';
        form = angular.element(markup).appendTo('body');
        $compile(form)(scope);

        scope.exampleForm.$setSubmitted();

        scope.$apply();

        element = form.find('[input-control]');
        inputs = element.find('input');
    }));

    it('adds is-focused class when child inputs get focus', function() {
        var input = element.find('input:first');

        input.focus();
        scope.$apply();

        expect(element.hasClass('is-focused')).toBe(true);

        input.blur();
        scope.$apply();

        expect(element.hasClass('is-focused')).toBe(false);
    });

    it('gets disabled class when all child inputs are disabled', function() {
        expect(element.hasClass('is-disabled')).toBe(false);

        inputs.prop('disabled', true);
        scope.$apply();

        expect(element.hasClass('is-disabled')).toBe(true);

        element.find('input:first').prop('disabled', false);
        scope.$apply();

        expect(element.hasClass('is-disabled')).toBe(false);
    });

    it('gets hidden if there are no visible child elements', function() {
        expect(element.is(':visible')).toBe(true);

        scope.hideOne = true;
        scope.hideTwo = true;
        scope.$apply();

        expect(element.is(':visible')).toBe(false);

        scope.hideOne = false;
        scope.$apply();

        expect(element.is(':visible')).toBe(true);
    });

});