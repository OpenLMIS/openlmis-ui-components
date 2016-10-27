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

    RequisitionCtrl.$inject = ['$scope', '$state','requisition', 'AuthorizationService', 'messageService', '$ngBootbox', 'NotificationModal'];

    function RequisitionCtrl($scope, $state, requisition, AuthorizationService, messageService, $ngBootbox, NotificationModal) {

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
            save().then(function(response) {
               NotificationModal.showSuccess('msg.rnr.save.success', reloadState);
            });
        };

        function submitRnr() {
            $ngBootbox.confirm(messageService.get("msg.question.confirmation.submit")).then(function() {
                if (requisition.$isValid()) {
                    save().then(function() {
                        $scope.requisition.$submit().then(function(response) {
                            NotificationModal.showSuccess('msg.rnr.submitted.success', reloadState);
                        }, function(response) {
                            NotificationModal.showError('msg.rnr.submitted.failure');
                        });
                    });
                }
            });    
        };

        function authorizeRnr() {
            $ngBootbox.confirm(messageService.get("msg.question.confirmation.authorize")).then(function() {
                if (requisition.$isValid()) {
                    save().then(function() {
                        $scope.requisition.$authorize().then(function(response) {
                            NotificationModal.showSuccess('msg.rnr.authorized.success', reloadState);
                        }, function(response) {
                            NotificationModal.showError('msg.rnr.authorized.failure');
                        });
                    });
                }
            });
        };

        function removeRnr() {
            $ngBootbox.confirm(messageService.get("msg.question.confirmation.deletion")).then(function() {
                $scope.requisition.$remove().then(
                    function(response) {
                        $state.go('requisitions.initRnr');
                    }, function(response) {
                        NotificationModal.showError('msg.rnr.deletion.failure');
                    }
                );
            });
        };

        function approveRnr() {
             $ngBootbox.confirm(messageService.get("msg.question.confirmation")).then(function() {
                if (requisition.$isValid()) {
                    save().then(function() {
                        $scope.requisition.$approve().then(function(response) {
                            $state.go('requisitions.approvalList');
                        });
                    });
                }
             });
        };

        function rejectRnr() {
            $ngBootbox.confirm(messageService.get("msg.question.confirmation")).then(function() {
                $scope.requisition.$reject().then(
                    function(response) {
                        $state.go('requisitions.approvalList');
                    }, function(response) {
                        NotificationModal.showError(messageService.get('msg.rejected.failure'));
                    }
                );
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
            var promise = $scope.requisition.$save();
            promise.catch(failedToSave);
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
