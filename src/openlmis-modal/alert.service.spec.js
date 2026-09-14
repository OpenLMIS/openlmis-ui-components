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

    beforeEach(function() {
        module('openlmis-modal');

        inject(function($injector) {
            this.alertService = $injector.get('alertService');
            this.openlmisModalService = $injector.get('openlmisModalService');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.modalDeferred = this.$q.defer();

        this.modalMock = {
            promise: this.modalDeferred.promise,
            hide: jasmine.createSpy('hide')
        };

        spyOn(this.openlmisModalService, 'createDialog').andReturn(this.modalMock);

        this.getResolve = getResolve;
    });

    describe('error', function() {

        beforeEach(function() {
            this.title = 'Error Title';
            this.message = 'Error Message';
            this.buttonLabel = 'Error Label';
        });

        it('should pass is-error as class', function() {
            this.alertService.error(this.title, this.message, this.buttonLabel);

            expect(this.getResolve('alertClass')).toEqual('is-error');
        });

        it('should pass title', function() {
            this.alertService.error(this.title, this.message, this.buttonLabel);

            expect(this.getResolve('title')).toEqual(this.title);
        });

        it('should pass message', function() {
            this.alertService.error(this.title, this.message, this.buttonLabel);

            expect(this.getResolve('message')).toEqual(this.message);
        });

        it('should pass label', function() {
            this.alertService.error(this.title, this.message, this.buttonLabel);

            expect(this.getResolve('buttonLabel')).toEqual(this.buttonLabel);
        });

        it('should default button message to openlmisModal.close', function() {
            this.alertService.error(this.title, this.message);

            expect(this.getResolve('buttonLabel')).toEqual('openlmisModal.close');
        });

        it('should reject if previous alert is open', function() {
            this.alertService.error(this.title, this.message, this.buttonLabel);

            var rejected;
            this.alertService.error(this.title, this.message, this.buttonLabel)
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toEqual(true);

            this.modalDeferred.resolve();
            this.$rootScope.$apply();

            rejected = undefined;
            this.alertService.error(this.title, this.message, this.buttonLabel)
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBeUndefined();
        });

    });

    describe('success', function() {

        beforeEach(function() {
            this.title = 'Success Title';
            this.message = 'Success Message';
            this.buttonLabel = 'Success Label';
        });

        it('should pass is-success as class', function() {
            this.alertService.success(this.title, this.message, this.buttonLabel);

            expect(this.getResolve('alertClass')).toEqual('is-success');
        });

        it('should pass title', function() {
            this.alertService.success(this.title, this.message, this.buttonLabel);

            expect(this.getResolve('title')).toEqual(this.title);
        });

        it('should pass message', function() {
            this.alertService.success(this.title, this.message, this.buttonLabel);

            expect(this.getResolve('message')).toEqual(this.message);
        });

        it('should pass label', function() {
            this.alertService.success(this.title, this.message, this.buttonLabel);

            expect(this.getResolve('buttonLabel')).toEqual(this.buttonLabel);
        });

        it('should default button message to openlmisModal.close', function() {
            this.alertService.success(this.title, this.message);

            expect(this.getResolve('buttonLabel')).toEqual('openlmisModal.close');
        });

        it('should reject if previous alert is open', function() {
            this.alertService.success(this.title, this.message, this.buttonLabel);

            var rejected;
            this.alertService.success(this.title, this.message, this.buttonLabel)
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toEqual(true);

            this.modalDeferred.resolve();
            this.$rootScope.$apply();

            rejected = undefined;
            this.alertService.success(this.title, this.message, this.buttonLabel)
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBeUndefined();
        });

    });

    describe('info', function() {

        beforeEach(function() {
            this.title = 'Info Title';
            this.message = 'Info Message';
            this.buttonLabel = 'Info Label';
        });

        it('should pass is-info as class', function() {
            this.alertService.info({
                title: this.title,
                message: this.message,
                buttonLabel: this.buttonLabel
            });

            expect(this.getResolve('alertClass')).toEqual('is-info');
        });

        it('should pass title', function() {
            this.alertService.info({
                title: this.title,
                message: this.message,
                buttonLabel: this.buttonLabel
            });

            expect(this.getResolve('title')).toEqual(this.title);
        });

        it('should pass message', function() {
            this.alertService.info({
                title: this.title,
                message: this.message,
                buttonLabel: this.buttonLabel
            });

            expect(this.getResolve('message')).toEqual(this.message);
        });

        it('should pass label', function() {
            this.alertService.info({
                title: this.title,
                message: this.message,
                buttonLabel: this.buttonLabel
            });

            expect(this.getResolve('buttonLabel')).toEqual(this.buttonLabel);
        });

        it('should default button message to openlmisModal.close', function() {
            this.alertService.info({
                title: this.title,
                message: this.message
            });

            expect(this.getResolve('buttonLabel')).toEqual('openlmisModal.close');
        });

        it('should reject if previous alert is open', function() {
            this.alertService.info({
                title: this.title,
                message: this.message,
                buttonLabel: this.buttonLabel
            });

            var rejected;
            this.alertService.info({
                title: this.title,
                message: this.message,
                buttonLabel: this.buttonLabel
            })
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toEqual(true);

            this.modalDeferred.resolve();
            this.$rootScope.$apply();

            rejected = undefined;
            this.alertService.info({
                title: this.title,
                message: this.message,
                buttonLabel: this.buttonLabel
            })
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBeUndefined();
        });

        describe('offline', function() {

            beforeEach(function() {
                this.title = 'Offline Title';
                this.message = 'Offline Message';
                this.buttonLabel = 'Offline Label';
            });

            it('should pass is-offline as class', function() {
                this.alertService.offline(this.title, this.message, this.buttonLabel);

                expect(this.getResolve('alertClass')).toEqual('is-offline');
            });

            it('should pass title', function() {
                this.alertService.offline(this.title, this.message, this.buttonLabel);

                expect(this.getResolve('title')).toEqual(this.title);
            });

            it('should pass message', function() {
                this.alertService.offline(this.title, this.message, this.buttonLabel);

                expect(this.getResolve('message')).toEqual(this.message);
            });

            it('should pass label', function() {
                this.alertService.offline(this.title, this.message, this.buttonLabel);

                expect(this.getResolve('buttonLabel')).toEqual(this.buttonLabel);
            });

            it('should default button message to openlmisModal.close', function() {
                this.alertService.offline(this.title, this.message);

                expect(this.getResolve('buttonLabel')).toEqual('openlmisModal.close');
            });

            it('should reject if previous alert is open', function() {
                this.alertService.offline(this.title, this.message, this.buttonLabel);

                var rejected;
                this.alertService.offline(this.title, this.message, this.buttonLabel)
                    .catch(function() {
                        rejected = true;
                    });
                this.$rootScope.$apply();

                expect(rejected).toEqual(true);

                this.modalDeferred.resolve();
                this.$rootScope.$apply();

                rejected = undefined;
                this.alertService.offline(this.title, this.message, this.buttonLabel)
                    .catch(function() {
                        rejected = true;
                    });
                this.$rootScope.$apply();

                expect(rejected).toBeUndefined();
            });

        });

    });

    describe('close', function() {

        it('should hide the current modal if one is open', function() {
            this.alertService.error('Error Title', 'Error Message');

            this.alertService.close();

            expect(this.modalMock.hide).toHaveBeenCalled();
        });

        it('should be a no-op when no modal is open', function() {
            expect(function() {
                this.alertService.close();
            }.bind(this)).not.toThrow();

            expect(this.modalMock.hide).not.toHaveBeenCalled();
        });

        it('should be a no-op after the modal has been closed', function() {
            this.alertService.error('Error Title', 'Error Message');
            this.modalDeferred.resolve();
            this.$rootScope.$apply();

            this.alertService.close();

            expect(this.modalMock.hide).not.toHaveBeenCalled();
        });

    });

    function getResolve(name) {
        return this.openlmisModalService.createDialog.mostRecentCall.args[0].resolve[name]();
    }

});
