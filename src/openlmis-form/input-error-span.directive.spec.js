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
describe('inputErrorSpan', function() {

    var $compile, $rootScope, scope, formElement, inputElement, formCtrl, ngModelCtrl;

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        });

        scope = $rootScope.$new();
    });

    it('compile should add span element', function() {
        createForm();

        expect(formElement.find('span').length).toBe(1);
    });

    describe('compiled', function() {

        var errorSpan;

        beforeEach(function() {
            createForm();

            errorSpan = formElement.find('span');

            formCtrl = scope.testForm;
            ngModelCtrl = scope.testForm.inputOne;
        });

        it('should show error if form is submitted and input is invalid', function() {
            expect(errorSpan.html()).toBe('');

            formCtrl.$submitted = true;
            ngModelCtrl.$valid = false;
            ngModelCtrl.$error = {
                required: true
            };

            $rootScope.$apply();

            expect(errorSpan.html()).toBe('openlmisForm.required');
        });

        it('should make span visible form is submitted and input is invalid', function() {
            expect(errorSpan.html()).toBe('');

            formCtrl.$submitted = true;
            ngModelCtrl.$valid = false;
            ngModelCtrl.$error = {
                required: true
            };

            $rootScope.$apply();

            expect(errorSpan.attr('style')).toBeUndefined();
        });

        it('should hide error if form is not submitted', function() {
            expect(errorSpan.html()).toBe('');

            formCtrl.$submitted = true;
            ngModelCtrl.$valid = false;
            ngModelCtrl.$error = {
                required: true
            };
            $rootScope.$apply();

            expect(errorSpan.html()).toBe('openlmisForm.required');

            formCtrl.$submitted = false;
            $rootScope.$apply();

            expect(errorSpan.attr('style')).toBe('display: none;');
        });

        it('should hide error if form is not submitted', function() {
            expect(errorSpan.html()).toBe('');

            formCtrl.$submitted = true;
            ngModelCtrl.$valid = false;
            ngModelCtrl.$error = {
                required: true
            };
            $rootScope.$apply();

            expect(errorSpan.html()).toBe('openlmisForm.required');

            ngModelCtrl.$valid = true;
            $rootScope.$apply();

            expect(errorSpan.attr('style')).toBe('display: none;');
        });

    });

    function createForm() {
        formElement = $compile(
            '<form name="testForm">' +
                '<input name="inputOne" ng-model="inputOne" />' +
            '</form>'
        )(scope);
    }

});
