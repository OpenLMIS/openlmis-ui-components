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
     * @name openlmis-gs1.component:openlmisScanInput
     *
     * @description
     * Shows whether the scanner is being listened to, and reports each scan it captures.
     *
     * Transport and parsing only - it holds no reference to the screen's rows and knows nothing
     * about products, lots or quantities. Those belong to the handler, which is what keeps the
     * component reusable by any workflow, here or in fulfillment.
     *
     * `context` is handed back to the handler uninspected, so a screen can pass its own collection
     * and helpers through and keep its controller to one delegating line.
     *
     * @example
     * ```
     * <openlmis-scan-input
     *     mode="RECEIVE"
     *     context="vm.scanContext"
     *     on-scan="vm.onScan(scan, mode, context)">
     * </openlmis-scan-input>
     * ```
     */
    angular
        .module('openlmis-gs1')
        .component('openlmisScanInput', {
            controller: 'ScanInputController',
            controllerAs: 'vm',
            templateUrl: 'openlmis-gs1/openlmis-scan-input.html',
            bindings: {
                mode: '@',
                context: '<?',
                onScan: '&'
            }
        });

})();
