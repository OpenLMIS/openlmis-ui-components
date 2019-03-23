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

describe('alertService', function() {

    var alertService, $q, $rootScope, openlmisModalService, modalMock, title, message, buttonLabel, modalDeferred;

    beforeEach(function() {
        module('openlmis-modal');

        inject(function($injector) {
            alertService = $injector.get('alertService');
            openlmisModalService = $injector.get('openlmisModalService');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
        });

        modalDeferred = $q.defer();

        modalMock = {
            promise: modalDeferred.promise
        };

        spyOn(openlmisModalService, 'createDialog').and.returnValue(modalMock);
    });

    describe('error', function() {

        beforeEach(function() {
            title = 'Error Title';
            message = 'Error Message';
            buttonLabel = 'Error Label';
        });

        it('should pass is-error as class', function() {
            alertService.error(title, message, buttonLabel);

            expect(getResolve('alertClass')).toEqual('is-error');
        });

        it('should pass title', function() {
            alertService.error(title, message, buttonLabel);

            expect(getResolve('title')).toEqual(title);
        });

        it('should pass message', function() {
            alertService.error(title, message, buttonLabel);

            expect(getResolve('message')).toEqual(message);
        });

        it('should pass label', function() {
            alertService.error(title, message, buttonLabel);

            expect(getResolve('buttonLabel')).toEqual(buttonLabel);
        });

        it('should default button message to openlmisModal.close', function() {
            alertService.error(title, message);

            expect(getResolve('buttonLabel')).toEqual('openlmisModal.close');
        });

        it('should reject if previous alert is open', function() {
            alertService.error(title, message, buttonLabel);

            var rejected;
            alertService.error(title, message, buttonLabel)
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);

            modalDeferred.resolve();
            $rootScope.$apply();

            rejected = undefined;
            alertService.error(title, message, buttonLabel)
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBeUndefined();
        });

    });

    describe('success', function() {

        beforeEach(function() {
            title = 'Success Title';
            message = 'Success Message';
            buttonLabel = 'Success Label';
        });

        it('should pass is-success as class', function() {
            alertService.success(title, message, buttonLabel);

            expect(getResolve('alertClass')).toEqual('is-success');
        });

        it('should pass title', function() {
            alertService.success(title, message, buttonLabel);

            expect(getResolve('title')).toEqual(title);
        });

        it('should pass message', function() {
            alertService.success(title, message, buttonLabel);

            expect(getResolve('message')).toEqual(message);
        });

        it('should pass label', function() {
            alertService.success(title, message, buttonLabel);

            expect(getResolve('buttonLabel')).toEqual(buttonLabel);
        });

        it('should default button message to openlmisModal.close', function() {
            alertService.success(title, message);

            expect(getResolve('buttonLabel')).toEqual('openlmisModal.close');
        });

        it('should reject if previous alert is open', function() {
            alertService.success(title, message, buttonLabel);

            var rejected;
            alertService.success(title, message, buttonLabel)
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);

            modalDeferred.resolve();
            $rootScope.$apply();

            rejected = undefined;
            alertService.success(title, message, buttonLabel)
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBeUndefined();
        });

    });

    describe('info', function() {

        beforeEach(function() {
            title = 'Info Title';
            message = 'Info Message';
            buttonLabel = 'Info Label';
        });

        it('should pass is-info as class', function() {
            alertService.info({
                title: title,
                message: message,
                buttonLabel: buttonLabel
            });

            expect(getResolve('alertClass')).toEqual('is-info');
        });

        it('should pass title', function() {
            alertService.info({
                title: title,
                message: message,
                buttonLabel: buttonLabel
            });

            expect(getResolve('title')).toEqual(title);
        });

        it('should pass message', function() {
            alertService.info({
                title: title,
                message: message,
                buttonLabel: buttonLabel
            });

            expect(getResolve('message')).toEqual(message);
        });

        it('should pass label', function() {
            alertService.info({
                title: title,
                message: message,
                buttonLabel: buttonLabel
            });

            expect(getResolve('buttonLabel')).toEqual(buttonLabel);
        });

        it('should default button message to openlmisModal.close', function() {
            alertService.info({
                title: title,
                message: message
            });

            expect(getResolve('buttonLabel')).toEqual('openlmisModal.close');
        });

        it('should reject if previous alert is open', function() {
            alertService.info({
                title: title,
                message: message,
                buttonLabel: buttonLabel
            });

            var rejected;
            alertService.info({
                title: title,
                message: message,
                buttonLabel: buttonLabel
            })
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);

            modalDeferred.resolve();
            $rootScope.$apply();

            rejected = undefined;
            alertService.info({
                title: title,
                message: message,
                buttonLabel: buttonLabel
            })
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBeUndefined();
        });

    });

    function getResolve(name) {
        return openlmisModalService.createDialog.calls.mostRecent().args[0].resolve[name]();
    }

});
