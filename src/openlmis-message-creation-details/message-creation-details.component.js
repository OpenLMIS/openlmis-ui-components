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
     * @ngdoc directive
     * @name openlmis-message-creation-details.component:openlmis-message-creation-details
     *
     * @description
     * Displays message author name with created date.
     *
     * @example
     * Here's an example of usage:
     * ```
     * <openlmis-message-creation-details
     *      user-first-name="vm.userFirstName"
     *      user-last-name="vm.userLastName"
     *      created-date="vm.createdDate">
     * </openlmis-message-creation-details>
     * ```
     */
    angular
        .module('openlmis-message-creation-details')
        .component('openlmisMessageCreationDetails', {
            controller: 'MessageCreationDetailsController',
            controllerAs: 'messageCreationDetailsCtrl',
            templateUrl: 'openlmis-message-creation-details/message-creation-details.html',
            bindings: {
                userFirstName: '<',
                userLastName: '<',
                createdDate: '<'
            }
        });

})();
