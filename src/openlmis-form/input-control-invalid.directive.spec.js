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

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.scope = this.$rootScope.$new();

        var markup = '<form name="exampleForm">' +
            '<div input-control openlmis-invalid >' +
            '<input ng-model="example" required /><input ng-model="foo" />' +
            '</div>' +
            '</form>';
        this.form = this.$compile(markup)(this.scope);

        angular.element('body').append(this.form);

        this.scope.exampleForm.$setSubmitted();

        this.scope.$apply();

        this.element = this.form.find('[input-control]');
        this.inputs = this.element.find('input');
    });

    it('reacts to error state of child inputs', function() {
        expect(angular.element(this.inputs[0]).hasClass('ng-invalid')).toBe(true);
        expect(this.element.hasClass('is-invalid')).toBe(true);

        // setting value for required input
        this.scope.example = '123';
        this.scope.$apply();

        expect(angular.element(this.inputs[0]).hasClass('ng-invalid')).toBe(false);
        expect(this.element.hasClass('is-invalid')).toBe(false);
    });

});