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

    beforeEach(function() {
        module('openlmis-tags-input');
        module('openlmis-debounce');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.scope = this.$rootScope.$new();
        this.getCompiledElement = getCompiledElement;
    });

    it('should add 500 ms debounce to ng-model', function() {
        var element = this.getCompiledElement('<input type="text" ng-model="value">'),
            ngModel = element.controller('ngModel');

        this.$rootScope.$apply();

        expect(ngModel.$options.$$options.debounce).toEqual({
            default: 500,
            blur: 0
        });
    });

    it('should not override provided ngModelOptions by default value', function() {
        var element = this.getCompiledElement('<input ng-model="value" ng-model-options="{debounce: 5000}">'),
            ngModel = element.controller('ngModel');

        this.$rootScope.$apply();

        expect(ngModel.$options.$$options.debounce).toEqual(5000);
    });

    it('child element should inherit ng-model-options from parent', function() {
        var element = this.getCompiledElement(
                '<td ng-model-options="{debounce: 5000}">' +
                    '<input ng-model="value" ng-model-options="{debounce: \'$inherit\'}">' +
                '</td>'
            ),
            ngModel = element.find('input').controller('ngModel');

        this.$rootScope.$apply();

        expect(ngModel.$options.$$options.debounce).toEqual(5000);
    });

    it('should not set debounce option for select', function() {
        var select = this.getCompiledElement('<select ng-model="value"></select'),
            ngModel = select.controller('ngModel');

        this.$rootScope.$apply();

        expect(ngModel.$options.$$options.debounce).toBeFalsy();
    });

    it('should not set debounce option for radio inputs', function() {
        var input = this.getCompiledElement('<input type="radio" ng-model="value"></input>'),
            ngModel = input.controller('ngModel');

        this.$rootScope.$apply();

        expect(ngModel.$options.$$options.debounce).toBeFalsy();
    });

    it('should not set debounce option for checkboxes', function() {
        var input = this.getCompiledElement('<input type="checkbox" ng-model="value"></input>'),
            ngModel = input.controller('ngModel');

        this.$rootScope.$apply();

        expect(ngModel.$options.$$options.debounce).toBeFalsy();
    });

    it('should not set debounce option for openlmisTagsInpuy', function() {
        var input = this.getCompiledElement('<openlmis-tags-input></openlmis-tags-input>').find('input'),
            ngModel = input.controller('ngModel');

        this.$rootScope.$apply();

        expect(ngModel.$options.$$options.debounce).toBeFalsy();
    });

    function getCompiledElement(html) {
        var compiledElement = this.$compile(html)(this.scope);
        angular.element('body').append(compiledElement);
        this.scope.$digest();
        return compiledElement;
    }

});
