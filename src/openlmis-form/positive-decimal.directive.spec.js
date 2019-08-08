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

describe('openlmisPositiveDecimal', function() {

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.$scope = this.$rootScope.$new();

        this.compileElement = function() {
            this.element = this.$compile(
                '<form name="form_test">' +
                '<input name="input_test" positive-decimal ng-model="example" type="text"/></form>'
            )(this.$scope);
            angular.element('body').append(this.element);
            this.$rootScope.$apply();
        };

        this.compileElement();
    });

    it('should input positive-decimal has class number', function() {
        this.$scope.$digest();

        expect(this.$scope.form_test.input_test.$$element.hasClass('number')).toBe(true);
    });

    it('should input positive-decimal remove letter', function() {
        this.$scope.form_test.input_test.$setViewValue('123.3x');
        this.$scope.$digest();

        expect(this.$scope.example).toEqual('123.3');
    });

    it('should input positive-decimal remove second dot', function() {
        this.$scope.form_test.input_test.$setViewValue('123.5');
        this.$scope.$digest();
        this.$scope.form_test.input_test.$setViewValue('123.5.6');
        this.$scope.$digest();

        expect(this.$scope.example).toEqual('123.56');
    });
});