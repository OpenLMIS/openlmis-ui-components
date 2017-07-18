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
     * @ngdoc service
     * @name openlmis-adjustments.adjustmentsModalService
     *
     * @description
     * Manages Adjustments modal.
     */
    angular
        .module('openlmis-adjustments')
        .service('adjustmentsModalService', adjustmentsModalService);

    adjustmentsModalService.$inject = [
        'openlmisModalService'
    ];

    function adjustmentsModalService(openlmisModalService) {
        var dialog;

        this.open = open;

        /**
         * @ngdoc method
         * @methodOf openlmis-adjustments.adjustmentsModalService
         * @name open
         *
         * @description
         * Open Total Losses and Adjustments modal.
         *
         * @param {Array}  reasons         the list of available reasons
         * @param {Array}  adjustments     the list of adjustments to be updated
         */
        function open(adjustments, reasons, title, message, isDisabled, summaries, preSave,
                      preCancel) {

            return openlmisModalService.createDialog({
                backdrop  : 'static',
                controller: 'AdjustmentsModalController',
                controllerAs: 'vm',
                templateUrl: 'openlmis-adjustments/adjustments-modal.html',
                show: true,
                resolve: {
                    adjustments: function() {
                        if (!adjustments) {
                            throw 'Adjustments must be defined';
                        }
                        return angular.copy(adjustments);
                    },
                    reasons: function() {
                        if (!reasons) {
                            throw 'Reasons must be defined';
                        }
                        return reasons;
                    },
                    title: function() {
                        return title ? title : 'openlmisAdjustments.adjustments';
                    },
                    message: function() {
                        return message;
                    },
                    isDisabled: function() {
                        return isDisabled;
                    },
                    summaries: function() {
                        return summaries;
                    },
                    preSave: function() {
                        return preSave;
                    },
                    preCancel: function() {
                        return preCancel;
                    }
                }
            }).promise;
        }
    }

})();
