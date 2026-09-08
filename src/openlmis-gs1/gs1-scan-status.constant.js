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
     * @name openlmis-gs1.GS1_SCAN_STATUS
     *
     * @description
     * States the scan input reports to the user. SUCCESS and ERROR are transient, falling back to
     * READY after a delay, so the indicator confirms each scan rather than showing a lasting
     * result. WORKING lasts until the handler settles, so a scan is never reported as accepted
     * before the screen has resolved it.
     */
    angular
        .module('openlmis-gs1')
        .constant('GS1_SCAN_STATUS', {
            READY: 'READY',
            WORKING: 'WORKING',
            SUCCESS: 'SUCCESS',
            ERROR: 'ERROR'
        });

})();
