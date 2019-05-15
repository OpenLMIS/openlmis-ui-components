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

    beforeEach(function() {
        module('openlmis-modal');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
        });

        this.alertClass = 'error';
        this.title = 'Alert Title';
        this.message = 'Some modal message';
        this.buttonLabel = 'OK';
        this.modalDeferredSpy = jasmine.createSpyObj('modalDeferred', ['resolve']);

        this.vm = this.$controller('AlertModalController', {
            alertClass: this.alertClass,
            title: this.title,
            message: this.message,
            buttonLabel: this.buttonLabel,
            modalDeferred: this.modalDeferredSpy
        });

        this.vm.$onInit();
    });

    describe('$onInit', function() {

        it('should expose alert class', function() {
            expect(this.vm.alertClass).toEqual(this.alertClass);
        });

        it('should expose alert title', function() {
            expect(this.vm.title).toEqual(this.title);
        });

        it('should expose alert message', function() {
            expect(this.vm.message).toEqual(this.message);
        });

        it('should expose button label', function() {
            expect(this.vm.buttonLabel).toEqual(this.buttonLabel);
        });

    });

    describe('close', function() {

        it('should resolve the modalDeferred', function() {
            this.vm.close();

            expect(this.modalDeferredSpy.resolve).toHaveBeenCalled();
        });

    });

});
