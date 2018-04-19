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

ddescribe('openlmisModalService', function() {

    var openlmisModalService, $rootScope, $modal, $timeout;

    beforeEach(function() {
        module('openlmis-modal', function($provide) {
            $provide.service('$modal', function() {
                return preapreModalSpy();
            });
        });

        inject(services);
    });

    describe('modal', function() {

        //OLMIS-25434
        //This was causing the alert service to be unable to open one after another
        it('should reject promise when hiding modal', function() {
            var modal = openlmisModalService.createDialog({}),
                rejected;

            modal.promise.catch(function() {
                rejected = true;
            });

            modal.hide();
            $rootScope.$apply();

            expect(rejected).toBeTruthy();
        });

        it('should not hide modal when it is not displayed', function() {
            var modal = openlmisModalService.createDialog({});

            spyOn(modal, 'hide').andCallThrough();
            spyOn(modal, '$$hide');

            modal.$isShown = false;
            modal.hide();

            expect(modal.$$hide).not.toHaveBeenCalled();
        });

        it('should hide modal when it is displayed', function() {
            var modal = openlmisModalService.createDialog({});

            spyOn(modal, 'hide').andCallThrough();
            spyOn(modal, '$$hide');

            modal.$isShown = true;
            modal.hide();

            expect(modal.$$hide).toHaveBeenCalled();
        });

        it('should hide modal after it was shown', function() {
            var modal = openlmisModalService.createDialog({});

            spyOn(modal, 'hide').andCallThrough();
            spyOn(modal, '$$hide');

            modal.$isShown = false;
            modal.hide();

            expect(modal.$$hide).not.toHaveBeenCalled();

            modal.$isShown = true;
            $timeout.flush();

            expect(modal.$$hide).toHaveBeenCalled();
        });

        it('should not close on backdrop click as default', function() {
            openlmisModalService.createDialog({});

            expect($modal.calls[0].args[0].backdrop).toEqual('static');
        });

        it('should not close on ESC click as default', function() {
            openlmisModalService.createDialog({});

            expect($modal.calls[0].args[0].keyboard).toEqual(false);
        });

        it('should allow default backdrop behavior override', function() {
            openlmisModalService.createDialog({
                backdrop: false
            });

            expect($modal.calls[0].args[0].backdrop).toEqual(false);
        });

        it('should allow default ESC behavior override', function() {
            openlmisModalService.createDialog({
                keyboard: true
            });

            expect($modal.calls[0].args[0].keyboard).toEqual(true);

        });
    });

    function services($injector) {
        openlmisModalService = $injector.get('openlmisModalService');
        $rootScope = $injector.get('$rootScope');
        $timeout = $injector.get('$timeout');
    }

    function preapreModalSpy() {
        $modal = jasmine.createSpy('$modal');
        $modal.andCallFake(function(dialog) {
            dialog.hide = function() {};
            return dialog;
        });
        return $modal;
    }

});
