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

    var $rootScope, $compile, $q, alertService, scope, formElement, ngSubmitDeferred;

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $q = $injector.get('$q');
            alertService = $injector.get('alertService');
        });

        ngSubmitDeferred = $q.defer();

        scope = $rootScope.$new();
        scope.someObject = {
            submitMethod: ngSubmitFn
        };
    });

    it('should decorate ngSubmit function', function() {
        expect(scope.someObject.submitMethod).toBe(ngSubmitFn);

        createForm();

        expect(scope.someObject.submitMethod).not.toBe(ngSubmitFn);
    });

    it('should display alert if response contains messageKey', function() {
        var message = 'someError';

        spyOn(alertService, 'error');
        createForm();

        formElement.find('#submit').click();
        ngSubmitDeferred.reject({
            data: {
                message: message,
                messageKey: 'someMessageKey'
            }
        });
        $rootScope.$apply();

        expect(alertService.error).toHaveBeenCalledWith(message);
    });

    it('should set model validity if response does not contain messageKey', function() {
        var inputTwoModel;

        createForm();
        inputTwoModel = formElement.find('#inputTwo').controller('ngModel');
        spyOn(inputTwoModel, '$setValidity');

        formElement.find('#submit').click();
        ngSubmitDeferred.reject({
            data: {
                inputTwo: 'notCool'
            }
        });
        $rootScope.$apply();

        expect(inputTwoModel.$setValidity).toHaveBeenCalledWith('notCool', false);
    });

    it('should set model validity if model value changed', function() {
        var inputTwoModel;

        createForm();
        inputTwoModel = formElement.find('#inputTwo').controller('ngModel');
        spyOn(inputTwoModel, '$setValidity');

        formElement.find('#submit').click();
        ngSubmitDeferred.reject({
            data: {
                inputTwo: 'notCool'
            }
        });
        $rootScope.$apply();
        inputTwoModel.$modelValue = 'otherValue';

        expect(inputTwoModel.$setValidity).toHaveBeenCalledWith('notCool', true);
    });

    function createForm() {
        formElement = $compile(
            '<form name="testForm" ng-submit="someObject.submitMethod()">' +
                '<input ng-model="inputOne" />' +
                '<input id="inputTwo" name="inputTwo" ng-model="inputTwo" />' +
                '<input id="submit" type="submit" />' +
            '</form>'
        )(scope);
    }

    function ngSubmitFn() {
        return ngSubmitDeferred.promise;
    }

});
