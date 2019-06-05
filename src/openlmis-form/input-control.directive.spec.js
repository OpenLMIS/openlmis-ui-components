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

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.scope = this.$rootScope.$new();

        var markup = '<form name="exampleForm">' +
            '<div input-control openlmis-invalid>' +
            '<input ng-model="example" ng-hide="hideOne" required />' +
            '<input ng-model="foo" ng-hide="hideTwo" />' +
            '</div>' +
            '</form>';
        this.form = angular.element(markup).appendTo('body');
        this.$compile(this.form)(this.scope);

        this.scope.exampleForm.$setSubmitted();

        this.scope.$apply();

        this.element = this.form.find('[input-control]');
        this.inputs = this.element.find('input');
    });

    it('adds is-focused class when child inputs get focus', function() {
        var input = this.element.find('input:first');

        input.focus();
        this.scope.$apply();

        expect(this.element.hasClass('is-focused')).toBe(true);

        input.blur();
        this.scope.$apply();

        expect(this.element.hasClass('is-focused')).toBe(false);
    });

    it('gets disabled class when all child inputs are disabled', function() {
        expect(this.element.hasClass('is-disabled')).toBe(false);

        this.inputs.prop('disabled', true);
        this.scope.$apply();

        expect(this.element.hasClass('is-disabled')).toBe(true);

        this.element.find('input:first').prop('disabled', false);
        this.scope.$apply();

        expect(this.element.hasClass('is-disabled')).toBe(false);
    });

    it('gets hidden if there are no visible child elements', function() {
        expect(this.element.is(':visible')).toBe(true);

        this.scope.hideOne = true;
        this.scope.hideTwo = true;
        this.scope.$apply();

        expect(this.element.is(':visible')).toBe(false);

        this.scope.hideOne = false;
        this.scope.$apply();

        expect(this.element.is(':visible')).toBe(true);
    });

});