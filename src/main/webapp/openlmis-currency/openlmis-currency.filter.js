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
     * @ngdoc filter
     * @name openlmis-currency.filter:openlmisCurrency
     *
     * @description
     * Parses the given currency into more readable form. Depending on whether the settings from
     * referencedata are set it will parse the currency respectively.
     *
     * @param  {Number} value the currency to be formated
     * @return {String}       the formated currency
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
                    return formatMoney(value, settings) + '\u00A0' + settings.currencySymbol;
                } else {
                    return settings.currencySymbol + formatMoney(value, settings);
                 }
            }
        };

        function formatMoney(value, settings) {
            var re = '\\d(?=(\\d{' + settings.groupingSize + '})+\\b)',
                num = value.toFixed(settings.currencyDecimalPlaces);

            return num.replace('.', settings.decimalSeparator)
                      .replace(new RegExp(re, 'g'), '$&' + settings.groupingSeparator);
        }
    }

})();
