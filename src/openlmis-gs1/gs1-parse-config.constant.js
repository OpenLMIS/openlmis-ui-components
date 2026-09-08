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
     * @name openlmis-gs1.GS1_PARSE_CONFIG
     *
     * @description
     * Deployment tunable parser behaviour. Override this constant to adapt to the scanner hardware
     * in use at a given deployment.
     *
     * Properties:
     *
     * - `symbologyIdentifiers` - prefixes a scanner may transmit ahead of the element string,
     *   mapped to the symbology they denote. All of them are accepted as a positive "this is GS1"
     *   signal; the parser itself routes by AI content, not by symbology.
     * - `requireSymbologyIdentifier` - when true, input arriving without one of the prefixes above
     *   is rejected instead of parsed on a best-effort basis.
     * - `groupSeparator` - the character terminating variable-length elements. ASCII 29 (GS) by
     *   default.
     * - `groupSeparatorSubstitutes` - characters some scanner and operating system combinations
     *   transmit in place of the group separator. Each is rewritten to `groupSeparator` before
     *   parsing. Note that a substitute must not be a character that can legitimately occur inside
     *   a lot code or serial.
     * - `requireGtin` - when true, an element string carrying no AI 01 is rejected. AI 01 is what
     *   resolves a scan to a product, so a payload without it cannot be acted on.
     * - `validateGtinCheckDigit` - when true, the AI 01 value is checked against its GS1 modulo 10
     *   check digit, which rejects misreads before they reach a lookup.
     */
    angular
        .module('openlmis-gs1')
        .constant('GS1_PARSE_CONFIG', {
            symbologyIdentifiers: {
                ']d2': 'GS1_DATA_MATRIX',
                ']C1': 'GS1_128',
                ']e0': 'GS1_DATABAR',
                ']Q3': 'GS1_QR_CODE'
            },
            requireSymbologyIdentifier: false,
            groupSeparator: '\u001d',
            groupSeparatorSubstitutes: [],
            requireGtin: true,
            validateGtinCheckDigit: true
        });

})();
