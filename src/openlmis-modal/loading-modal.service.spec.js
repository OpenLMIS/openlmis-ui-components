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
describe('loadingModalService', function() {

    var loadingModalService, $q, $timeout, $rootScope, openlmisModalServiceMock, dialog,
        dialogDeferred;

    beforeEach(function() {
        expectedDialogOptions = {
            backdrop: 'static',
            templateUrl: 'openlmis-modal/loading-modal.html'
        };

        openlmisModalServiceMock = jasmine.createSpyObj('openlmisModalService', ['createDialog']);

        module('openlmis-modal', function($provide) {
            $provide.service('openlmisModalService', function() {
                return openlmisModalServiceMock;
            });
        });

        inject(function($injector) {
            loadingModalService = $injector.get('loadingModalService');
            $q = $injector.get('$q');
            $timeout = $injector.get('$timeout');
            $rootScope = $injector.get('$rootScope');
        });

        dialogDeferred  = $q.defer();
        dialog = jasmine.createSpyObj('dialog', ['show', 'hide']);
        dialog.promise = dialogDeferred.promise;

        openlmisModalServiceMock.createDialog.andReturn(dialog);
    });



    describe('open', function() {

        it('should return promise', function() {
            expect(loadingModalService.open().then).not.toBeUndefined();
        });

        it('should create dialog', function() {
            loadingModalService.open();

            expect(openlmisModalServiceMock.createDialog)
                .toHaveBeenCalledWith(expectedDialogOptions);
        });

        it('should show dialog if called without delay', function() {
            loadingModalService.open();

            expect(openlmisModalServiceMock.createDialog).toHaveBeenCalled();
        });

        it('should show dialog after delay', function() {
            loadingModalService.open(true);

            expect(openlmisModalServiceMock.createDialog).not.toHaveBeenCalled();

            $timeout.flush();

            expect(openlmisModalServiceMock.createDialog).toHaveBeenCalled();
        });

        it('should set isOpened flag', function() {
            loadingModalService.open();

            expect(loadingModalService.isOpened).toBe(true);
        });
    });

    describe('close', function() {

        beforeEach(function() {
            spyOn($timeout, 'cancel').andCallThrough();
        });

        it('should close dialog', function() {
            loadingModalService.open();
            loadingModalService.close();

            expect(dialog.hide).toHaveBeenCalled();
        });

        it('should cancel timeout if showing dialog was delayed', function() {
            loadingModalService.open(true);
            loadingModalService.close();

            expect($timeout.cancel).toHaveBeenCalled();
        });

        it('should resolve promise returned by show', function() {
            var result;

            loadingModalService.open().then(function() {
                result = 'something';
            });
            loadingModalService.close();
            $rootScope.$apply();

            expect(result).toEqual('something');
        });

        it('should set isOpened flag', function() {
            loadingModalService.close();

            expect(loadingModalService.isOpened).toBe(false);
        });
    });
});
