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

describe('Select one option directive', function() {

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.scope = this.$rootScope.$new();
        this.scope.options = [];
        this.element = this.$compile(
            '<select ng-model="value" ng-options="option for option in options" required></select>'
        )(this.scope);
        this.scope.$apply();
        this.element = angular.element(this.element[0]);
    });

    it('will set ngModel to first option, if there is only one option available', function() {
        this.scope.options = ['foo', 'bar', 'baz'];
        this.scope.$apply();

        expect(this.scope.value).toBeUndefined();

        this.scope.options = ['foo'];
        this.scope.$apply();

        expect(this.scope.value).toBe('foo');
    });

    it('will only auto select if the element is required', function() {
        this.element.removeAttr('required');
        this.scope.options = ['foo'];
        this.scope.$apply();

        expect(this.element.val()).not.toBe('foo');
    });
});
