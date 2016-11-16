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

    angular.module('openlmis.requisitions').controller('RequisitionCtrl', RequisitionCtrl);

    RequisitionCtrl.$inject = ['$scope', '$state','requisition', 'AuthorizationService', 'messageService', '$ngBootbox', 'NotificationModal', 'LoadingModalService'];

    function RequisitionCtrl($scope, $state, requisition, AuthorizationService, messageService, $ngBootbox, NotificationModal, LoadingModalService) {

        $scope.requisition = requisition;
        $scope.requisitionType = $scope.requisition.emergency ? "requisition.type.emergency" : "requisition.type.regular";
        $scope.saveRnr = saveRnr;
        $scope.submitRnr = submitRnr;
        $scope.authorizeRnr = authorizeRnr;
        $scope.removeRnr = removeRnr;
        $scope.approveRnr = approveRnr;
        $scope.rejectRnr = rejectRnr;
        $scope.periodDisplayName = periodDisplayName;
        $scope.displaySubmit = displaySubmit;
        $scope.displayAuthorize = displayAuthorize;
        $scope.displayDelete = displayDelete;
        $scope.displayApproveAndReject = displayApproveAndReject;


        function saveRnr() {
            LoadingModalService.open();
            save().then(function(response) {
               LoadingModalService.close();
               NotificationModal.showSuccess('msg.rnr.save.success').then(reloadState);
            });
        };

        function submitRnr() {
            $ngBootbox.confirm(messageService.get("msg.question.confirmation.submit")).then(function() {
                if (requisition.$isValid()) {
                    save().then(function() {
                        LoadingModalService.open();
                        $scope.requisition.$submit()
                        .then(function(response) {
                            NotificationModal.showSuccess('msg.rnr.submitted.success').then(reloadState);
                        })
                        .catch(function(response) {
                            NotificationModal.showError('msg.rnr.submitted.failure');
                        })
                        .finally(LoadingModalService.close);
                    });
                } else {
                    NotificationModal.showError('error.rnr.validation');
                }
            });    
        };

        function authorizeRnr() {
            $ngBootbox.confirm(messageService.get("msg.question.confirmation.authorize")).then(function() {
                if (requisition.$isValid()) {
                    save()
                    .then(function() {
                        LoadingModalService.open();
                        $scope.requisition.$authorize()
                        .then(function(response) {
                            NotificationModal.showSuccess('msg.rnr.authorized.success').then(reloadState);
                        })
                        .catch(function(response) {
                            NotificationModal.showError('msg.rnr.authorized.failure');
                        })
                        .finally(LoadingModalService.close);
                    });
                } else {
                    NotificationModal.showError('error.rnr.validation');
                }
            });
        };

        function removeRnr() {
            $ngBootbox.confirm(messageService.get("msg.question.confirmation.deletion")).then(function() {
                LoadingModalService.open();
                $scope.requisition.$remove()
                .then(function(response) {
                    $state.go('requisitions.initRnr');
                    NotificationModal.showSuccess(messageService.get('msg.rnr.deletion.success'));
                })
                .catch(function(response) {
                    NotificationModal.showError('msg.rnr.deletion.failure');
                })
                .finally(LoadingModalService.close);
            });
        };

        function approveRnr() {
             $ngBootbox.confirm(messageService.get("msg.question.confirmation")).then(function() {
                if (requisition.$isValid()) {
                    save()
                    .then(function() {
                        LoadingModalService.open();
                        $scope.requisition.$approve()
                        .then(function(response) {
                            $state.go('requisitions.approvalList');
                            NotificationModal.showSuccess(messageService.get('msg.rnr.approved.success'));
                        })
                        .finally(LoadingModalService.close);
                    });
                } else {
                    NotificationModal.showError('error.rnr.validation');
                }
             });
        };

        function rejectRnr() {
            $ngBootbox.confirm(messageService.get("msg.question.confirmation")).then(function() {
                LoadingModalService.open();
                $scope.requisition.$reject()
                .then(function(response) {
                    $state.go('requisitions.approvalList');
                    NotificationModal.showSuccess(messageService.get('msg.rnr.reject.success'));
                })
                .catch(function(response) {
                    NotificationModal.showError(messageService.get('msg.rejected.failure'));
                })
                .finally(LoadingModalService.close);
            });
        };

        function periodDisplayName() {
            //TODO: This is a temporary solution.
            return $scope.requisition.processingPeriod.startDate.slice(0,3).join("/") + ' - ' + $scope.requisition.processingPeriod.endDate.slice(0,3).join("/");
        };

        function displayAuthorize() {
            return $scope.requisition.$isSubmitted() && AuthorizationService.hasPermission("AUTHORIZE_REQUISITION");
        };

        function displaySubmit() {
            return $scope.requisition.$isInitiated() && AuthorizationService.hasPermission("CREATE_REQUISITION");
        };

        function displayApproveAndReject() {
            return $scope.requisition.$isAuthorized() && AuthorizationService.hasPermission("APPROVE_REQUISITION");
        };

        function displayDelete() {
            return $scope.requisition.$isInitiated() && AuthorizationService.hasPermission("DELETE_REQUISITION");
        };

        function save() {
            LoadingModalService.open();
            var promise = $scope.requisition.$save();
            promise.catch(failedToSave);
            promise.finally(LoadingModalService.close)
            return promise;
        }

        function failedToSave(response) {
            NotificationModal.showError(messageService.get('msg.rnr.save.failure'));
        }

        function reloadState() {
            $state.reload();
        }

    }
})();
