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

    beforeEach(function() {
        module('openlmis-modal');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.messageService = $injector.get('messageService');
        });

        this.className = 'class-name';
        this.messageKey = 'modalMessage';
        this.message = 'Modal message\nWith multiple lines';
        this.confirmMessage = 'Confirm Message';
        this.cancelMessage = 'Cancel Message';
        this.titleMessage = 'Title message';
        this.confirmDeferred = jasmine.createSpyObj('confirmDeferred', ['resolve', 'reject']);
        this.modalDeferred = jasmine.createSpyObj('confirmDeferred', ['resolve', 'reject']);

        this.vm = this.$controller('ConfirmModalController', {
            className: this.className,
            message: this.messageKey,
            confirmMessage: this.confirmMessage,
            cancelMessage: this.cancelMessage,
            titleMessage: this.titleMessage,
            confirmDeferred: this.confirmDeferred,
            modalDeferred: this.modalDeferred
        });
    });

    describe('$onInit', function() {

        it('should expose class name', function() {
            this.vm.$onInit();

            expect(this.vm.className).toEqual(this.className);
        });

        it('should expose parsed message', function() {
            spyOn(this.messageService, 'get').and.returnValue(this.message);

            this.vm.$onInit();

            expect(this.vm.message).toEqual('Modal message<br/>With multiple lines');
            expect(this.messageService.get).toHaveBeenCalledWith(this.messageKey);
        });

        it('should expose confirm message', function() {
            this.vm.$onInit();

            expect(this.vm.confirmMessage).toEqual(this.confirmMessage);
        });

        it('should expose cancel message', function() {
            this.vm.$onInit();

            expect(this.vm.cancelMessage).toEqual(this.cancelMessage);
        });

        it('should expose title message', function() {
            this.vm.$onInit();

            expect(this.vm.titleMessage).toEqual(this.titleMessage);
        });
    });

    describe('confirm', function() {

        it('should resolve confirm promise', function() {
            this.vm.confirm();

            expect(this.confirmDeferred.resolve).toHaveBeenCalled();
        });

        it('should resolve modal promise', function() {
            this.vm.confirm();

            expect(this.modalDeferred.resolve).toHaveBeenCalled();
        });

    });

    describe('cancel', function() {

        it('should resolve confirm promise', function() {
            this.vm.cancel();

            expect(this.confirmDeferred.reject).toHaveBeenCalled();
        });

        it('should resolve modal promise', function() {
            this.vm.cancel();

            expect(this.modalDeferred.resolve).toHaveBeenCalled();
        });

    });

});
