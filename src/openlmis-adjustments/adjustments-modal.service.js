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
         * Open Adjustments modal.
         *
         * @param {Array}       adjustments (required) the list of adjustments to be updated
         * @param {Array}       reasons     (required) the list of available reasons
         * @param {String}      title       (optional) the title of the modal, defaults to
         *                                  'openlmisAdjustments.adjustments'
         * @param {String}      message     (optional) the message to be shown on the modal
         * @param {Boolean}     isDisabled  (optional) flag defining whether modal should be in
         *                                  disabled state
         * @param {Array}       summaries   (optional) the list of summaries to be displayed on the
         *                                  modal, this should be a key-value map, where key is the
         *                                  message key with the name of the summary and value is a
         *                                  function that takes a list of adjustments and returns a
         *                                  calculated value
         * @param {Function}    preSave     (optional) the function that will be called before
         *                                  saving updated adjustment list; this function should
         *                                  take a list of adjustments as a parameter and must
         *                                  return a promise; if the promise is resolved the save
         *                                  will proceed, otherwise the save will be canceled and
         *                                  user will be brought back to the modal
         * @param {Function}    preCancel   (optional) the function that will be called before
         *                                  closing the adjustments modal; this function should
         *                                  take a list of adjustments as a parameter and must
         *                                  return a promise; if the promise is resolved the modal
         *                                  will be closed, otherwise the user will be brought back
         *                                  to the modal
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
                            throw 'adjustments must be defined';
                        }
                        return angular.copy(adjustments);
                    },
                    reasons: function() {
                        if (!reasons) {
                            throw 'reasons must be defined';
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
                        if (summaries) {
                            angular.forEach(summaries, function(fn) {
                                if (!angular.isFunction(fn)) {
                                    throw 'summaries must be a key-function map';
                                }
                            });
                        }
                        return summaries;
                    },
                    preSave: function() {
                        if (preSave && !angular.isFunction(preSave)) {
                            throw 'preSave must be a function';
                        }
                        return preSave;
                    },
                    preCancel: function() {
                        if (preCancel && !angular.isFunction(preCancel)) {
                            throw 'preCancel must be a function';
                        }
                        return preCancel;
                    }
                }
            }).promise;
        }
    }

})();
