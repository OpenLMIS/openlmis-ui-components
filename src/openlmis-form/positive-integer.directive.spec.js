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
describe('openlmisPositiveInteger', function() {

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.$scope = this.$rootScope.$new();

        this.compileElement = function(extraAttrs) {
            this.element = this.$compile(
                '<form name="form_test">' +
                '<input name="input_test" positive-integer ' + (extraAttrs || '') +
                ' ng-model="example"/></form>'
            )(this.$scope);
            angular.element('body').append(this.element);
            this.$rootScope.$apply();
        };

        this.compileElement();
    });

    it('should add number class', function() {
        expect(this.$scope.form_test.input_test.$$element.hasClass('number')).toBe(true);
    });

    it('should strip non-numeric characters', function() {
        this.$scope.form_test.input_test.$setViewValue('12abc3');
        this.$scope.$digest();

        expect(this.$scope.example).toEqual(123);
    });

    it('should parse value as integer', function() {
        this.$scope.form_test.input_test.$setViewValue('42');
        this.$scope.$digest();

        expect(this.$scope.example).toEqual(42);
    });

    it('should return null for empty input', function() {
        this.$scope.form_test.input_test.$setViewValue('');
        this.$scope.$digest();

        expect(this.$scope.example).toBeNull();
    });

    describe('without java-integer attribute', function() {

        it('should be valid for value within the safe integer range', function() {
            this.$scope.form_test.input_test.$setViewValue('9999999999');
            this.$scope.$digest();

            expect(this.$scope.form_test.input_test.$error.max).toBeFalsy();
        });

        it('should be invalid for value exceeding the max safe integer', function() {
            this.$scope.form_test.input_test.$setViewValue('99999999999999999');
            this.$scope.$digest();

            expect(this.$scope.form_test.input_test.$error.max).toBe(true);
        });
    });

    describe('with java-integer attribute', function() {

        beforeEach(function() {
            this.compileElement('java-integer');
        });

        it('should be valid for value within Java Integer range', function() {
            this.$scope.form_test.input_test.$setViewValue('2147483647');
            this.$scope.$digest();

            expect(this.$scope.form_test.input_test.$error.max).toBeFalsy();
            expect(this.$scope.form_test.input_test.$valid).toBe(true);
        });

        it('should be invalid for value exceeding Java Integer max', function() {
            this.$scope.form_test.input_test.$setViewValue('2147483648');
            this.$scope.$digest();

            expect(this.$scope.form_test.input_test.$error.max).toBe(true);
            expect(this.$scope.example).toBe(2147483648);
        });

        it('should be valid for empty value', function() {
            this.$scope.form_test.input_test.$setViewValue('');
            this.$scope.$digest();

            expect(this.$scope.form_test.input_test.$error.max).toBeFalsy();
        });

        it('should be valid for typical small quantity', function() {
            this.$scope.form_test.input_test.$setViewValue('100');
            this.$scope.$digest();

            expect(this.$scope.form_test.input_test.$error.max).toBeFalsy();
        });
    });
});