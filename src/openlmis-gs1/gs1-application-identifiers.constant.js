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
     * @name openlmis-gs1.GS1_APPLICATION_IDENTIFIERS
     *
     * @description
     * The GS1 Application Identifier table used by the parser.
     *
     * The `parsed` list holds the AIs this version extracts. Supporting a new AI is a matter of
     * adding an entry here - an entry declaring `length` is a fixed-length element, one declaring
     * `maxLength` is variable length and is terminated by the group separator or the end of the
     * element string.
     *
     * The `predefinedLengths` list mirrors the GS1 General Specifications table of AIs with a
     * predefined length. It is not used to extract values - it lets the parser skip over an
     * element it does not care about without a group separator to guide it, which is what keeps a
     * label carrying extra AIs (net weight, production date) parseable. Any AI absent from this
     * list is variable length by definition and must be terminated by a group separator.
     *
     * The `aiLengths` list carries the GS1 rule that the first two digits of an AI determine how
     * many digits the AI itself has. Without it a three digit AI would be read as two, taking its
     * third digit into the value and keying two different AIs the same - 240 and 241, or the 710 to
     * 716 reimbursement numbers on European pharmaceutical packs, both collapse to one key. Any
     * prefix not listed is two digits.
     */
    angular
        .module('openlmis-gs1')
        .constant('GS1_APPLICATION_IDENTIFIERS', {
            parsed: [
                {
                    ai: '01',
                    field: 'gtin',
                    length: 14
                },
                {
                    ai: '10',
                    field: 'lotCode',
                    maxLength: 20
                },
                {
                    ai: '17',
                    field: 'expirationDate',
                    length: 6
                },
                {
                    ai: '21',
                    field: 'serial',
                    maxLength: 20
                }
            ],
            predefinedLengths: [
                {
                    prefixes: ['00'],
                    aiLength: 2,
                    dataLength: 18
                },
                {
                    prefixes: ['01', '02', '03'],
                    aiLength: 2,
                    dataLength: 14
                },
                {
                    prefixes: ['04'],
                    aiLength: 2,
                    dataLength: 16
                },
                {
                    prefixes: ['11', '12', '13', '14', '15', '16', '17', '18', '19'],
                    aiLength: 2,
                    dataLength: 6
                },
                {
                    prefixes: ['20'],
                    aiLength: 2,
                    dataLength: 2
                },
                {
                    prefixes: ['31', '32', '33', '34', '35', '36'],
                    aiLength: 4,
                    dataLength: 6
                },
                {
                    prefixes: ['41'],
                    aiLength: 3,
                    dataLength: 13
                }
            ],
            aiLengths: [
                {
                    prefixes: ['23', '24', '25', '40', '41', '42', '71'],
                    length: 3
                },
                {
                    prefixes: ['31', '32', '33', '34', '35', '36', '39', '43', '70', '72', '80',
                        '81', '82'],
                    length: 4
                }
            ]
        });

})();
