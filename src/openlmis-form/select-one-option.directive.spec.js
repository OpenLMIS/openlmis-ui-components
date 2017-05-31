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

    'use strict';

    var $compile, scope, element;

    beforeEach(function() {

        module('openlmis-templates');
        module('openlmis-form');

        inject(function(_$compile_, $rootScope) {
            $compile = _$compile_;

            scope = $rootScope.$new();
            scope.options = [];
            element = $compile(
                '<select ng-model="value" ng-options="option for option in options" required></select>'
                )(scope);
            scope.$apply();
            element = angular.element(element[0]);
        });
    });

    it('will set ngModel to first option, if there is only one option available', function(){
        scope.options = ['foo', 'bar', 'baz'];
        scope.$apply();

        expect(scope.value).toBeUndefined();

        scope.options = ['foo'];
        scope.$apply();

        expect(scope.value).toBe('foo');
    });

    it('will only auto select if the element is required', function(){
        element.removeAttr('required');
        scope.options = ['foo'];
        scope.$apply();

        expect(element.val()).not.toBe('foo');
    });
});
