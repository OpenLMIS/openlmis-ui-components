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

    beforeEach(function() {
        module('openlmis-table-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.compileElement = function(markup) {
            this.$scope = this.$rootScope.$new();
            this.element = this.$compile(markup)(this.$scope);
            this.$scope.$apply();
        };

        var markup = '<td></td>';
        this.compileElement(markup);
    });

    it('always gets openlmisInvalid controller', function() {
        expect(this.element.controller('openlmisInvalid')).not.toBeFalsy();
    });

    it('does not overwrite existing openlmis-invalid directive', function() {
        var markup = '<td openlmis-invalid="{{invalidMessage}}" ></td>';

        this.compileElement(markup);

        expect(Object.keys(this.element.controller('openlmisInvalid').getMessages()).length).toBe(0);

        this.$scope.invalidMessage = 'Example';
        this.$scope.$apply();

        expect(this.element.hasClass('is-invalid')).toBe(true);
    });

    it('works with ng-repeat', function() {
        var markup =
            '<table>' +
                '<tr>' +
                    '<td ng-repeat="i in [1,2,3,4]">{{i}}</td>' +
                '<tr>' +
            '</table>';

        this.compileElement(markup);

        expect(this.element.find('td').length).toBe(4);

        this.element.find('td').each(function(i, element) {
            expect(angular.element(element).controller('openlmisInvalid')).not.toBeFalsy();
        });

    });
});
