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
     * @name openlmis-offline.Offline
     *
     * @description
     * Creates constant tied to [OfflineJS,](https://github.com/hubspot/offline) so that if OfflineJS isn't included
     * an error message is thrown by AngularJS.
     */
    angular.module('openlmis-offline')
        //eslint-disable-next-line no-undef
        .constant('Offline', Offline)
        .constant('OFFLINE_CHECK_TIME_OUT', getOfflineCheckTimeOut());

    function getOfflineCheckTimeOut() {
        var offlineCheckTimeOut = '@@OFFLINE_CHECK_TIME_OUT';

        return (parseInt(offlineCheckTimeOut) && parseInt(offlineCheckTimeOut) > 0)
            ? parseInt(offlineCheckTimeOut) : 20000;
    }

})();
