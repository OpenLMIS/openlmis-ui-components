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
     * @name openlmis-gs1.GS1_PARSE_ERROR
     *
     * @description
     * Reasons a scan could not be parsed. The parser returns a code rather than a message - mapping
     * a code to user facing text is the consuming screen's concern.
     *
     * Two codes carry diagnostic weight beyond "this scan is bad", and a consumer should say so
     * when it reports them:
     *
     * - `VALUE_TOO_LONG` - a variable-length element ran past its maximum. The most likely cause is
     *   a scanner that is not transmitting the group separator, so the value swallowed the elements
     *   that followed it. This is the only case in which a stripped separator is detectable.
     * - `INVALID_LOT_CODE` / `INVALID_SERIAL` - the value contains a character outside the GS1
     *   invariant set. A tilde or similar punctuation showing up here is a strong hint that the
     *   scanner is transmitting a substituted group separator that has not been configured in
     *   GS1_PARSE_CONFIG.
     */
    angular
        .module('openlmis-gs1')
        .constant('GS1_PARSE_ERROR', {
            EMPTY_INPUT: 'EMPTY_INPUT',
            MISSING_SYMBOLOGY_IDENTIFIER: 'MISSING_SYMBOLOGY_IDENTIFIER',
            MALFORMED_ELEMENT_STRING: 'MALFORMED_ELEMENT_STRING',
            TRUNCATED_ELEMENT_STRING: 'TRUNCATED_ELEMENT_STRING',
            NO_APPLICATION_IDENTIFIERS: 'NO_APPLICATION_IDENTIFIERS',
            DUPLICATE_APPLICATION_IDENTIFIER: 'DUPLICATE_APPLICATION_IDENTIFIER',
            VALUE_TOO_LONG: 'VALUE_TOO_LONG',
            MISSING_GTIN: 'MISSING_GTIN',
            INVALID_GTIN: 'INVALID_GTIN',
            INVALID_GTIN_CHECK_DIGIT: 'INVALID_GTIN_CHECK_DIGIT',
            INVALID_EXPIRATION_DATE: 'INVALID_EXPIRATION_DATE',
            INVALID_LOT_CODE: 'INVALID_LOT_CODE',
            INVALID_SERIAL: 'INVALID_SERIAL'
        });

})();
