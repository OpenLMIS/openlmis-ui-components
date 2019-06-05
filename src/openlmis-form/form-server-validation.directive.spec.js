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
describe('formServerValidation', function() {

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$compile = $injector.get('$compile');
            this.$q = $injector.get('$q');
            this.alertService = $injector.get('alertService');
        });

        this.scope = this.$rootScope.$new();
        this.ngSubmitFn = jasmine.createSpy();
        this.scope.someObject = {
            submitMethod: this.ngSubmitFn
        };

        spyOn(this.alertService, 'error');

        this.createForm = function() {
            this.formElement = this.$compile(
                '<form name="testForm" ng-submit="someObject.submitMethod()">' +
                '<input ng-model="inputOne" />' +
                '<input id="inputTwo" name="inputTwo" ng-model="inputTwo" />' +
                '<input id="submit" type="submit" />' +
                '</form>'
            )(this.scope);
        };
    });

    it('should decorate ngSubmit function', function() {
        expect(this.scope.someObject.submitMethod).toBe(this.ngSubmitFn);

        this.createForm();

        expect(this.scope.someObject.submitMethod).not.toBe(this.ngSubmitFn);
    });

    it('should display alert if response contains messageKey', function() {
        var message = 'someError';

        this.ngSubmitFn.andReturn(this.$q.reject({
            data: {
                message: message,
                messageKey: 'someMessageKey'
            }
        }));

        this.createForm();
        this.formElement.submit();
        this.$rootScope.$apply();

        expect(this.alertService.error).toHaveBeenCalledWith(message);
    });

    it('should set model validity if response does not contain messageKey', function() {
        var inputTwoModel;
        this.ngSubmitFn.andReturn(this.$q.reject({
            data: {
                inputTwo: 'notCool'
            }
        }));

        this.createForm();
        inputTwoModel = this.formElement.find('#inputTwo').controller('ngModel');
        spyOn(inputTwoModel, '$setValidity');

        this.formElement.submit();
        this.$rootScope.$apply();

        expect(inputTwoModel.$setValidity).toHaveBeenCalledWith('notCool', false);
    });

    it('should set model validity if model value changed', function() {
        this.ngSubmitFn.andReturn(this.$q.reject({
            data: {
                inputTwo: 'notCool'
            }
        }));

        this.createForm();
        var inputTwoModel = this.formElement.find('#inputTwo').controller('ngModel');
        spyOn(inputTwoModel, '$setValidity');

        this.formElement.submit();
        this.$rootScope.$apply();
        this.formElement.find('#inputTwo')
            .val('otherValue')
            .trigger('input');

        expect(inputTwoModel.$setValidity).toHaveBeenCalledWith('notCool', true);
    });

});
