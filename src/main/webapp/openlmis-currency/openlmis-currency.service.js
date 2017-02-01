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
     * @ngdoc service
     * @name openlmis-currency.currencyService
     *
     * @description
     * Responsible for retrieving currency settings from server.
     */
    angular
        .module('openlmis-currency')
        .service('currencyService', service);

    service.$inject = [
        '$q', '$resource', 'referencedataUrlFactory', 'localStorageService', 'offlineService'
    ];

    function service($q, $resource, referencedataUrlFactory, localStorageService) {

        var resource = $resource(referencedataUrlFactory('/api/currencySettings'));

        this.getFromStorage = getFromStorage;
        this.getCurrencySettings = getCurrencySettings;

        /**
         * @ngdoc function
         * @name getCurrencySettings
         * @methodOf openlmis-currency.currencyService
         *
         * @description
         * Retrieves currency settings from reference data.
         *
         * @return {Promise} promise that resolves when settings are taken.
         */
        function getCurrencySettings() {
                var deferred = $q.defer(), currencySettings = {};

                resource.get({}, function(data) {
                    currencySettings['currencyCode'] = data.currencyCode;
                    currencySettings['currencySymbol'] = data.currencySymbol;
                    currencySettings['currencySymbolSide'] = data.currencySymbolSide;
                    currencySettings['currencyDecimalPlaces'] = data.currencyDecimalPlaces;
                    localStorageService.add('currencySettings', angular.toJson(currencySettings));
                    deferred.resolve();
                }, function() {
                    deferred.reject();
                });

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name get
         * @methodOf openlmis-currency.currencyService
         *
         * @description
         * Retrieves currency settings from local storage.
         *
         * @return {Object} currency settings.
         */
        function getFromStorage() {
            var currencySettings = localStorageService.get('currencySettings');

            return angular.fromJson(currencySettings);
        }
    }
})();
