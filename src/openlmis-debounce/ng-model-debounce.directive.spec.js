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

describe('ng-model debounce directive', function() {
    var $compile, scope, $rootScope, $timeout;

    beforeEach(module('openlmis-debounce'));

    beforeEach(inject(function($injector) {
        $compile = $injector.get('$compile');
        scope = $injector.get('$rootScope').$new();
        $rootScope = $injector.get('$rootScope');
        $timeout = $injector.get('$timeout');
    }));

    it('should add 500 ms debounce to ng-model', function(){
        var element = getCompiledElement('<input type="text" ng-model="value">'),
            ngModel = element.controller('ngModel');

        $rootScope.$apply();

        expect(ngModel.$options.$$options.debounce).toEqual({
            default: 500,
            blur: 0
        });
    });

    it('should not override provided ngModelOptions by default value', function(){
        var element = getCompiledElement('<input ng-model="value" ng-model-options="{debounce: 5000}">'),
            ngModel = element.controller('ngModel'),
            input = element.find('input');

        $rootScope.$apply();

        expect(ngModel.$options.$$options.debounce).toEqual(5000);
    });

    it('child element should inherit ng-model-options from parent', function(){
        var element = getCompiledElement('<td ng-model-options="{debounce: 5000}"><input ng-model="value" ng-model-options="{debounce: \'$inherit\'}"></td>'),
            ngModel = element.find('input').controller('ngModel');

        $rootScope.$apply();

        expect(ngModel.$options.$$options.debounce).toEqual(5000);
    });

    it('should not set debounce option for select', function() {
        var select = getCompiledElement('<select ng-model="value"></select'),
            ngModel = select.controller('ngModel');

        $rootScope.$apply();

        expect(ngModel.$options.$$options.debounce).toBeFalsy();
    });

    it('should not set debounce option for radio inputs', function() {
        var input = getCompiledElement('<input type="radio" ng-model="value"></input>'),
            ngModel = input.controller('ngModel');

        $rootScope.$apply();

        expect(ngModel.$options.$$options.debounce).toBeFalsy();
    });

    it('should not set debounce option for checkboxes', function() {
        var input = getCompiledElement('<input type="checkbox" ng-model="value"></input'),
            ngModel = input.controller('ngModel');

        $rootScope.$apply();

        expect(ngModel.$options.$$options.debounce).toBeFalsy();
    });

    function getCompiledElement(html) {
        var compiledElement = $compile(html)(scope);
        angular.element('body').append(compiledElement);
        scope.$digest();
        return compiledElement;
    }

});
