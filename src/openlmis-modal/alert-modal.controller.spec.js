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

describe('AlertModalController', function() {

    var vm, $controller, alertClass, title, message, buttonLabel, modalDeferredSpy;

    beforeEach(function() {
        module('openlmis-modal');

        inject(function($injector) {
            $controller = $injector.get('$controller');
        });

        alertClass = 'error';
        title = 'Alert Title';
        message = 'Some modal message';
        buttonLabel = 'OK';
        modalDeferredSpy = jasmine.createSpyObj('modalDeferred', ['resolve']);

        vm = $controller('AlertModalController', {
            alertClass: alertClass,
            title: title,
            message: message,
            buttonLabel: buttonLabel,
            modalDeferred: modalDeferredSpy
        });

        vm.$onInit();
    });

    describe('$onInit', function() {

        it('should expose alert class', function() {
            expect(vm.alertClass).toEqual(alertClass);
        });

        it('should expose alert title', function() {
            expect(vm.title).toEqual(title);
        });

        it('should expose alert message', function() {
            expect(vm.message).toEqual(message);
        });

        it('should expose button label', function() {
            expect(vm.buttonLabel).toEqual(buttonLabel);
        });

    });

    describe('close', function() {
    
        it('should resolve the modalDeferred', function() {
            vm.close();

            expect(modalDeferredSpy.resolve).toHaveBeenCalled();
        });
    
    });

});
