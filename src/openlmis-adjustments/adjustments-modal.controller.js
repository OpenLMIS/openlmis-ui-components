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
     * @name openlmis-adjustments.controller:AdjustmentsModalController
     *
     * @description
     * Provides methods for Adjustments modal.
     */
    angular
        .module('openlmis-adjustments')
        .controller('AdjustmentsModalController', AdjustmentsModalController);

    AdjustmentsModalController.$inject = [
        '$filter', '$q', 'modalDeferred', 'title', 'message', 'isDisabled', 'adjustments',
        'reasons', 'summaries', 'preSave', 'preCancel', 'filterReasons'
    ];

    function AdjustmentsModalController($filter, $q, modalDeferred, title, message, isDisabled,
                                        adjustments, reasons, summaries, preSave, preCancel,
                                        filterReasons) {

        var vm = this;

        vm.$onInit = onInit;
        vm.addAdjustment = addAdjustment;
        vm.removeAdjustment = removeAdjustment;
        vm.cancel = cancel;
        vm.save = save;

        /**
         * @ngdoc property
         * @propertyOf openlmis-adjustments.controller:AdjustmentsModalController
         * @name title
         * @type {String}
         *
         * @description
         * The title of the modal.
         */
        vm.title = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-adjustments.controller:AdjustmentsModalController
         * @name message
         * @type {String}
         *
         * @description
         * The message of the modal.
         */
        vm.message = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-adjustments.controller:AdjustmentsModalController
         * @name isDisabled
         * @type {Boolean}
         *
         * @description
         * Flag defining whether the modal is in disabled state.
         */
        vm.isDisabled = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-adjustments.controller:AdjustmentsModalController
         * @name adjustments
         * @type {Array}
         *
         * @description
         * Line item adjustments that will be updated.
         */
        vm.adjustments = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-adjustments.controller:AdjustmentsModalController
         * @name reasons
         * @type {Array}
         *
         * @description
         * Possible reasons that user can choose from.
         */
        vm.reasons = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-adjustments.controller:AdjustmentsModalController
         * @name title
         * @type {Object}
         *
         * @description
         * The key-function map of summaries to be displayed on the modal.
         */
        vm.summaries = undefined;

        /**
         * @ngdoc methodOf
         * @methodOf openlmis-adjustments.controller:AdjustmentsModalController
         * @name $onInit
         *
         * @description
         * Initialization method of the AdjustmentsModalController.
         */
        function onInit() {
            vm.title = title;
            vm.message = message;
            vm.isDisabled = isDisabled;
            vm.adjustments = adjustments;
            vm.reasons = reasons;
            vm.summaries = summaries;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-adjustments.controller:AdjustmentsModalController
         * @name addAdjustment
         *
         * @description
         * Adds adjustment to line item.
         */
        function addAdjustment() {
            var adjustment = {
                reason: vm.reason,
                quantity: vm.quantity
            };

            vm.adjustments.push(adjustment);

            vm.quantity = undefined;
            vm.reason = undefined;

            if (filterReasons) {
                vm.reasons = filterReasons(vm.adjustments);
            }

            return $q.when();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-adjustments.controller:AdjustmentsModalController
         * @name removeAdjustment
         *
         * @description
         * Removes adjustment to line item.
         *
         * @param {Object}  adjustment  the adjustment to be removed
         */
        function removeAdjustment(adjustment) {
            var index = vm.adjustments.indexOf(adjustment);
            if (index > -1) {
                vm.adjustments.splice(index, 1);
            }

            if (filterReasons) {
                vm.reasons = filterReasons(vm.adjustments);
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-adjustments.controller:AdjustmentsModalController
         * @name save
         *
         * @description
         * Saves the adjustments through modalDeferred promise. It also closes the modal. If the
         * promise returned by the preSave function(if it is given) is rejected user will be brought
         * back to the modal without applying any changes;
         */
        function save() {
            if (preSave) {
                preSave(vm.adjustments)
                    .then(function() {
                        modalDeferred.resolve(vm.adjustments);
                    });
            } else {
                modalDeferred.resolve(vm.adjustments);
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-adjustments.controller:AdjustmentsModalController
         * @name cancel
         *
         * @description
         * Closes the modal unless the promise returned by the preCancel function(it it is given) is
         * rejected.
         */
        function cancel() {
            if (preCancel) {
                preCancel(vm.adjustments)
                    .then(modalDeferred.reject);
            } else {
                modalDeferred.reject();
            }
        }
    }

})();
