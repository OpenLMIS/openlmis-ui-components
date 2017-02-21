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

describe('Select search option directive', function() {

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

    describe('search-able pop-out', function() {

        it('should not set pop-out class when there is less than 10 options', function() {
            expect(element.hasClass('pop-out')).toBe(false);
        });

        it('should set pop-out class when there is more than 10 options', function() {
            scope.options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            scope.$apply();
            expect(element.hasClass('pop-out')).toBe(true);
        });
    });

});
