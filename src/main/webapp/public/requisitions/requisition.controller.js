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

    RequisitionCtrl.$inject = ['$scope', '$state', '$stateParams','requisition', 'AuthorizationService', 'messageService', '$ngBootbox'];

    function RequisitionCtrl($scope, $state, $stateParams, requisition, AuthorizationService, messageService, $ngBootbox) {

        $scope.requisition = requisition;
        $scope.requisitionType = $scope.requisition.emergency ? "requisition.type.emergency" : "requisition.type.regular";
        $scope.message = getMessage();
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
                reloadWithMessage(messageService.get('msg.rnr.save.success'));
            });
        };

        function submitRnr() {
            $ngBootbox.confirm(messageService.get("msg.question.confirmation.submit")).then(function() {
                save().then(function() {
                    $scope.requisition.$submit().then(function(response) {
                        reloadWithMessage(messageService.get('msg.rnr.submitted.success'));
                    }, showErrors);
                });
            });    
        };

        function authorizeRnr() {
            $ngBootbox.confirm(messageService.get("msg.question.confirmation.authorize")).then(function() {
                save().then(function() {
                    $scope.requisition.$authorize().then(function(response) {
                        reloadWithMessage(messageService.get('msg.rnr.authorized.success'));
                    }, showErrors);
                });
            });
        };

        function removeRnr() {
            $ngBootbox.confirm(messageService.get("msg.question.confirmation.deletion")).then(function() {
                $scope.requisition.$remove().then(
                    function(response) {
                        $state.go('requisitions.initRnr');
                    }, function(response) {
                        $scope.error = messageService.get('msg.rnr.deletion.failure');
                        $scope.message = "";
                    }
                );
            });
        };

        function approveRnr() {
             $ngBootbox.confirm(messageService.get("msg.question.confirmation")).then(function() {
                save().then(function() {
                    $scope.requisition.$approve().then(function(response) {
                        $state.go('requisitions.approvalList');
                    }, showErrors);
                });
             });
        };

        function rejectRnr() {
            $ngBootbox.confirm(messageService.get("msg.question.confirmation")).then(function() {
                $scope.requisition.$reject().then(
                    function(response) {
                        $state.go('requisitions.approvalList');
                    }, function(response) {
                        $scope.error = messageService.get('msg.error.occurred');
                        $scope.message = "";
                    }
                );
            });
        };

        function periodDisplayName() {
            //TODO: This is a temporary solution.
            return $scope.requisition.processingPeriod.startDate.slice(0,3).join("/") + ' - ' + $scope.requisition.processingPeriod.endDate.slice(0,3).join("/");
        };

        function displayAuthorize() {
            return $scope.requisition.status === "SUBMITTED" && AuthorizationService.hasPermission("AUTHORIZE_REQUISITION");
        };

        function displaySubmit() {
            return $scope.requisition.status === "INITIATED" && AuthorizationService.hasPermission("CREATE_REQUISITION");
        };

        function displayApproveAndReject() {
            return $scope.requisition.status === "AUTHORIZED" && AuthorizationService.hasPermission("APPROVE_REQUISITION");
        };

        function displayDelete() {
            return $scope.requisition.status === "INITIATED" && AuthorizationService.hasPermission("DELETE_REQUISITION");
        };

        function save() {
            var promise = $scope.requisition.$save();
            promise.catch(failedToSave);
            return promise;
        }

        function failedToSave(response) {
            $scope.error = messageService.get('msg.rnr.save.failure');
            $scope.message = "";
        }

        function showErrors() {
            $scope.requisition.$validate();
        } 

        function getMessage() {
            return $stateParams.message;
        }

        function reloadWithMessage(message) {
            $state.go('.', {
                message: message
            });
        }

    }
})();
