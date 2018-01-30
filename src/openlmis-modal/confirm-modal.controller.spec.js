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

describe('ConfirmModalController', function() {

    var vm, $controller, messageService, className, message, confirmMessage, cancelMessage, titleMessage,
        confirmDeferred, modalDeferred, messageKey;

    beforeEach(function() {
        module('openlmis-modal');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            messageService = $injector.get('messageService');
        });

        className = 'class-name';
        messageKey = 'modalMessage';
        message = 'Modal message\nWith multiple lines';
        confirmMessage = 'Confirm Message';
        cancelMessage = 'Cancel Message';
        titleMessage = 'Title message';
        confirmDeferred = jasmine.createSpyObj('confirmDeferred', ['resolve', 'reject']);
        modalDeferred = jasmine.createSpyObj('confirmDeferred', ['resolve', 'reject']);

        vm = $controller('ConfirmModalController', {
            className: className,
            message: messageKey,
            confirmMessage: confirmMessage,
            cancelMessage: cancelMessage,
            titleMessage: titleMessage,
            confirmDeferred: confirmDeferred,
            modalDeferred: modalDeferred
        });
    });

    describe('$onInit', function() {

        it('should expose class name', function() {
            vm.$onInit();

            expect(vm.className).toEqual(className);
        });

        it('should expose parsed message', function() {
            spyOn(messageService, 'get').andCallFake(function(key) {
                if (key === messageKey) return message;
            });

            vm.$onInit();

            expect(vm.message).toEqual('Modal message<br/>With multiple lines');
        });

        it('should expose confirm message', function() {
            vm.$onInit();

            expect(vm.confirmMessage).toEqual(confirmMessage);
        });

        it('should expose cancel message', function() {
            vm.$onInit();

            expect(vm.cancelMessage).toEqual(cancelMessage);
        });

        it('should expose title message', function() {
            vm.$onInit();

            expect(vm.titleMessage).toEqual(titleMessage);
        });
    });

    describe('confirm', function() {

        it('should resolve confirm promise', function() {
            vm.confirm();

            expect(confirmDeferred.resolve).toHaveBeenCalled();
        });

        it('should resolve modal promise', function() {
            vm.confirm();

            expect(modalDeferred.resolve).toHaveBeenCalled();
        });

    });

    describe('cancel', function() {

        it('should resolve confirm promise', function() {
            vm.cancel();

            expect(confirmDeferred.reject).toHaveBeenCalled();
        });


        it('should resolve modal promise', function() {
            vm.cancel();

            expect(modalDeferred.resolve).toHaveBeenCalled();
        });

    });

});
