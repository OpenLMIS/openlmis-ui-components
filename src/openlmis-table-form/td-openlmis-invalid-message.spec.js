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
    var element, scope, openlmisPopoverCtrl;

    beforeEach(module('openlmis-table-form'));

    beforeEach(inject(function($rootScope, $compile) {
        var markup = '<td openlmis-invalid="{{message}}" ></td>';
        scope = $rootScope.$new();
        element = $compile(markup)(scope);

        openlmisPopoverCtrl = element.controller('popover');
        spyOn(openlmisPopoverCtrl, 'addElement').and.callThrough();
        spyOn(openlmisPopoverCtrl, 'removeElement').and.callThrough();

        scope.$apply();
    }));

    it('will add invalidMessageElement to popover, not table cell', function() {
        scope.message = 'Error';
        scope.$apply();

        expect(openlmisPopoverCtrl.addElement).toHaveBeenCalled();

        var messageElement = openlmisPopoverCtrl.addElement.calls.mostRecent().args[0];

        expect(messageElement.text().indexOf('Error')).not.toBe(-1);
    });

    it('will remove invalidMessageElement from popover when not invalid', function() {
        scope.message = 'Error';
        scope.$apply();

        scope.message = false;
        scope.$apply();

        expect(openlmisPopoverCtrl.removeElement).toHaveBeenCalled();

        var messageElement = openlmisPopoverCtrl.removeElement.calls.mostRecent().args[0];

        expect(messageElement.text().indexOf('Error')).not.toBe(-1);
    });

});