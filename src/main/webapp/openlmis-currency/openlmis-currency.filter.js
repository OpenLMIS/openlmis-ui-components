/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */

(function() {

    'use strict';

    /**
     * @ngdoc filter
     * @name openlmis-date.period
     *
     * @description
     * Parses the given currency into more readable form. Depending on whether the settings from
     * referencedata are set it will parse the currency respectively.
     *
     * @param   {integer}    value      the currency to be formated
     *
     * @return  {String}                the formated currency
     */
    angular
        .module('openlmis-currency')
        .filter('openlmisCurrency', filter);

    filter.$inject = ['currencyService'];

    function filter (currencyService) {
        return function (value) {
            if (value != null) {
                var settings = currencyService.getFromStorage();
                if (settings.currencySymbolSide === 'right') {
                    return formatMoneyValue(value, settings) + '\u00A0' + settings.currencySymbol;
                } else {
                    return settings.currencySymbol + formatMoneyValue(value, settings);
                 }
            }
        };

        function formatMoneyValue (value, settings) {
            var number = parseFloat(value).toFixed(settings.currencyDecimalPlaces),
                integerPart = parseInt(number) + '',
                integerPartLength = integerPart.length,
                firstGroupLength = integerPartLength > settings.groupingSize
                    ? integerPartLength % settings.groupingSize
                    : 0;

            return firstGroup() + otherGroups() + fractionPart();

            function firstGroup () {
                return firstGroupLength ? integerPart.substr(0, firstGroupLength) + settings.groupingSeparator : '';
            }

            function otherGroups () {
                var extractGroupRegExp = new RegExp('(\\d{' + settings.groupingSize + '})(?=\\d)', 'g');

                return integerPart.substr(firstGroupLength)
                    .replace(extractGroupRegExp, '$1' + settings.groupingSeparator);
            }

            function fractionPart () {
                var extractedFractions = Math.abs(number - integerPart)
                    .toFixed(settings.currencyDecimalPlaces).slice(2);

                return settings.currencyDecimalPlaces ? settings.decimalSeparator + extractedFractions : '';
            }
        }
    }

})();
