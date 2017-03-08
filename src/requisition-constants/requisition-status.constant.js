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
    * @ngdoc object
    * @name requisition-constants.REQUISITION_STATUS
    *
    * @description
    * This is constant for requisition statuses
    */
    angular
        .module('requisition-constants')
        .constant('REQUISITION_STATUS', status());

    function status() {

        return {
            INITIATED: 'INITIATED',
            SUBMITTED: 'SUBMITTED',
            AUTHORIZED: 'AUTHORIZED',
            IN_APPROVAL: 'IN_APPROVAL',
            APPROVED: 'APPROVED',
            RELEASED: 'RELEASED',
            SKIPPED: 'SKIPPED',
            $toList: toList,
            $getDisplayName: getDisplayName
        };

        /**
         * @ngdoc method
         * @methodOf requisition-constants.REQUISITION_STATUS
         * @name toList
         *
         * @description
         * Retrieves all requisition statuses.
         */
        function toList() {
            var list = [],
                id = 0;
            angular.forEach(this, function(status) {
                if (!angular.isFunction(status)) {
                    list.push( {
                        id: id,
                        label: status
                    });
                    id++;
                }
            });
            return list;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-constants.REQUISITION_STATUS
         * @name getDisplayName
         *
         * @description
         * Retrieves display name for the given requisition status.
         */
        function getDisplayName(status) {
            var displayName;
            if (status == this.INITIATED) {
               displayName = 'Initiated';
            } else if (status == this.SUBMITTED) {
               displayName = 'Submitted';
            } else if (status == this.AUTHORIZED) {
                displayName = 'Authorized';
            } else if (status == this.IN_APPROVAL) {
                displayName = 'In approval';
            } else if (status == this.APPROVED) {
                displayName = 'Approved';
            } else if (status == this.RELEASED) {
                displayName = 'Released';
            } else if (status == this.SKIPPED) {
                displayName = 'Skipped';
            }
            return displayName;
        }
    }

})();
