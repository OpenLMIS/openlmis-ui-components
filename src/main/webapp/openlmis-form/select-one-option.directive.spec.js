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
                '<select ng-model="value" ng-options="option for option in options"></select>'
                )(scope);
            scope.$apply();
            element = angular.element(element[0]);
        });
    });

    it('will disable element if there are no options', function(){
        scope.options = [1, 2, 3, 4];
        scope.$apply();
        expect(element.attr('disabled')).not.toBe(true);

        scope.options = [];
        scope.$apply();
        expect(element.attr('disabled')).toBe('disabled');
    });

    it('will set ngModel to first option and disable the select, if there is only one option', function(){
        scope.options = ['foo bar'];
        scope.$apply();
        expect(element.attr('disabled')).toBe('disabled');
        expect(scope.value).toBe('foo bar');
    });
});
