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

describe('TD openlmisInvalid message', function() {

    beforeEach(function() {
        module('openlmis-table-form');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$compile = $injector.get('$compile');
        });

        var markup = '<td openlmis-invalid="{{message}}" ></td>';
        this.scope = this.$rootScope.$new();
        this.element = this.$compile(markup)(this.scope);

        this.openlmisPopoverCtrl = this.element.controller('openlmis-popover');
        spyOn(this.openlmisPopoverCtrl, 'addElement').andCallThrough();
        spyOn(this.openlmisPopoverCtrl, 'removeElement').andCallThrough();

        this.scope.$apply();
    });

    it('will add invalidMessageElement to popover, not table cell', function() {
        this.scope.message = 'Error';
        this.scope.$apply();

        expect(this.openlmisPopoverCtrl.addElement).toHaveBeenCalled();

        var messageElement = this.openlmisPopoverCtrl.addElement.mostRecentCall.args[0];

        expect(messageElement.text().indexOf('Error')).not.toBe(-1);
    });

    it('will remove invalidMessageElement from popover when not invalid', function() {
        this.scope.message = 'Error';
        this.scope.$apply();

        this.scope.message = false;
        this.scope.$apply();

        expect(this.openlmisPopoverCtrl.removeElement).toHaveBeenCalled();

        var messageElement = this.openlmisPopoverCtrl.removeElement.mostRecentCall.args[0];

        expect(messageElement.text().indexOf('Error')).not.toBe(-1);
    });

});