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

describe('openlmisModalService', function() {

    beforeEach(function() {
        this.$modal = jasmine.createSpy('$modal');

        var $modal = this.$modal;
        module('openlmis-modal', function($provide) {
            $provide.service('$modal', function() {
                return $modal;
            });
        });

        inject(function($injector) {
            this.openlmisModalService = $injector.get('openlmisModalService');
            this.$rootScope = $injector.get('$rootScope');
            this.$timeout = $injector.get('$timeout');
        });

        this.$modal.andCallFake(function(dialog) {
            return _.extend({}, dialog, {
                hide: function() {}
            });
        });
    });

    describe('modal', function() {

        //OLMIS-25434
        //This was causing the alert service to be unable to open one after another
        it('should reject promise when hiding modal', function() {
            var modal = this.openlmisModalService.createDialog({}),
                rejected;

            modal.promise.catch(function() {
                rejected = true;
            });

            modal.hide();
            this.$rootScope.$apply();

            expect(rejected).toBeTruthy();
        });

        it('should not hide modal when it is not displayed', function() {
            var modal = this.openlmisModalService.createDialog({});

            spyOn(modal, 'hide').andCallThrough();
            spyOn(modal, '$$hide');

            modal.$isShown = false;
            modal.hide();

            expect(modal.$$hide).not.toHaveBeenCalled();
        });

        it('should hide modal when it is displayed', function() {
            var modal = this.openlmisModalService.createDialog({});

            spyOn(modal, 'hide').andCallThrough();
            spyOn(modal, '$$hide');

            modal.$isShown = true;
            modal.hide();

            expect(modal.$$hide).toHaveBeenCalled();
        });

        it('should hide modal after it was shown', function() {
            var modal = this.openlmisModalService.createDialog({});

            spyOn(modal, 'hide').andCallThrough();
            spyOn(modal, '$$hide');

            modal.$isShown = false;
            modal.hide();

            expect(modal.$$hide).not.toHaveBeenCalled();

            modal.$isShown = true;
            this.$timeout.flush();

            expect(modal.$$hide).toHaveBeenCalled();
        });

        it('should not close on backdrop click as default', function() {
            this.openlmisModalService.createDialog({});

            expect(this.$modal.calls[0].args[0].backdrop).toEqual('static');
        });

        it('should not close on ESC click as default', function() {
            this.openlmisModalService.createDialog({});

            expect(this.$modal.calls[0].args[0].keyboard).toEqual(false);
        });

        it('should allow default backdrop behavior override', function() {
            this.openlmisModalService.createDialog({
                backdrop: false
            });

            expect(this.$modal.calls[0].args[0].backdrop).toEqual(false);
        });

        it('should allow default ESC behavior override', function() {
            this.openlmisModalService.createDialog({
                keyboard: true
            });

            expect(this.$modal.calls[0].args[0].keyboard).toEqual(true);

        });
    });

});
