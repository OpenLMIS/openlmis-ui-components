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
     * @name openlmis-gs1.GS1_PARSE_WARNING
     *
     * @description
     * Conditions that did not stop a scan from being parsed but that a consumer should surface.
     * They are returned on the `warnings` array of a successful parse result rather than logged, so
     * that the screen decides how - and whether - to show them.
     *
     * - `EXPIRY_DAY_ASSUMED_END_OF_MONTH` - AI 17 carried a day of `00`, meaning end of month. GSCN
     *   21-040 makes that invalid for regulated healthcare products, so it should not occur on
     *   compliant labels; the parser tolerates it and resolves to the last day of the month.
     * - `UNKNOWN_APPLICATION_IDENTIFIER` - an AI outside the table was present. Its value was
     *   collected on `unparsed` and ignored. Worth surfacing because it can also mean the AI table
     *   needs an entry.
     */
    angular
        .module('openlmis-gs1')
        .constant('GS1_PARSE_WARNING', {
            EXPIRY_DAY_ASSUMED_END_OF_MONTH: 'EXPIRY_DAY_ASSUMED_END_OF_MONTH',
            UNKNOWN_APPLICATION_IDENTIFIER: 'UNKNOWN_APPLICATION_IDENTIFIER'
        });

})();
