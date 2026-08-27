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

describe('gs1BarcodeParserService', function() {

    var defaults;

    function defaultsOf(name) {
        if (!defaults) {
            defaults = angular.injector(['ng', 'openlmis-gs1']);
        }

        return defaults.get(name);
    }

    var GS = '\u001d',
        GTIN = '05890123456786',
        GTIN_8_PADDED = '00000096385074',
        GTIN_12_PADDED = '00036000291452',
        GTIN_13_PADDED = '05901234123457',
        GTIN_BAD_CHECK_DIGIT = '05890123456787';

    beforeEach(function() {
        module('openlmis-gs1');
    });

    /**
     * The parser resolves a two digit year against the current one, so the specs express expected
     * years as offsets from today rather than as literals. Jasmine 1.3 offers no way to freeze the
     * clock, and the GS1 century rule makes both offsets used below stable in any year: a two digit
     * year 60 ahead always resolves 40 calendar years back, and one 4 ahead always resolves 4
     * calendar years forward.
     */
    function twoDigitYear(year) {
        return ('0' + year % 100).slice(-2);
    }

    describe('parse', function() {

        beforeEach(function() {
            var service, parseError, parseWarning;

            inject(function($injector) {
                service = $injector.get('gs1BarcodeParserService');
                parseError = $injector.get('GS1_PARSE_ERROR');
                parseWarning = $injector.get('GS1_PARSE_WARNING');
            });

            this.service = service;
            this.ERROR = parseError;
            this.WARNING = parseWarning;

            this.currentYear = new Date().getFullYear();
            this.year = this.currentYear + 1;
            this.yy = twoDigitYear(this.year);
        });

        it('should parse a DataMatrix payload carrying all supported identifiers', function() {
            var result = this.service.parse(
                ']d201' + GTIN + '17' + this.yy + '123110ABC123' + GS + '21SER456'
            );

            expect(result.error).toBeUndefined();
            expect(result.symbology).toEqual('GS1_DATA_MATRIX');
            expect(result.gtin).toEqual(GTIN);
            expect(result.lotCode).toEqual('ABC123');
            expect(result.serial).toEqual('SER456');
            expect(result.expirationDate).toEqual(new Date(this.year, 11, 31));
            expect(result.warnings).toEqual([]);
            expect(result.unparsed).toEqual({});
        });

        it('should report the symbology for a GS1-128 payload', function() {
            var result = this.service.parse(']C101' + GTIN + '10ABC123');

            expect(result.error).toBeUndefined();
            expect(result.symbology).toEqual('GS1_128');
            expect(result.lotCode).toEqual('ABC123');
        });

        it('should parse a payload transmitted without a symbology identifier', function() {
            var result = this.service.parse('01' + GTIN + '10ABC123');

            expect(result.error).toBeUndefined();
            expect(result.symbology).toBeUndefined();
            expect(result.gtin).toEqual(GTIN);
        });

        it('should parse identifiers in any order', function() {
            var result = this.service.parse(']d217' + this.yy + '123110ABC123' + GS + '01' + GTIN);

            expect(result.error).toBeUndefined();
            expect(result.gtin).toEqual(GTIN);
            expect(result.lotCode).toEqual('ABC123');
        });

        it('should terminate a variable length value at the end of the payload', function() {
            var result = this.service.parse(']d201' + GTIN + '10ABC123');

            expect(result.error).toBeUndefined();
            expect(result.lotCode).toEqual('ABC123');
        });

        it('should terminate a variable length value at the group separator', function() {
            var result = this.service.parse(']d201' + GTIN + '10ABC123' + GS + '21S1');

            expect(result.error).toBeUndefined();
            expect(result.lotCode).toEqual('ABC123');
            expect(result.serial).toEqual('S1');
        });

        it('should leave the lot code undefined when AI 10 is absent', function() {
            var result = this.service.parse(']d201' + GTIN + '17' + this.yy + '1231');

            expect(result.error).toBeUndefined();
            expect(result.lotCode).toBeUndefined();
        });

        it('should leave the expiration date undefined when AI 17 is absent', function() {
            var result = this.service.parse(']d201' + GTIN + '10ABC123');

            expect(result.error).toBeUndefined();
            expect(result.expirationDate).toBeUndefined();
        });

        it('should leave the serial undefined when AI 21 is absent', function() {
            var result = this.service.parse(']d201' + GTIN + '10ABC123');

            expect(result.error).toBeUndefined();
            expect(result.serial).toBeUndefined();
        });

        it('should preserve leading zeros of a padded shorter GTIN', function() {
            var result = this.service.parse(']d201' + GTIN_8_PADDED);

            expect(result.error).toBeUndefined();
            expect(result.gtin).toEqual(GTIN_8_PADDED);
        });

        it('should resolve a day of 00 to the last day of the month and warn', function() {
            var expectedDay = new Date(this.year, 2, 0).getDate(),
                result = this.service.parse(']d201' + GTIN + '17' + this.yy + '0200');

            expect(result.error).toBeUndefined();
            expect(result.expirationDate).toEqual(new Date(this.year, 1, expectedDay));
            expect(result.warnings).toEqual([this.WARNING.EXPIRY_DAY_ASSUMED_END_OF_MONTH]);
        });

        it('should reject an expiration date with an out of range month', function() {
            var result = this.service.parse(']d201' + GTIN + '17' + this.yy + '1301');

            expect(result.error).toEqual(this.ERROR.INVALID_EXPIRATION_DATE);
        });

        it('should reject an expiration date with a day beyond the end of the month', function() {
            var result = this.service.parse(']d201' + GTIN + '17' + this.yy + '0230');

            expect(result.error).toEqual(this.ERROR.INVALID_EXPIRATION_DATE);
        });

        it('should reject a GTIN failing its check digit', function() {
            var result = this.service.parse(']d201' + GTIN_BAD_CHECK_DIGIT);

            expect(result.error).toEqual(this.ERROR.INVALID_GTIN_CHECK_DIGIT);
        });

        it('should reject a payload carrying no AI 01', function() {
            var result = this.service.parse(']d210ABC123');

            expect(result.error).toEqual(this.ERROR.MISSING_GTIN);
        });

        it('should reject empty input', function() {
            var result = this.service.parse('');

            expect(result.error).toEqual(this.ERROR.EMPTY_INPUT);
        });

        it('should reject null input', function() {
            var result = this.service.parse(null);

            expect(result.error).toEqual(this.ERROR.EMPTY_INPUT);
        });

        it('should reject input that is not a GS1 element string', function() {
            var result = this.service.parse('HELLO WORLD');

            expect(result.error).toEqual(this.ERROR.MALFORMED_ELEMENT_STRING);
        });

        it('should reject a payload holding only separators', function() {
            var result = this.service.parse(']d2' + GS);

            expect(result.error).toEqual(this.ERROR.NO_APPLICATION_IDENTIFIERS);
        });

        it('should reject a truncated fixed length element', function() {
            var result = this.service.parse(']d20105890123456');

            expect(result.error).toEqual(this.ERROR.TRUNCATED_ELEMENT_STRING);
        });

        it('should reject a repeated application identifier', function() {
            var result = this.service.parse(']d201' + GTIN + '01' + GTIN);

            expect(result.error).toEqual(this.ERROR.DUPLICATE_APPLICATION_IDENTIFIER);
        });

        it('should reject a lot code running past its maximum length', function() {
            var result = this.service.parse(']d201' + GTIN + '10ABCDEFGHIJKLMNOPQRSTUVWXYZ');

            expect(result.error).toEqual(this.ERROR.VALUE_TOO_LONG);
        });

        it('should reject a lot code holding a character outside the GS1 invariant set', function() {
            var result = this.service.parse(']d201' + GTIN + '10AB~CD');

            expect(result.error).toEqual(this.ERROR.INVALID_LOT_CODE);
        });

        it('should collect an unknown variable length identifier and warn', function() {
            var result = this.service.parse(']d291XYZ' + GS + '01' + GTIN);

            expect(result.error).toBeUndefined();
            expect(result.gtin).toEqual(GTIN);
            expect(result.unparsed).toEqual({
                91: 'XYZ'
            });

            expect(result.warnings).toEqual([this.WARNING.UNKNOWN_APPLICATION_IDENTIFIER]);
        });

        it('should skip an unparsed identifier of predefined length without a separator', function() {
            var result = this.service.parse(']d23103000123' + '01' + GTIN + '10ABC123');

            expect(result.error).toBeUndefined();
            expect(result.gtin).toEqual(GTIN);
            expect(result.lotCode).toEqual('ABC123');
            expect(result.unparsed).toEqual({
                3103: '000123'
            });

            expect(result.warnings).toEqual([this.WARNING.UNKNOWN_APPLICATION_IDENTIFIER]);
        });

        it('should read a three digit identifier as three digits', function() {
            var result = this.service.parse(']d201' + GTIN + '240ABC' + GS + '10LOT1');

            expect(result.error).toBeUndefined();
            expect(result.lotCode).toEqual('LOT1');
            expect(result.unparsed).toEqual({
                240: 'ABC'
            });
        });

        it('should keep two three digit identifiers sharing their first two digits apart', function() {
            var result = this.service.parse(']d201' + GTIN + '240ABC' + GS + '241XYZ' + GS);

            expect(result.error).toBeUndefined();
            expect(result.gtin).toEqual(GTIN);
            expect(result.unparsed).toEqual({
                240: 'ABC',
                241: 'XYZ'
            });
        });

        /**
         * 710 to 716 are national healthcare reimbursement numbers and appear together on European
         * pharmaceutical packs. Read as two digit identifiers they collide, and a label whose product
         * and batch are both perfectly readable is thrown away over identifiers this version ignores.
         */
        it('should read a label carrying several reimbursement numbers', function() {
            var result = this.service.parse(
                ']d201' + GTIN + '10LOT1' + GS + '710AAA' + GS + '711BBB' + GS
            );

            expect(result.error).toBeUndefined();
            expect(result.gtin).toEqual(GTIN);
            expect(result.lotCode).toEqual('LOT1');
            expect(result.unparsed).toEqual({
                710: 'AAA',
                711: 'BBB'
            });
        });

        it('should keep the first value of a repeated identifier it does not read', function() {
            var result = this.service.parse(']d201' + GTIN + '91FIRST' + GS + '91SECOND' + GS);

            expect(result.error).toBeUndefined();
            expect(result.unparsed).toEqual({
                91: 'FIRST'
            });
        });

        it('should still reject a repeated identifier it does read', function() {
            var result = this.service.parse(']d201' + GTIN + '10ABC' + GS + '10DEF' + GS);

            expect(result.error).toEqual(this.ERROR.DUPLICATE_APPLICATION_IDENTIFIER);
        });

        it('should parse a padded GTIN-12', function() {
            var result = this.service.parse(']d201' + GTIN_12_PADDED);

            expect(result.error).toBeUndefined();
            expect(result.gtin).toEqual(GTIN_12_PADDED);
        });

        it('should parse a padded GTIN-13', function() {
            var result = this.service.parse(']d201' + GTIN_13_PADDED);

            expect(result.error).toBeUndefined();
            expect(result.gtin).toEqual(GTIN_13_PADDED);
        });

        it('should reject a serial outside the GS1 character set', function() {
            var result = this.service.parse(']d201' + GTIN + '21SER#456');

            expect(result.error).toEqual(this.ERROR.INVALID_SERIAL);
        });

        it('should reject a serial longer than its maximum', function() {
            var result = this.service.parse(']d201' + GTIN + '21' + new Array(22).join('S'));

            expect(result.error).toEqual(this.ERROR.VALUE_TOO_LONG);
        });

        it('should carry the expiry in wire format as well as a Date', function() {
            var result = this.service.parse(']d201' + GTIN + '17' + this.yy + '0131');

            expect(result.error).toBeUndefined();
            expect(result.expirationDateIso).toEqual(this.year + '-01-31');
            expect(result.expirationDate.getDate()).toEqual(31);
        });

        it('should resolve a two digit year fifty ahead into the current century', function() {
            var yy = twoDigitYear(this.currentYear + 50),
                result = this.service.parse(']d201' + GTIN + '17' + yy + '0131');

            expect(result.error).toBeUndefined();
            expect(result.expirationDate.getFullYear()).toEqual(this.currentYear + 50);
        });

        it('should resolve a two digit year fifty one ahead into the previous century', function() {
            var yy = twoDigitYear(this.currentYear + 51),
                result = this.service.parse(']d201' + GTIN + '17' + yy + '0131');

            expect(result.error).toBeUndefined();
            expect(result.expirationDate.getFullYear()).toEqual(this.currentYear + 51 - 100);
        });

        /**
         * A scanner that strips the separator cannot be caught here: the batch simply swallows the
         * element after it, and the result is still valid GS1. Pinned so that the day someone tries to
         * detect it, the shape of the problem is written down rather than rediscovered.
         */
        it('should read a swallowed serial as part of the batch when the separator is stripped',
            function() {
                var result = this.service.parse(']d201' + GTIN + '10ABC12321SER456');

                expect(result.error).toBeUndefined();
                expect(result.lotCode).toEqual('ABC12321SER456');
                expect(result.serial).toBeUndefined();
                expect(result.warnings).toEqual([]);
            });

        it('should lose a swallowed expiry when the separator is stripped', function() {
            var result = this.service.parse(']d201' + GTIN + '10LOT117' + this.yy + '0131');

            expect(result.error).toBeUndefined();
            expect(result.lotCode).toEqual('LOT117' + this.yy + '0131');
            expect(result.expirationDate).toBeUndefined();
        });

        it('should tolerate a leading separator', function() {
            var result = this.service.parse(']d2' + GS + '01' + GTIN);

            expect(result.error).toBeUndefined();
            expect(result.gtin).toEqual(GTIN);
        });

        it('should tolerate a trailing separator', function() {
            var result = this.service.parse(']d201' + GTIN + '10ABC123' + GS);

            expect(result.error).toBeUndefined();
            expect(result.lotCode).toEqual('ABC123');
        });

        it('should resolve a two digit year more than 50 ahead as belonging to the past', function() {
            var result = this.service.parse(
                ']d201' + GTIN + '17' + twoDigitYear(this.currentYear + 60) + '1231'
            );

            expect(result.error).toBeUndefined();
            expect(result.expirationDate.getFullYear()).toEqual(this.currentYear - 40);
        });

        it('should resolve a two digit year close to the current one as belonging ahead', function() {
            var result = this.service.parse(
                ']d201' + GTIN + '17' + twoDigitYear(this.currentYear + 4) + '1231'
            );

            expect(result.error).toBeUndefined();
            expect(result.expirationDate.getFullYear()).toEqual(this.currentYear + 4);
        });
    });

    describe('parse with overridden configuration', function() {

        beforeEach(function() {
            var accumulated = {};

            /**
             * Overrides accumulate, so two calls compose rather than the second discarding the first.
             * The defaults come from one throwaway injector - a constant cannot be decorated, and the
             * real one cannot be read before the module config blocks have run.
             */
            this.override = function(overrides) {
                angular.extend(accumulated, overrides);

                module(function($provide) {
                    $provide.constant('GS1_PARSE_CONFIG',
                        angular.extend({}, defaultsOf('GS1_PARSE_CONFIG'), accumulated));
                });
            };

            /**
             * Adds an entry to the identifier table, which is the module's own claim about how a new
             * AI is supported.
             */
            this.addIdentifier = function(definition) {
                module(function($provide) {
                    var table = angular.copy(defaultsOf('GS1_APPLICATION_IDENTIFIERS'));

                    table.parsed.push(definition);
                    $provide.constant('GS1_APPLICATION_IDENTIFIERS', table);
                });
            };

            this.initService = function() {
                var context = this;

                inject(function($injector) {
                    context.service = $injector.get('gs1BarcodeParserService');
                    context.ERROR = $injector.get('GS1_PARSE_ERROR');
                });
            };
        });

        it('should reject a payload without a prefix when the identifier is required', function() {
            var result;

            this.override({
                requireSymbologyIdentifier: true
            });
            this.initService();

            result = this.service.parse('01' + GTIN);

            expect(result.error).toEqual(this.ERROR.MISSING_SYMBOLOGY_IDENTIFIER);
        });

        it('should accept a payload with a prefix when the identifier is required', function() {
            var result;

            this.override({
                requireSymbologyIdentifier: true
            });
            this.initService();

            result = this.service.parse(']d201' + GTIN + '10ABC123');

            expect(result.error).toBeUndefined();
            expect(result.symbology).toEqual('GS1_DATA_MATRIX');
            expect(result.lotCode).toEqual('ABC123');
        });

        /**
         * The identifier table says supporting a new AI is a matter of adding an entry, so this pins
         * that claim: nothing but the table entry below is added, and the value has to arrive.
         */
        it('should carry a value for an identifier added to the table', function() {
            var result;

            this.addIdentifier({
                ai: '30',
                field: 'countOfItems',
                maxLength: 8
            });
            this.initService();

            result = this.service.parse(']d201' + GTIN + '3012' + GS + '10ABC123');

            expect(result.error).toBeUndefined();
            expect(result.countOfItems).toEqual('12');
            expect(result.lotCode).toEqual('ABC123');
            expect(result.unparsed).toEqual({});
        });

        it('should treat a configured substitute as the group separator', function() {
            var result;

            this.override({
                groupSeparatorSubstitutes: ['~']
            });
            this.initService();

            result = this.service.parse(']d201' + GTIN + '10ABC123~21SER456');

            expect(result.error).toBeUndefined();
            expect(result.lotCode).toEqual('ABC123');
            expect(result.serial).toEqual('SER456');
        });

        it('should accept a payload without AI 01 when the GTIN is not required', function() {
            var result;

            this.override({
                requireGtin: false
            });
            this.initService();

            result = this.service.parse(']d210ABC123');

            expect(result.error).toBeUndefined();
            expect(result.gtin).toBeUndefined();
            expect(result.lotCode).toEqual('ABC123');
        });

        it('should accept a GTIN failing its check digit when validation is disabled', function() {
            var result;

            this.override({
                validateGtinCheckDigit: false
            });
            this.initService();

            result = this.service.parse(']d201' + GTIN_BAD_CHECK_DIGIT);

            expect(result.error).toBeUndefined();
            expect(result.gtin).toEqual(GTIN_BAD_CHECK_DIGIT);
        });
    });

});
