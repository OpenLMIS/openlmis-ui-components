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

describe('TD openlmis-invalid', function() {
    'use strict';

    var element, scope;

    beforeEach(module('openlmis-table-form'));

    it('always gets openlmisInvalid controller', inject(function($compile, $rootScope){
        var markup = '<td></td>';
        
        scope = $rootScope.$new();
        element = $compile(markup)(scope);

        scope.$apply();

        expect(element.controller('openlmisInvalid')).not.toBeFalsy();
    }));

    it('does not overwrite existing openlmis-invalid directive', inject(function($compile, $rootScope){
        var markup = '<td openlmis-invalid="{{invalidMessage}}" ></td>';
        
        scope = $rootScope.$new();
        element = $compile(markup)(scope);

        scope.$apply();

        var controller = element.controller('openlmisInvalid');

        expect(Object.keys(controller.getMessages()).length).toBe(0);

        scope.invalidMessage = "Example";
        scope.$apply();

        expect(element.hasClass('is-invalid')).toBe(true);        
    }));

    it('works with ng-repeat', inject(function($compile, $rootScope) {
        var markup = '<table><tr><td ng-repeat="i in [1,2,3,4]">{{i}}</td><tr></table>';

        scope = $rootScope.$new();
        element = $compile(markup)(scope);

        scope.$apply();

        expect(element.find('td').length).toBe(4);

        element.find('td').each(function(i, element) {
            expect(angular.element(element).controller('openlmisInvalid')).not.toBeFalsy();
        });

    }));
});
