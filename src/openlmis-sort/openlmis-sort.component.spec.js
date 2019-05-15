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

    beforeEach(function() {
        module('openlmis-sort');

        inject(function($injector) {
            this.$timeout = $injector.get('$timeout');
            this.$rootScope = $injector.get('$rootScope');
            this.$compile = $injector.get('$compile');
            this.$templateCache = $injector.get('$templateCache');
        });

        this.$templateCache.put('openlmis-sort/openlmis-sort.html', 'something');

        var markup = '<openlmis-sort sort="sortValue" on-change="onChange" options="options" external-sort="external"' +
            'state-param-name="sortName"><openlmis-sort/>';

        this.$scope = this.$rootScope.$new();
        this.$scope.sortValue = 'username';
        this.$scope.onChange = function(param) {
            return 'parameter: ' + param;
        };
        this.$scope.options = {
            username: 'sort.username.message',
            firstName: 'sort.firstName.message'
        };
        this.$scope.external = true;
        this.$scope.sortName = 'sortParamName';

        this.element = this.$compile(markup)(this.$scope);
        angular.element('body').append(this.element);

        this.$scope.$apply();
        this.$timeout.flush();

        this.controller = angular.element('openlmis-sort').controller('openlmisSort');
    });

    it('should assign proper values', function() {
        expect(this.controller.options).toEqual({
            username: 'sort.username.message',
            firstName: 'sort.firstName.message'
        });

        expect(this.controller.externalSort).toEqual(true);
        expect(this.controller.stateParamName).toEqual('sortParamName');
        expect(angular.isFunction(this.controller.onChange)).toBe(true);
        expect(this.controller.onChange('some-value')).toEqual('parameter: some-value');
    });
});
