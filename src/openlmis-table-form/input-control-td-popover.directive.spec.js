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

describe('TD input-control popover directive', function() {

    beforeEach(function() {
        module('openlmis-table-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.$scope = this.$rootScope.$new();

        var markup =
            '<td>' +
                '<div input-control openlmis-invalid="{{error}}"></div>' +
            '</td>';

        this.input = this.$compile(markup)(this.$scope).find('[input-control]:first');
    });

    it('Adds openlmis-popover to input-control directives in a TD', function() {
        expect(this.input.controller('openlmis-popover')).not.toBeUndefined();
    });

    it('Displays error messages in the popover', function() {
        var popoverCtrl = this.input.controller('openlmis-popover');
        spyOn(popoverCtrl, 'addElement').andCallThrough();

        this.$scope.error = 'Error!';
        this.$scope.$apply();

        expect(popoverCtrl.addElement).toHaveBeenCalled();
    });

    it('Sets input-control tabindex to -1', function() {
        expect(this.input.attr('tabindex')).toBeUndefined();

        this.$scope.error = 'Error!';
        this.$scope.$apply();

        expect(this.input.attr('tabindex')).toBe('-1');
    });

});