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

describe('openlmisDatepickerCompile', function() {

    var $compile, $rootScope, element, $scope;

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        });
    });

    it('should date input with openlmis datepicker', function() {
        compileElement('<input type="date" ng-model="dateModel"/>');

        expect(element.attr('openlmis-datepicker')).not.toBeUndefined();
    });

    it('should attach openlmis-datepicker class to the parent element', function() {
        compileElement('<input type="date" ng-model="dateModel"/>');

        expect(element.parent().hasClass('openlmis-datepicker')).toBe(true);
    });

    it('should copy all attributes', function() {
        compileElement(
            '<input type="date" some-weird-attribute-that="i-definitely-did-not-hard-coded" ng-model="dateModel"/>'
        );

        expect(element.attr('openlmis-datepicker')).not.toBeUndefined();
        expect(element.attr('some-weird-attribute-that')).toEqual('i-definitely-did-not-hard-coded');
    });

    it('should do nothing if input not of date type', function() {
        compileElement('<input type="text" ng-model="dateModel"/>');

        expect(element.attr('openlmis-datepicker')).toBeUndefined();
        expect(element.parent().hasClass('openlmis-datepicker')).toBe(false);
    });

    function compileElement(template) {
        $scope = $rootScope.$new();
        element = $compile(template)($scope);
        $scope.$apply();
    }

});
