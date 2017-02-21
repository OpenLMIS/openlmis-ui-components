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
    * @module openlmis-auth
    *
    * @description
    * The openlmis-auth module is responsible for logging a user in and out of the OpenLMIS-UI and
    * managing authentication when making calls to other services.
    */
    angular.module('openlmis-auth', [
        'angular-md5',
        'http-auth-interceptor',
        'openlmis-local-storage',
        'openlmis-modal',
        'openlmis-templates',
        'openlmis-urls',
        'openlmis-user',
        'ui.router'
    ]);

})();
