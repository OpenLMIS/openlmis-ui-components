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

(function() {
    'use strict';

    /**
     * @ngdoc controller
     * @name requisition-view.RequisitionViewController
     *
     * @description
     * Controller for managing requisitions.
     */

    angular
        .module('requisition-view')
        .controller('RequisitionViewController', RequisitionViewController);

    RequisitionViewController.$inject = [
        '$state', 'requisition', 'requisitionValidator', 'authorizationService',
        'loadingModalService', 'notificationService', 'confirmService', 'REQUISITION_RIGHTS',
        'FULFILLMENT_RIGHTS', 'convertToOrderModalService', 'offlineService', 'localStorageFactory',
        'requisitionUrlFactory', '$filter', '$scope', '$timeout', 'RequisitionWatcher'
    ];

    function RequisitionViewController($state, requisition, requisitionValidator, authorizationService,
                             loadingModalService, notificationService, confirmService,
                             REQUISITION_RIGHTS, FULFILLMENT_RIGHTS , convertToOrderModalService, offlineService,
                             localStorageFactory, requisitionUrlFactory, $filter, $scope,
                             $timeout, RequisitionWatcher) {

        var vm = this,
            watcher = new RequisitionWatcher($scope, requisition);

        /**
         * @ngdoc property
         * @name requisition
         * @propertyOf requisition-view.RequisitionViewController
         * @type {Object}
         *
         * @description
         * Holds requisition.
         */
        vm.requisition = requisition;

        /**
        * @ngdoc property
        * @name requisitionType
        * @propertyOf requisition-view.RequisitionViewController
        * @type {String}
        *
        * @description
        * Holds message key to display, depending on the requisition type (regular/emergency).
        */
        vm.requisitionType = vm.requisition.emergency ? 'label.emergency' : 'msg.regular';

        // Functions

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
        vm.displaySync = displaySync;
        vm.isOffline = offlineService.isOffline;
        vm.getPrintUrl = getPrintUrl;
        vm.isFullSupplyTabValid = isFullSupplyTabValid;
        vm.isNonFullSupplyTabValid = isNonFullSupplyTabValid;

         /**
         * @ngdoc method
         * @name syncRnr
         * @methodOf requisition-view.RequisitionViewController
         *
         * @description
         * Responsible for syncing requisition with the server. If the requisition fails to sync,
         * an error notification will be displayed. Otherwise, a success notification will be shown.
         * If the error status is 409 (conflict), the requisition will be reloaded, since this
         * indicates a version conflict.
         */
        function syncRnr() {
            watcher.makeSilent();
            var loadingPromise = loadingModalService.open();
            vm.requisition.$modified = false;
            save().then(function() {
                loadingPromise.then(function() {
                    notificationService.success('msg.requisitionSynced');
                });
                reloadState();
            }, function(response) {
               if (response.status === 409) {
                    // in case of conflict, use the server version
                    notificationService.error('msg.requisitionVersionError');
                    var offlineRequisitions = localStorageFactory('requisitions');
                    offlineRequisitions.removeBy('id', requisition.id);
                    reloadState();
               } else {
                    failWithMessage('msg.failedToSyncRequisition')();
               }
            });
        }

        /**
         * @ngdoc method
         * @name submitRnr
         * @methodOf requisition-view.RequisitionViewController
         *
         * @description
         * Responsible for submitting requisition. Displays confirmation dialog, and checks
         * requisition validity before submission. If the requisition is not valid, fails to save or
         * an error occurs during submission, an error notification modal will be displayed.
         * Otherwise, a success notification modal will be shown.
         */
        function submitRnr() {
            watcher.makeSilent();
            confirmService.confirm('msg.question.confirmation.submit', 'button.submit').then(function() {
                if (requisitionValidator.validateRequisition(requisition)) {
                    var loadingPromise = loadingModalService.open();
                    vm.requisition.$save().then(function() {
                        vm.requisition.$submit().then(function(response) {
                            loadingPromise.then(function() {
                                notificationService.success('msg.requisitionSubmitted');
                            });
                            reloadState();
                        }, failWithMessage('msg.failedToSubmitRequisition'));
                    }, failWithMessage('msg.failedToSyncRequisition'));
                } else {
                    failWithMessage('error.rnr.validation')();
                }
            }, function() {
                watcher.makeLoud();
            });
        }

        /**
         * @ngdoc method
         * @name authorizeRnr
         * @methodOf requisition-view.RequisitionViewController
         *
         * @description
         * Responsible for authorizing requisition. Displays confirmation dialog, and checks
         * requisition validity before authorization. If the requisition is not valid, fails to
         * save or an error occurs during authorization, an error notification modal will be
         * displayed.
         * Otherwise, a success notification modal will be shown.
         */
        function authorizeRnr() {
            watcher.makeSilent();
            confirmService.confirm('msg.question.confirmation.authorize', 'button.authorize').then(function() {
                if (requisitionValidator.validateRequisition(requisition)) {
                    var loadingPromise = loadingModalService.open();
                    vm.requisition.$save().then(function() {
                        vm.requisition.$authorize().then(function(response) {
                            loadingPromise.then(function() {
                                notificationService.success('msg.requisitionAuthorized');
                            });
                            reloadState();
                        }, failWithMessage('msg.failedToAuthorizeRequisition'));
                    }, failWithMessage('msg.failedToSyncRequisition'));
                } else {
                    failWithMessage('error.rnr.validation');
                }
            }, function() {
                watcher.makeLoud();
            });
        }

        /**
         * @ngdoc method
         * @name removeRnr
         * @methodOf requisition-view.RequisitionViewController
         *
         * @description
         * Responsible for removing requisition. Displays confirmation dialog before deletion.
         * If an error occurs during authorization, it will display an error notification modal.
         * Otherwise, a success notification modal will be shown.
         */
        function removeRnr() {
            watcher.makeSilent();
            confirmService.confirmDestroy('msg.question.confirmation.deletion', 'button.delete').then(function() {
                var loadingPromise = loadingModalService.open();
                vm.requisition.$remove().then(function(response) {
                    loadingPromise.then(function() {
                        notificationService.success('msg.requisitionDeleted');
                    });
                    $state.go('requisitions.initRnr');
                }, failWithMessage('failedToDeleteRequisition'));
            }, function() {
                watcher.makeLoud();
            });
        }

        /**
         * @ngdoc method
         * @name approveRnr
         * @methodOf requisition-view.RequisitionViewController
         *
         * @description
         * Responsible for approving requisition. Displays confirmation dialog, and checks
         * requisition validity before approval. If the requisition is not valid or it fails to
         * save, an error notification modal will be displayed.
         * Otherwise, a success notification modal will be shown.
         */
        function approveRnr() {
            watcher.makeSilent();
            confirmService.confirm('msg.question.confirmation.approve', 'button.approve').then(function() {
                if(requisitionValidator.validateRequisition(requisition)) {
                    var loadingPromise = loadingModalService.open();
                    vm.requisition.$save().then(function() {
                        vm.requisition.$approve().then(function(response) {
                            loadingPromise.then(function() {
                                notificationService.success('msg.requisitionApproved');
                            });
                            $state.go('requisitions.approvalList');
                        }, failWithMessage('msg.failedToApproveRequisition'));
                    }, failWithMessage('msg.failedToSyncRequisition'));
                } else {
                    failWithMessage('error.rnr.validation');
                }
            }, function() {
                watcher.makeLoud();
            });
        }

        /**
         * @ngdoc method
         * @name rejectRnr
         * @methodOf requisition-view.RequisitionViewController
         *
         * @description
         * Responsible for rejecting requisition. Displays confirmation dialog before rejection.
         * If an error occurs during rejecting it will display an error notification modal.
         * Otherwise, a success notification modal will be shown.
         */
        function rejectRnr() {
            watcher.makeSilent();
            confirmService.confirmDestroy('msg.question.confirmation.reject', 'button.rnr.reject').then(function() {
                var loadingPromise = loadingModalService.open();
                vm.requisition.$reject().then(function(response) {
                    loadingPromise.then(function() {
                        notificationService.success('msg.requisitionRejected');
                    });
                    $state.go('requisitions.approvalList');
                }, failWithMessage('msg.failedToRejectRequisition'));
            }, function() {
                watcher.makeLoud();
            });
        }

        /**
         * @ngdoc method
         * @name skipRnr
         * @methodOf requisition-view.RequisitionViewController
         *
         * @description
         * Responsible for skipping requisition. Displays confirmation dialog before skipping.
         * If an error occurs during skipping it will display an error notification modal.
         * Otherwise, a success notification modal will be shown.
         */
        function skipRnr() {
            watcher.makeSilent();
            confirmService.confirm('msg.question.confirmation.skip', 'button.skipRequisition').then(function() {
                var loadingPromise = loadingModalService.open();
                vm.requisition.$skip().then(function(response) {
                    loadingPromise.then(function() {
                        notificationService.success('msg.requisitionSkipped');
                    });
                    $state.go('requisitions.initRnr');
                }, failWithMessage('msg.failedToSkipRequisition'));
            }, function() {
                watcher.makeLoud();
            });
        }

        /**
         * @ngdoc method
         * @name periodDisplayName
         * @methodOf requisition-view.RequisitionViewController
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
        }

        /**
         * @ngdoc method
         * @name displayAuthorize
         * @methodOf requisition-view.RequisitionViewController
         *
         * @description
         * Determines whether to display authorize button or not. Returns true only if requisition
         * is submitted and user has permission to authorize requisition.
         *
         * @return {boolean} should authorize button be displayed
         */
        function displayAuthorize() {
            var hasRight = authorizationService.hasRight(REQUISITION_RIGHTS.REQUISITION_AUTHORIZE, {
                programCode: vm.requisition.program.code
            });
            return vm.requisition.$isSubmitted() && hasRight;
        }

        /**
         * @ngdoc method
         * @name displaySubmit
         * @methodOf requisition-view.RequisitionViewController
         *
         * @description
         * Determines whether to display submit button or not. Returns true only if requisition
         * is initiated and user has permission to create requisition.
         *
         * @return {boolean} should submit button be displayed
         */
        function displaySubmit() {
            var hasRight = authorizationService.hasRight(REQUISITION_RIGHTS.REQUISITION_CREATE, {
                programCode: vm.requisition.program.code
            });
            return vm.requisition.$isInitiated() && hasRight;
        }

        /**
         * @ngdoc method
         * @name displayApproveAndReject
         * @methodOf requisition-view.RequisitionViewController
         *
         * @description
         * Determines whether to display approve and reject buttons or not. Returns true only if
         * requisition is authorized or in approval and user has permission to approve requisition.
         *
         * @return {boolean} should approve and reject buttons be displayed
         */
        function displayApproveAndReject() {
            var hasRight = authorizationService.hasRight(REQUISITION_RIGHTS.REQUISITION_APPROVE, {
                programCode: vm.requisition.program.code
            });
            return (vm.requisition.$isAuthorized() || vm.requisition.$isInApproval()) && hasRight;
        }

        /**
         * @ngdoc method
         * @name displayDelete
         * @methodOf requisition-view.RequisitionViewController
         *
         * @description
         * Determines whether to display delete button or not. Returns true only if requisition
         * is initiated and user has permission to delete requisition.
         *
         * @return {boolean} should delete button be displayed
         */
        function displayDelete() {
            var hasRight = authorizationService.hasRight(REQUISITION_RIGHTS.REQUISITION_DELETE, {
                programCode: vm.requisition.program.code
            });
            return (vm.requisition.$isInitiated() || vm.requisition.$isSubmitted()) && hasRight;
        }

        /**
         * @ngdoc method
         * @name displayConvertToOrder
         * @methodOf requisition-view.RequisitionViewController
         *
         * @description
         * Determines whether to display convert to order button or not. Returns true only if
         * requisition is approved and user has permission to convert requisition.
         *
         * @return {boolean} should convert to order button be displayed
         */
        function displayConvertToOrder() {
            var hasRight = authorizationService.hasRight(FULFILLMENT_RIGHTS.ORDERS_EDIT, {
                programCode: vm.requisition.program.code
            });
            return vm.requisition.$isApproved() && hasRight;
        }

        /**
         * @ngdoc method
         * @name displaySkip
         * @methodOf requisition-view.RequisitionViewController
         *
         * @description
         * Determines whether to display skip requisition button or not. Returns true only if
         * requisition program allows to skip requisition.
         *
         * @return {boolean} true if skip button should be visible, false otherwise
         */
        function displaySkip() {
            return vm.requisition.$isInitiated() &&
                vm.requisition.program.periodsSkippable &&
                !vm.requisition.emergency;
        }

        /**
         * @ngdoc method
         * @name displaySync
         * @methodOf requisition-view.RequisitionViewController
         *
         * @description
         * Determines whether to display sync with server button or not. Returns true only if
         * requisition has status INITIATED, SUBMITTED or AUTHORIZED.
         *
         * @return {boolean} true if sync button should be visible, false otherwise
         */
        function displaySync() {
            return vm.requisition.$isInitiated() || vm.requisition.$isSubmitted() || vm.requisition.$isAuthorized();
        }

        /**
         * @ngdoc method
         * @name convertRnr
         * @methodOf requisition-view.RequisitionViewController
         *
         * @description
         * Displays convert to order modal.
         */
        function convertRnr() {
            convertToOrderModalService.show(vm.requisition);
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.RequisitionViewController
         * @name getPrintUrl
         *
         * @description
         * Prepares a print URL for the given requisition.
         *
         * @return {String} the prepared URL
         */
        function getPrintUrl() {
            return requisitionUrlFactory('/api/requisitions/' + vm.requisition.id + '/print');
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.RequisitionViewController
         * @name isFullSupplyTabValid
         *
         * @description
         * Checks whether full supply tab has any errors. This method ignores skipped line items and
         * does not trigger validation.
         *
         * @return  {Boolean}   true if full supply tab has any errors, false otherwise
         */
        function isFullSupplyTabValid() {
            var fullSupplyItems = $filter('filter')(vm.requisition.requisitionLineItems, {
                $program: {
                    fullSupply: true
                }
            }, true);
            return requisitionValidator.areLineItemsValid(fullSupplyItems);
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.RequisitionViewController
         * @name isNonFullSupplyTabValid
         *
         * @description
         * Checks whether non full supply tab has any errors. This method ignores skipped line items
         * and does not trigger validation.
         *
         * @return  {Boolean}   true if non full supply tab has any errors, false otherwise
         */
        function isNonFullSupplyTabValid() {
            var nonFullSupplyItems = $filter('filter')(vm.requisition.requisitionLineItems, {
                $program: {
                    fullSupply: false
                }
            }, true);
            return requisitionValidator.areLineItemsValid(nonFullSupplyItems);
        }

        function save() {
            loadingModalService.open();
            var promise = vm.requisition.$save();
            promise.finally(loadingModalService.close)
            return promise;
        }

        function reloadState() {
            $state.reload();
        }

        function failWithMessage(message) {
            return function() {
                notificationService.error(message);
                loadingModalService.close();
                watcher.makeLoud();
            };
        }

    }
})();
