/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */
(function() {
    'use strict';

    /**
     * @ngdoc controller
     * @name requisition-view.RequisitionCtrl
     *
     * @description
     * Controller for managing requisitions.
     */

    angular
        .module('requisition-view')
        .controller('RequisitionCtrl', RequisitionCtrl);

    RequisitionCtrl.$inject = ['$state', 'requisition', 'requisitionValidator',
                               'AuthorizationService', 'loadingModalService',
                               'Notification', 'confirmService', 'RequisitionRights',
                               'ConvertToOrderModal', 'OfflineService', 'localStorageFactory'];

    function RequisitionCtrl($state, requisition, requisitionValidator,
                             AuthorizationService, loadingModalService,
                             Notification, confirmService, RequisitionRights,
                             ConvertToOrderModal, OfflineService, localStorageFactory) {

        var vm = this,
            onlineOnly = localStorageFactory('onlineOnly'),
            offlineRequitions = localStorageFactory('requisitions');

        /**
         * @ngdoc property
         * @name requisition
         * @propertyOf requisition-view.RequisitionCtrl
         * @type {Object}
         *
         * @description
         * Holds requisition.
         */
        vm.requisition = requisition;

        /**
        * @ngdoc property
        * @name requisitionType
        * @propertyOf requisition-view.RequisitionCtrl
        * @type {String}
        *
        * @description
        * Holds message key to display, depending on the requisition type (regular/emergency).
        */
        vm.requisitionType = vm.requisition.emergency ? 'requisition.type.emergency' : 'requisition.type.regular';

        // Functions

        vm.saveRnr = saveRnr;
        vm.syncRnr = syncRnr;
        vm.submitRnr = submitRnr;
        vm.authorizeRnr = authorizeRnr;
        vm.removeRnr = removeRnr;
        vm.convertRnr = convertRnr;
        vm.approveRnr = approveRnr;
        vm.rejectRnr = rejectRnr;
        vm.skipRnr = skipRnr;
        vm.periodDisplayName = periodDisplayName;
        vm.displaySubmit = displaySubmit;
        vm.displayAuthorize = displayAuthorize;
        vm.displayDelete = displayDelete;
        vm.displayApproveAndReject = displayApproveAndReject;
        vm.displayConvertToOrder = displayConvertToOrder;
        vm.displaySkip = displaySkip;
        vm.changeAvailablity = changeAvailablity;
        vm.isOffline = OfflineService.isOffline;

        function saveRnr() {
            vm.requisition.$modified = true;
            offlineRequitions.put(vm.requisition);
            Notification.success('msg.rnr.save.success');
        }

         /**
         * @ngdoc function
         * @name syncRnr
         * @methodOf requisition-view.RequisitionCtrl
         *
         * @description
         * Responsible for syncing requisition with the server. If the requisition fails to sync,
         * an error notification will be displayed. Otherwise, a success notification will be shown.
         */
        function syncRnr() {
            loadingModalService.open();
            vm.requisition.$modified = false;
            offlineRequitions.put(vm.requisition);
            save().then(function(response) {
                loadingModalService.close();
                Notification.success('msg.rnr.sync.success');
                reloadState();
            });
        };

        /**
         * @ngdoc function
         * @name submitRnr
         * @methodOf requisition-view.RequisitionCtrl
         *
         * @description
         * Responsible for submitting requisition. Displays confirmation dialog, and checks
         * requisition validity before submission. If the requisition is not valid, fails to save or
         * an error occurs during submission, an error notification modal will be displayed.
         * Otherwise, a success notification modal will be shown.
         */
        function submitRnr() {
            confirmService.confirm('msg.question.confirmation.submit').then(function() {
                if (requisitionValidator.validateRequisition(requisition)) {
                    save().then(function() {
                        loadingModalService.open();
                        vm.requisition.$submit()
                        .then(function(response) {
                            Notification.success('msg.rnr.submitted.success');
                            reloadState();
                        })
                        .catch(function(response) {
                            Notification.error('msg.rnr.submitted.failure');
                        })
                        .finally(loadingModalService.close);
                    });
                } else {
                    Notification.error('error.rnr.validation');
                }
            });
        };

        /**
         * @ngdoc function
         * @name authorizeRnr
         * @methodOf requisition-view.RequisitionCtrl
         *
         * @description
         * Responsible for authorizing requisition. Displays confirmation dialog, and checks
         * requisition validity before authorization. If the requisition is not valid, fails to
         * save or an error occurs during authorization, an error notification modal will be
         * displayed.
         * Otherwise, a success notification modal will be shown.
         */
        function authorizeRnr() {
            confirmService.confirm('msg.question.confirmation.authorize').then(function() {
                if (requisitionValidator.validateRequisition(requisition)) {
                    save().then(function() {
                        loadingModalService.open();
                        vm.requisition.$authorize()
                        .then(function(response) {
                            Notification.success('msg.rnr.authorized.success');
                            reloadState();
                        })
                        .catch(function(response) {
                            Notification.error('msg.rnr.authorized.failure');
                        })
                        .finally(loadingModalService.close);
                    });
                } else {
                    Notification.error('error.rnr.validation');
                }
            });
        };

        /**
         * @ngdoc function
         * @name removeRnr
         * @methodOf requisition-view.RequisitionCtrl
         *
         * @description
         * Responsible for removing requisition. Displays confirmation dialog before deletion.
         * If an error occurs during authorization, it will display an error notification modal.
         * Otherwise, a success notification modal will be shown.
         */
        function removeRnr() {
            confirmService.confirmDestroy('msg.question.confirmation.deletion').then(function() {
                loadingModalService.open();
                vm.requisition.$remove()
                .then(function(response) {
                    $state.go('requisitions.initRnr');
                    Notification.success('msg.rnr.deletion.success');
                })
                .catch(function(response) {
                    Notification.error('msg.rnr.deletion.failure');
                })
                .finally(loadingModalService.close);
            });
        };

        /**
         * @ngdoc function
         * @name approveRnr
         * @methodOf requisition-view.RequisitionCtrl
         *
         * @description
         * Responsible for approving requisition. Displays confirmation dialog, and checks
         * requisition validity before approval. If the requisition is not valid or it fails to
         * save, an error notification modal will be displayed.
         * Otherwise, a success notification modal will be shown.
         */
        function approveRnr() {
            confirmService.confirm('msg.question.confirmation').then(function() {
                if(requisitionValidator.validateRequisition(requisition)) {
                    save()
                    .then(function() {
                        loadingModalService.open();
                        vm.requisition.$approve()
                        .then(function(response) {
                            $state.go('requisitions.approvalList');
                            Notification.success('msg.rnr.approved.success');
                        })
                        .finally(loadingModalService.close);
                    });
                } else {
                    Notification.error('error.rnr.validation');
                }
             });
        };

        /**
         * @ngdoc function
         * @name rejectRnr
         * @methodOf requisition-view.RequisitionCtrl
         *
         * @description
         * Responsible for rejecting requisition. Displays confirmation dialog before rejection.
         * If an error occurs during rejecting it will display an error notification modal.
         * Otherwise, a success notification modal will be shown.
         */
        function rejectRnr() {
            confirmService.confirm('msg.question.confirmation').then(function() {
                loadingModalService.open();
                vm.requisition.$reject()
                .then(function(response) {
                    $state.go('requisitions.approvalList');
                    Notification.success('msg.rnr.reject.success');
                })
                .catch(function(response) {
                    Notification.error('msg.rejected.failure');
                })
                .finally(loadingModalService.close);
            });
        };

        /**
         * @ngdoc function
         * @name skipRnr
         * @methodOf requisition-view.RequisitionCtrl
         *
         * @description
         * Responsible for skipping requisition. Displays confirmation dialog before skipping.
         * If an error occurs during skipping it will display an error notification modal.
         * Otherwise, a success notification modal will be shown.
         */
        function skipRnr() {
            confirmService('msg.question.confirmation.skip').then(function() {
                loadingModalService.open();
                vm.requisition.$skip()
                .then(function(response) {
                    $state.go('requisitions.initRnr');
                    Notification.success('msg.rnr.skip.success');
                })
                .catch(function() {
                    Notification.error('msg.rnr.skip.failure');
                })
                .finally(loadingModalService.close);
            });
        };

        /**
         * @ngdoc function
         * @name periodDisplayName
         * @methodOf requisition-view.RequisitionCtrl
         *
         * @description
         * Creates human readable duration of reporting period.
         *
         * @returns {string} Reporting period.
         *
         */
        function periodDisplayName() {
            //TODO: This is a temporary solution.
            return vm.requisition.processingPeriod.startDate.slice(0,3).join('/') + ' - ' + vm.requisition.processingPeriod.endDate.slice(0,3).join('/');
        };

        /**
         * @ngdoc function
         * @name displayAuthorize
         * @methodOf requisition-view.RequisitionCtrl
         *
         * @description
         * Determines whether to display authorize button or not. Returns true only if requisition
         * is submitted and user has permission to authorize requisition.
         *
         * @return {boolean} should authorize button be displayed
         */
        function displayAuthorize() {
            var hasRight = authorizationService.hasRight(RequisitionRights.REQUISITION_AUTHORIZE, {
                programCode: vm.requisition.program.code
            });
            return vm.requisition.$isSubmitted() && hasRight;
        };

        /**
         * @ngdoc function
         * @name displaySubmit
         * @methodOf requisition-view.RequisitionCtrl
         *
         * @description
         * Determines whether to display submit button or not. Returns true only if requisition
         * is initiated and user has permission to create requisition.
         *
         * @return {boolean} should submit button be displayed
         */
        function displaySubmit() {
            var hasRight = authorizationService.hasRight(RequisitionRights.REQUISITION_CREATE, {
                programCode: vm.requisition.program.code
            });
            return vm.requisition.$isInitiated() && hasRight;
        };

        /**
         * @ngdoc function
         * @name displayApproveAndReject
         * @methodOf requisition-view.RequisitionCtrl
         *
         * @description
         * Determines whether to display approve and reject buttons or not. Returns true only if
         * requisition is authorized and user has permission to approve requisition.
         *
         * @return {boolean} should approve and reject buttons be displayed
         */
        function displayApproveAndReject() {
            var hasRight = authorizationService.hasRight(RequisitionRights.REQUISITION_APPROVE, {
                programCode: vm.requisition.program.code
            });
            return vm.requisition.$isAuthorized() && hasRight;
        };

        /**
         * @ngdoc function
         * @name displayDelete
         * @methodOf requisition-view.RequisitionCtrl
         *
         * @description
         * Determines whether to display delete button or not. Returns true only if requisition
         * is initiated and user has permission to delete requisition.
         *
         * @return {boolean} should delete button be displayed
         */
        function displayDelete() {
            var hasRight = authorizationService.hasRight(RequisitionRights.REQUISITION_DELETE, {
                programCode: vm.requisition.program.code
            });
            return vm.requisition.$isInitiated() && hasRight;
        };

        /**
         * @ngdoc function
         * @name displayConvertToOrder
         * @methodOf requisition-view.RequisitionCtrl
         *
         * @description
         * Determines whether to display convert to order button or not. Returns true only if
         * requisition is approved and user has permission to convert requisition.
         *
         * @return {boolean} should convert to order button be displayed
         */
        function displayConvertToOrder() {
            var hasRight = authorizationService.hasRight(RequisitionRights.CONVERT_TO_ORDER, {
                programCode: vm.requisition.program.code
            });
            return vm.requisition.$isApproved() && hasRight;
        };

        /**
         * @ngdoc function
         * @name displayConvertToOrder
         * @methodOf requisition-view.RequisitionCtrl
         *
         * @description
         * Determines whether to display skip requisition button or not. Returns true only if
         * requisition program allows to skip requisition.
         *
         * @return {boolean} should skip requisition button be displayed
         */
        function displaySkip() {
            return vm.requisition.$isInitiated() && vm.requisition.program.periodsSkippable;
        };

        /**
         * @ngdoc function
         * @name convertRnr
         * @methodOf requisition-view.RequisitionCtrl
         *
         * @description
         * Displays convert to order modal.
         */
        function convertRnr() {
            ConvertToOrderModal.show(vm.requisition);
        };

        function changeAvailablity(requisition) {
            if (!requisition.$availableOffline) {
                onlineOnly.remove(requisition.id);
                offlineRequitions.put(requisition);
                requisition.$availableOffline = true;
            } else {
                confirmService.confirm('msg.question.confirmation.makeOnlineOnly').then(function() {
                    onlineOnly.put(requisition.id);
                    offlineRequitions.removeBy('id', requisition.id);
                    requisition.$availableOffline = false;
                }, function() {
                    requisition.$availableOffline = true;
                });
            }
        }

        function save() {
            loadingModalService.open();
            var promise = vm.requisition.$save();
            promise.catch(failedToSave);
            promise.finally(loadingModalService.close)
            return promise;
        }

        function failedToSave() {
            Notification.error('msg.rnr.save.failure');
        }

        function reloadState() {
            $state.reload();
        }

    }
})();
