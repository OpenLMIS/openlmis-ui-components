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

describe('inputControl Controller', function() {

    var vm;

    beforeEach(module('openlmis-form'));

    beforeEach(inject(function($controller) {
        vm = $controller('InputControlController');
    }));

    it('returns list of errors for ngModelCtrl objects that are registered', function() {
        var ngModelCtrl = {
            $error: {}
        };
        vm.addNgModel(ngModelCtrl);

        expect(Object.keys(vm.getErrors()).length).toBe(0);

        ngModelCtrl.$error['required'] = true;
        ngModelCtrl.$error['foo'] = 'bar';

        expect(vm.getErrors().required).toBe(true);
        expect(vm.getErrors().foo).toBe('bar');
    });

});