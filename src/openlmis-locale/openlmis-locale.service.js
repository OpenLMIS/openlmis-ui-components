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
     * @name openlmis-locale.localeService
     *
     * @description
     * Responsible for retrieving locale settings from server.
     */
    angular
        .module('openlmis-locale')
        .service('localeService', service);

    service.$inject = ['$resource', 'openlmisUrlFactory', 'localStorageService'];

    function service($resource, openlmisUrlFactory, localStorageService) {

        var resource = $resource(openlmisUrlFactory('/localeSettings'));

        this.getFromStorage = getFromStorage;
        this.getLocaleSettings = getLocaleSettings;
        this.getLocaleSettingsFromConfig = getLocaleSettingsFromConfig;

        /**
         * @ngdoc method
         * @methodOf openlmis-locale.localeService
         * @name getLocaleSettings
         *
         * @description
         * Retrieves locale settings from reference data.
         *
         * @return {Promise} promise that resolves when settings are taken.
         */
        function getLocaleSettings() {
            var localeSettings = {};

            return resource.get({}).$promise.then(function(data) {
                localeSettings['currencyCode'] = data.currencyCode;
                localeSettings['currencySymbol'] = data.currencySymbol;
                localeSettings['currencySymbolSide'] = data.currencySymbolSide;
                localeSettings['currencyDecimalPlaces'] = data.currencyDecimalPlaces;
                localeSettings['groupingSeparator'] = data.groupingSeparator;
                localeSettings['groupingSize'] = data.groupingSize;
                localeSettings['decimalSeparator'] = data.decimalSeparator;
                localeSettings['timeZoneId'] = data.timeZoneId;
                localeSettings['dateFormat'] = data.dateFormat;
                localeSettings['dateTimeFormat'] = data.dateTimeFormat;
                localStorageService.add('localeSettings', angular.toJson(localeSettings));
            })
                .catch(getLocaleSettingsFromConfig);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-locale.localeService
         * @name getLocaleSettingsFromConfig
         *
         * @description
         * Retrieves locale settings from config file.
         */
        function getLocaleSettingsFromConfig() {
            var localeSettings = {};

            localeSettings['currencyCode'] = '@@CURRENCY_CODE';
            localeSettings['currencySymbol'] = '@@CURRENCY_SYMBOL';
            localeSettings['currencySymbolSide'] = '@@CURRENCY_SYMBOL_SIDE';
            localeSettings['currencyDecimalPlaces'] = parseInt('@@CURRENCY_DECIMAL_PLACES');
            localeSettings['groupingSeparator'] = '@@GROUPING_SEPARATOR';
            localeSettings['groupingSize'] = parseInt('@@GROUPING_SIZE');
            localeSettings['decimalSeparator'] = '@@DECIMAL_SEPARATOR';
            localeSettings['timeZoneId'] = 'UTC';
            localeSettings['dateFormat'] = '@@DEFAULT_DATE_FORMAT';
            localeSettings['dateTimeFormat'] = '@@DEFAULT_DATETIME_FORMAT';
            localStorageService.add('localeSettings', angular.toJson(localeSettings));
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-locale.localeService
         * @name getFromStorage
         *
         * @description
         * Retrieves locale settings from the local storage.
         *
         * @return {Object} locale settings.
         */
        function getFromStorage() {
            var localeSettings = localStorageService.get('localeSettings');
            if (!localeSettings) {
                getLocaleSettingsFromConfig();
            }
            return angular.fromJson(localStorageService.get('localeSettings'));
        }
    }

})();
