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
     * @ngdoc service
     * @name openlmis-gs1.gs1BarcodeParserService
     *
     * @description
     * Parses a GS1 element string captured from a barcode scanner into product, batch and expiry
     * data.
     *
     * The parser is carrier agnostic. A GS1 element string is a sequence of Application Identifiers
     * each followed by its value, and that sequence is identical whether the carrier is a GS1
     * DataMatrix or a GS1-128 - so this service routes by AI content, never by symbology, and one
     * implementation serves every carrier.
     */
    angular
        .module('openlmis-gs1')
        .service('gs1BarcodeParserService', gs1BarcodeParserService);

    gs1BarcodeParserService.$inject = [
        'GS1_APPLICATION_IDENTIFIERS',
        'GS1_PARSE_CONFIG',
        'GS1_PARSE_ERROR',
        'GS1_PARSE_WARNING'
    ];

    function gs1BarcodeParserService(GS1_APPLICATION_IDENTIFIERS, GS1_PARSE_CONFIG, GS1_PARSE_ERROR,
                                     GS1_PARSE_WARNING) {

        var CHARACTER_SET_82 = /^[!"%&'()*+,\-./0-9:;<=>?A-Z_a-z]*$/,
            GTIN_14 = /^\d{14}$/,
            SIX_DIGITS = /^\d{6}$/,
            TWO_DIGITS = /^\d\d/,
            knownIdentifiers = indexKnownIdentifiers(),
            predefinedLengths = indexPredefinedLengths();

        this.parse = parse;

        /**
         * @ngdoc method
         * @methodOf openlmis-gs1.gs1BarcodeParserService
         * @name parse
         *
         * @description
         * Parses a raw scan payload into its GS1 elements.
         *
         * On success the returned object carries:
         *
         * - `symbology`      the symbology the scanner reported, undefined if it sent no prefix
         * - `gtin`           the full 14 digit AI 01 value, leading zeros preserved
         * - `lotCode`        the AI 10 value
         * - `expirationDate` the AI 17 value as a Date
         * - `serial`         the AI 21 value, for in session duplicate detection only
         * - `unparsed`       values of AIs outside the table, keyed by AI
         * - `warnings`       GS1_PARSE_WARNING codes raised while parsing
         *
         * Fields for absent AIs are undefined. On failure the returned object carries a single
         * `error` property holding a GS1_PARSE_ERROR code and nothing else, so a consumer can branch
         * on the presence of `error`.
         *
         * @param  {String} rawInput the payload as transmitted by the scanner
         * @return {Object}          the parsed elements, or an object holding an error code
         */
        function parse(rawInput) {
            var stripped, walked;

            if (!rawInput) {
                return failure(GS1_PARSE_ERROR.EMPTY_INPUT);
            }

            stripped = stripSymbologyIdentifier(String(rawInput));
            if (stripped.error) {
                return failure(stripped.error);
            }

            walked = walkElementString(normalizeGroupSeparators(stripped.payload));
            if (walked.error) {
                return failure(walked.error);
            }

            return buildResult(stripped.symbology, walked);
        }

        function stripSymbologyIdentifier(raw) {
            var identifiers = GS1_PARSE_CONFIG.symbologyIdentifiers,
                prefixes = Object.keys(identifiers),
                i, prefix;

            for (i = 0; i < prefixes.length; i++) {
                prefix = prefixes[i];
                if (raw.indexOf(prefix) === 0) {
                    return {
                        payload: raw.substring(prefix.length),
                        symbology: identifiers[prefix]
                    };
                }
            }

            if (GS1_PARSE_CONFIG.requireSymbologyIdentifier) {
                return failure(GS1_PARSE_ERROR.MISSING_SYMBOLOGY_IDENTIFIER);
            }

            return {
                payload: raw,
                symbology: undefined
            };
        }

        function normalizeGroupSeparators(payload) {
            return GS1_PARSE_CONFIG.groupSeparatorSubstitutes.reduce(function(result, substitute) {
                return result.split(substitute).join(GS1_PARSE_CONFIG.groupSeparator);
            }, payload);
        }

        function walkElementString(payload) {
            var state = {
                    cursor: 0,
                    values: {},
                    unparsed: {},
                    warnings: []
                },
                element;

            while (state.cursor < payload.length) {
                if (payload.charAt(state.cursor) === GS1_PARSE_CONFIG.groupSeparator) {
                    state.cursor = state.cursor + 1;
                    continue;
                }

                element = readElement(payload, state.cursor);
                if (element.error) {
                    return failure(element.error);
                }

                if (!applyElement(state, element)) {
                    return failure(GS1_PARSE_ERROR.DUPLICATE_APPLICATION_IDENTIFIER);
                }

                state.cursor = element.next;
            }

            if (isEmpty(state.values) && isEmpty(state.unparsed)) {
                return failure(GS1_PARSE_ERROR.NO_APPLICATION_IDENTIFIERS);
            }

            return state;
        }

        function applyElement(state, element) {
            if (element.field) {
                if (state.values[element.field] !== undefined) {
                    return false;
                }
                state.values[element.field] = element.value;
                return true;
            }

            if (state.unparsed[element.ai] !== undefined) {
                return false;
            }
            state.unparsed[element.ai] = element.value;

            if (element.warning) {
                state.warnings.push(element.warning);
            }

            return true;
        }

        function readElement(payload, cursor) {
            var known, predefined;

            if (!TWO_DIGITS.test(payload.substring(cursor, cursor + 2))) {
                return failure(GS1_PARSE_ERROR.MALFORMED_ELEMENT_STRING);
            }

            known = matchKnownIdentifier(payload, cursor);
            if (known) {
                return readKnownElement(payload, cursor, known);
            }

            predefined = predefinedLengths[payload.substring(cursor, cursor + 2)];
            if (predefined) {
                return readFixedLength(payload, cursor, {
                    aiLength: predefined.aiLength,
                    dataLength: predefined.dataLength,
                    field: undefined
                });
            }

            return readUnknownElement(payload, cursor);
        }

        function matchKnownIdentifier(payload, cursor) {
            var lengths = [4, 3, 2],
                i, candidate;

            for (i = 0; i < lengths.length; i++) {
                candidate = knownIdentifiers[payload.substring(cursor, cursor + lengths[i])];
                if (candidate) {
                    return candidate;
                }
            }

            return undefined;
        }

        function readKnownElement(payload, cursor, definition) {
            if (definition.length) {
                return readFixedLength(payload, cursor, {
                    aiLength: definition.ai.length,
                    dataLength: definition.length,
                    field: definition.field
                });
            }

            return readVariableLength(payload, cursor, {
                aiLength: definition.ai.length,
                maxLength: definition.maxLength,
                field: definition.field
            });
        }

        function readUnknownElement(payload, cursor) {
            var element = readVariableLength(payload, cursor, {
                aiLength: 2,
                maxLength: undefined,
                field: undefined
            });

            if (element.error) {
                return element;
            }

            element.warning = GS1_PARSE_WARNING.UNKNOWN_APPLICATION_IDENTIFIER;

            return element;
        }

        function readFixedLength(payload, cursor, spec) {
            var start = cursor + spec.aiLength,
                end = start + spec.dataLength,
                value = payload.substring(start, end);

            if (value.length < spec.dataLength) {
                return failure(GS1_PARSE_ERROR.TRUNCATED_ELEMENT_STRING);
            }

            return {
                ai: payload.substring(cursor, start),
                field: spec.field,
                value: value,
                next: end
            };
        }

        function readVariableLength(payload, cursor, spec) {
            var start = cursor + spec.aiLength,
                separator = payload.indexOf(GS1_PARSE_CONFIG.groupSeparator, start),
                end = separator === -1 ? payload.length : separator,
                value = payload.substring(start, end);

            if (!value.length) {
                return failure(GS1_PARSE_ERROR.TRUNCATED_ELEMENT_STRING);
            }

            if (spec.maxLength && value.length > spec.maxLength) {
                return failure(GS1_PARSE_ERROR.VALUE_TOO_LONG);
            }

            return {
                ai: payload.substring(cursor, start),
                field: spec.field,
                value: value,
                next: end
            };
        }

        function buildResult(symbology, walked) {
            var gtin = validateGtin(walked.values.gtin),
                lotCode = validateInvariantSet(walked.values.lotCode,
                    GS1_PARSE_ERROR.INVALID_LOT_CODE),
                serial = validateInvariantSet(walked.values.serial,
                    GS1_PARSE_ERROR.INVALID_SERIAL),
                expiry = parseExpirationDate(walked.values.expirationDate, walked.warnings),
                invalid = firstError([gtin, lotCode, serial, expiry]);

            if (invalid) {
                return failure(invalid);
            }

            return {
                symbology: symbology,
                gtin: gtin.value,
                lotCode: lotCode.value,
                expirationDate: expiry.value,
                serial: serial.value,
                unparsed: walked.unparsed,
                warnings: walked.warnings
            };
        }

        function validateGtin(raw) {
            if (raw === undefined) {
                return GS1_PARSE_CONFIG.requireGtin ? failure(GS1_PARSE_ERROR.MISSING_GTIN) : {};
            }

            if (!GTIN_14.test(raw)) {
                return failure(GS1_PARSE_ERROR.INVALID_GTIN);
            }

            if (GS1_PARSE_CONFIG.validateGtinCheckDigit && !hasValidCheckDigit(raw)) {
                return failure(GS1_PARSE_ERROR.INVALID_GTIN_CHECK_DIGIT);
            }

            return {
                value: raw
            };
        }

        function validateInvariantSet(raw, errorCode) {
            if (raw === undefined) {
                return {};
            }

            if (!CHARACTER_SET_82.test(raw)) {
                return failure(errorCode);
            }

            return {
                value: raw
            };
        }

        function parseExpirationDate(raw, warnings) {
            var year, month, day, lastDayOfMonth;

            if (raw === undefined) {
                return {};
            }

            if (!SIX_DIGITS.test(raw)) {
                return failure(GS1_PARSE_ERROR.INVALID_EXPIRATION_DATE);
            }

            year = resolveYear(parseInt(raw.substring(0, 2), 10));
            month = parseInt(raw.substring(2, 4), 10);
            day = parseInt(raw.substring(4, 6), 10);

            if (month < 1 || month > 12) {
                return failure(GS1_PARSE_ERROR.INVALID_EXPIRATION_DATE);
            }

            lastDayOfMonth = new Date(year, month, 0).getDate();
            if (day === 0) {
                warnings.push(GS1_PARSE_WARNING.EXPIRY_DAY_ASSUMED_END_OF_MONTH);
                day = lastDayOfMonth;
            }

            if (day > lastDayOfMonth) {
                return failure(GS1_PARSE_ERROR.INVALID_EXPIRATION_DATE);
            }

            return {
                value: new Date(year, month - 1, day)
            };
        }

        /**
         * Applies the GS1 century rule for two digit years: a year more than 50 years ahead of the
         * current one belongs to the previous century, one more than 49 years behind it to the next.
         * A fixed pivot would silently start mis-dating lots as the pivot year approached.
         */
        function resolveYear(twoDigitYear) {
            var currentYear = new Date().getFullYear(),
                century = Math.floor(currentYear / 100) * 100,
                difference = twoDigitYear - currentYear % 100;

            if (difference >= 51 && difference <= 99) {
                return century - 100 + twoDigitYear;
            }

            if (difference >= -99 && difference <= -50) {
                return century + 100 + twoDigitYear;
            }

            return century + twoDigitYear;
        }

        function hasValidCheckDigit(gtin) {
            var lastIndex = gtin.length - 1,
                sum = 0,
                i, weight;

            for (i = 0; i < lastIndex; i++) {
                weight = (lastIndex - i) % 2 === 1 ? 3 : 1;
                sum = sum + parseInt(gtin.charAt(i), 10) * weight;
            }

            return (10 - sum % 10) % 10 === parseInt(gtin.charAt(lastIndex), 10);
        }

        function indexKnownIdentifiers() {
            var index = {};

            GS1_APPLICATION_IDENTIFIERS.parsed.forEach(function(definition) {
                index[definition.ai] = definition;
            });

            return index;
        }

        function indexPredefinedLengths() {
            var index = {};

            GS1_APPLICATION_IDENTIFIERS.predefinedLengths.forEach(function(group) {
                group.prefixes.forEach(function(prefix) {
                    index[prefix] = group;
                });
            });

            return index;
        }

        function firstError(results) {
            var failed = results.filter(function(result) {
                return result.error;
            });

            return failed.length ? failed[0].error : undefined;
        }

        function isEmpty(object) {
            return Object.keys(object).length === 0;
        }

        function failure(code) {
            return {
                error: code
            };
        }
    }

})();
