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

describe('openlmis sort component', function() {
    var $templateCache, $timeout, $rootScope, $compile, scope, element, controller;

    beforeEach(function() {
        module('openlmis-sort');

        inject(function($injector) {
            $timeout = $injector.get('$timeout');
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $templateCache = $injector.get('$templateCache');
        });

        $templateCache.put('openlmis-sort/openlmis-sort.html', 'something');

        var markup = '<openlmis-sort sort="sortValue" on-change="onChange" options="options" external-sort="external"' +
            'state-param-name="sortName"><openlmis-sort/>';

        scope = $rootScope.$new();
        scope.sortValue = 'username';
        scope.onChange = function(param) {
            return 'parameter: ' + param;
        };
        scope.options = {
            username: 'sort.username.message',
            firstName: 'sort.firstName.message'
        };
        scope.external = true;
        scope.sortName = 'sortParamName';

        element = $compile(markup)(scope);
        angular.element('body').append(element);

        scope.$apply();
        $timeout.flush();

        controller = angular.element('openlmis-sort').controller('openlmisSort');
    });

    it('should assign proper values', function() {
        expect(controller.options).toEqual({
            username: 'sort.username.message',
            firstName: 'sort.firstName.message'
        });

        expect(controller.externalSort).toEqual(true);
        expect(controller.stateParamName).toEqual('sortParamName');
        expect(angular.isFunction(controller.onChange)).toBe(true);
        expect(controller.onChange('some-value')).toEqual('parameter: some-value');
    });
});
