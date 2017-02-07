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

    function filter(currencyService) {
        return function(value) {
            if (value != null) {
                var settings = currencyService.getFromStorage();
                if (settings.currencySymbolSide === 'right') {
                    return formatValue(value, settings) + '\u00A0' + settings.currencySymbol;
                } else {
                    return settings.currencySymbol + formatValue(value, settings);
                 }
            }
        };

        function formatValue(value, settings) {
            var separator = settings.groupingSeparator,
                decimalPlaces = settings.currencyDecimalPlaces,
                groupingSize = settings.groupingSize,
                number = parseFloat(value),
                i = parseInt(number = number.toFixed(decimalPlaces)) + '',
                j = (j = i.length) > groupingSize ? j % groupingSize : 0,
                regExp = new RegExp('(\\d{' + groupingSize + '})(?=\\d)', 'g');

            return (j ? i.substr(0, j) + separator : '')
                + i.substr(j).replace(regExp, '$1' + separator)
                + (decimalPlaces
                    ? settings.decimalSeparator + Math.abs(number - i)
                        .toFixed(decimalPlaces).slice(2)
                    : "");
        }
    }

})();
