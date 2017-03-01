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
     * @name requisition-view.controller:RequisitionViewController
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
        'FULFILLMENT_RIGHTS', 'convertToOrderModalService', 'offlineService',
        'requisitionUrlFactory', '$filter', '$scope', '$timeout', 'RequisitionWatcher'
    ];

    function RequisitionViewController($state, requisition, requisitionValidator, authorizationService,
                             loadingModalService, notificationService, confirmService,
                             REQUISITION_RIGHTS, FULFILLMENT_RIGHTS , convertToOrderModalService, offlineService,
                             requisitionUrlFactory, $filter, $scope, $timeout, RequisitionWatcher) {

        var vm = this,
            watcher = new RequisitionWatcher($scope, requisition);

        /**
         * @ngdoc property
         * @propertyOf requisition-view.controller:RequisitionViewController
         * @name requisition
         * @type {Object}
         *
         * @description
         * Holds requisition.
         */
        vm.requisition = requisition;

        /**
        * @ngdoc property
        * @propertyOf requisition-view.controller:RequisitionViewController
        * @name requisitionType
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
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name syncRnr
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
              handleSaveError(response.status);
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name submitRnr
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
                    if (!requisitionValidator.areAllLineItemsSkipped(requisition.requisitionLineItems)) {
                        vm.requisition.$save().then(function () {
                            vm.requisition.$submit().then(function (response) {
                                loadingPromise.then(function () {
                                    notificationService.success('msg.requisitionSubmitted');
                                });
                                reloadState();
                            }, failWithMessage('msg.failedToSubmitRequisition'));
                        }, function(response) {
                          handleSaveError(response.status);
                        });
                    } else {
                        failWithMessage('error.rnr.validation.submit.allLineItemsSkipped')();
                    }
                } else {
                    failWithMessage('error.rnr.validation')();
                }
            }, function() {
                watcher.makeLoud();
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name authorizeRnr
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
                    if (!requisitionValidator.areAllLineItemsSkipped(requisition.requisitionLineItems)) {
                        vm.requisition.$save().then(function () {
                            vm.requisition.$authorize().then(function (response) {
                                loadingPromise.then(function () {
                                    notificationService.success('msg.requisitionAuthorized');
                                });
                                reloadState();
                            }, failWithMessage('msg.failedToAuthorizeRequisition'));
                        }, function(response) {
                          handleSaveError(response.status);
                        });
                    } else {
                        failWithMessage('error.rnr.validation.authorize.allLineItemsSkipped');
                    }
                } else {
                    failWithMessage('error.rnr.validation');
                }
            }, function() {
                watcher.makeLoud();
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name removeRnr
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
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name approveRnr
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
                        }, function(response) {
                          handleSaveError(response.status);
                        });
                } else {
                    failWithMessage('error.rnr.validation');
                }
            }, function() {
                watcher.makeLoud();
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name rejectRnr
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
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name skipRnr
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
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name periodDisplayName
         *
         * @description
         * Creates human readable duration of reporting period.
         *
         * @return {String} Reporting period
         */
        function periodDisplayName() {
            //TODO: This is a temporary solution.
            return vm.requisition.processingPeriod.startDate.slice(0,3).join('/') + ' - ' + vm.requisition.processingPeriod.endDate.slice(0,3).join('/');
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name displayAuthorize
         *
         * @description
         * Determines whether to display authorize button or not. Returns true only if requisition
         * is submitted and user has permission to authorize requisition.
         *
         * @return {Boolean} should authorize button be displayed
         */
        function displayAuthorize() {
            var hasRight = authorizationService.hasRight(REQUISITION_RIGHTS.REQUISITION_AUTHORIZE, {
                programCode: vm.requisition.program.code
            });
            return vm.requisition.$isSubmitted() && hasRight;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name displaySubmit
         *
         * @description
         * Determines whether to display submit button or not. Returns true only if requisition
         * is initiated and user has permission to create requisition.
         *
         * @return {Boolean} should submit button be displayed
         */
        function displaySubmit() {
            var hasRight = authorizationService.hasRight(REQUISITION_RIGHTS.REQUISITION_CREATE, {
                programCode: vm.requisition.program.code
            });
            return vm.requisition.$isInitiated() && hasRight;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name displayApproveAndReject
         *
         * @description
         * Determines whether to display approve and reject buttons or not. Returns true only if
         * requisition is authorized or in approval and user has permission to approve requisition.
         *
         * @return {Boolean} should approve and reject buttons be displayed
         */
        function displayApproveAndReject() {
            var hasRight = authorizationService.hasRight(REQUISITION_RIGHTS.REQUISITION_APPROVE, {
                programCode: vm.requisition.program.code
            });
            return (vm.requisition.$isAuthorized() || vm.requisition.$isInApproval()) && hasRight;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name displayDelete
         *
         * @description
         * Determines whether to display delete button or not. Returns true only if requisition
         * is initiated and user has permission to delete requisition.
         *
         * @return {Boolean} should delete button be displayed
         */
        function displayDelete() {
            var hasRight = authorizationService.hasRight(REQUISITION_RIGHTS.REQUISITION_DELETE, {
                programCode: vm.requisition.program.code
            });
            return (vm.requisition.$isInitiated() || vm.requisition.$isSubmitted()) && hasRight;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name displayConvertToOrder
         *
         * @description
         * Determines whether to display convert to order button or not. Returns true only if
         * requisition is approved and user has permission to convert requisition.
         *
         * @return {Boolean} should convert to order button be displayed
         */
        function displayConvertToOrder() {
            var hasRight = authorizationService.hasRight(FULFILLMENT_RIGHTS.ORDERS_EDIT, {
                programCode: vm.requisition.program.code
            });
            return vm.requisition.$isApproved() && hasRight;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name displaySkip
         *
         * @description
         * Determines whether to display skip requisition button or not. Returns true only if
         * requisition program allows to skip requisition.
         *
         * @return {Boolean} true if skip button should be visible, false otherwise
         */
        function displaySkip() {
            return vm.requisition.$isInitiated() &&
                vm.requisition.program.periodsSkippable &&
                !vm.requisition.emergency;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name displaySync
         *
         * @description
         * Determines whether to display sync with server button or not. Returns true only if
         * requisition has status INITIATED, SUBMITTED or AUTHORIZED.
         *
         * @return {Boolean} true if sync button should be visible, false otherwise
         */
        function displaySync() {
          if (vm.requisition.$isInitiated()) {
            return hasCreateRight();
          }
          if (vm.requisition.$isSubmitted()) {
            return hasAuthorizeRight();
          }
          if (vm.requisition.$isAuthorized() || vm.requisition.$isInApproval()) {
            return hasApproveRight();
          }
          return false;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name convertRnr
         *
         * @description
         * Displays convert to order modal.
         */
        function convertRnr() {
            convertToOrderModalService.show(vm.requisition);
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.controller:RequisitionViewController
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
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name isFullSupplyTabValid
         *
         * @description
         * Checks whether full supply tab has any errors. This method ignores skipped line items and
         * does not trigger validation.
         *
         * @return {Boolean} true if full supply tab has any errors, false otherwise
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
         * @methodOf requisition-view.controller:RequisitionViewController
         * @name isNonFullSupplyTabValid
         *
         * @description
         * Checks whether non full supply tab has any errors. This method ignores skipped line items
         * and does not trigger validation.
         *
         * @return {Boolean} true if non full supply tab has any errors, false otherwise
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
            promise.finally(loadingModalService.close);
            return promise;
        }

        function handleSaveError(status) {
            if (status === 409) {
                // in case of conflict, use the server version
                notificationService.error('msg.requisitionVersionError');
                reloadState();
            } else if (status === 403) {
                // 403 means user lost rights or requisition changed status
                notificationService.error('msg.requisitionUpdateForbidden');
                reloadState();
            } else {
                failWithMessage('msg.failedToSyncRequisition')();
            }
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

        function hasCreateRight() {
            return authorizationService.hasRight(REQUISITION_RIGHTS.REQUISITION_CREATE, {
                programCode: vm.requisition.program.code
            });
        }

        function hasAuthorizeRight() {
            return authorizationService.hasRight(REQUISITION_RIGHTS.REQUISITION_AUTHORIZE, {
                programCode: vm.requisition.program.code
            });
        }

        function hasApproveRight() {
            return authorizationService.hasRight(REQUISITION_RIGHTS.REQUISITION_APPROVE, {
                programCode: vm.requisition.program.code
            });
        }

    }
})();
