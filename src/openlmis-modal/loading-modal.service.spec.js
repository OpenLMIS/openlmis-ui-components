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

    beforeEach(function() {

        module('openlmis-modal');

        inject(function($injector) {
            this.loadingModalService = $injector.get('loadingModalService');
            this.openlmisModalService = $injector.get('openlmisModalService');
            this.$q = $injector.get('$q');
            this.$timeout = $injector.get('$timeout');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.dialogDeferred  = this.$q.defer();
        this.dialog = jasmine.createSpyObj('dialog', ['show', 'hide']);
        this.dialog.promise = this.dialogDeferred.promise;
        this.expectedDialogOptions = {
            backdrop: 'static',
            templateUrl: 'openlmis-modal/loading-modal.html'
        };

        spyOn(this.openlmisModalService, 'createDialog').and.returnValue(this.dialog);
        spyOn(this.$timeout, 'cancel').and.callThrough();
    });

    describe('open', function() {

        it('should return promise', function() {
            expect(this.loadingModalService.open().then).not.toBeUndefined();
        });

        it('should create dialog', function() {
            this.loadingModalService.open();

            expect(this.openlmisModalService.createDialog).toHaveBeenCalledWith(this.expectedDialogOptions);
        });

        it('should show dialog if called without delay', function() {
            this.loadingModalService.open();

            expect(this.openlmisModalService.createDialog).toHaveBeenCalled();
        });

        it('should show dialog after delay', function() {
            this.loadingModalService.open(true);

            expect(this.openlmisModalService.createDialog).not.toHaveBeenCalled();

            this.$timeout.flush();

            expect(this.openlmisModalService.createDialog).toHaveBeenCalled();
        });

        it('should set isOpened flag', function() {
            this.loadingModalService.open();

            expect(this.loadingModalService.isOpened).toBe(true);
        });
    });

    describe('close', function() {

        it('should close dialog', function() {
            this.loadingModalService.open();
            this.loadingModalService.close();

            expect(this.dialog.hide).toHaveBeenCalled();
        });

        it('should cancel timeout if showing dialog was delayed', function() {
            this.loadingModalService.open(true);
            this.loadingModalService.close();

            expect(this.$timeout.cancel).toHaveBeenCalled();
        });

        it('should resolve promise returned by show', function() {
            var result;

            this.loadingModalService.open().then(function() {
                result = 'something';
            });
            this.loadingModalService.close();
            this.$rootScope.$apply();

            expect(result).toEqual('something');
        });

        it('should set isOpened flag', function() {
            this.loadingModalService.close();

            expect(this.loadingModalService.isOpened).toBe(false);
        });
    });

    describe('whenClosed', function() {

        it('should return a promise if modal is open', function() {
            this.loadingModalService.open();
            this.$rootScope.$apply();

            var closed;
            this.loadingModalService.whenClosed()
                .then(function() {
                    closed = true;
                });

            expect(closed).not.toBe(true);

            this.loadingModalService.close();
            this.$rootScope.$apply();

            expect(closed).toBe(true);
        });

        it('should return a resolved promise if modal is closed', function() {
            var closed;
            this.loadingModalService.whenClosed()
                .then(function() {
                    closed = true;
                });
            this.$rootScope.$apply();

            expect(closed).toBe(true);
        });

    });
});
