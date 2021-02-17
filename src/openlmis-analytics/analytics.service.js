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
     * @name openlmis-analytics.analyticsService
     *
     * @description
     * Wraps the Google Analytics object, and initializes the object with the
     * UA tracking code.
     */
    angular.module('openlmis-analytics')
        .service('analyticsService', service);

    service.$inject = ['$window', 'offlineService', 'localStorageFactory', '$rootScope'];

    function service($window, offlineService, localStorageFactory, $rootScope) {
        var ga = $window.ga,
            gaEventsOfflineStorage = localStorageFactory('googleAnalytics');

        this.track = track;

        ga('create', '@@ANALYTICS_TRACKING_ID', 'auto');

        applyGAStoredEvents();
        $rootScope.$on('openlmis.online', applyGAStoredEvents);

        /**
         * @ngdoc method
         * @methodOf openlmis-analytics.analyticsService
         * @name track
         *
         * @description
         * Can take any number of arguments and passes them directly to Google Analytics.
         */
        function track() {
            if (offlineService.isOffline()) {
                gaEventsOfflineStorage.put({
                    arguments: arguments,
                    gaParameters: getGAParameters()
                });
            } else {
                ga.apply(this, arguments);
            }
        }

        function applyGAStoredEvents() {

            var service = this,
                gaParameters = getGAParameters();

            angular.forEach(gaEventsOfflineStorage.getAll(), function(storedEvent) {

                var argumentArray = [];
                angular.forEach(storedEvent.arguments, function(argument) {
                    argumentArray.push(argument);
                });

                setGAParameters(storedEvent.gaParameters, true);

                ga.apply(service, argumentArray);
            });
            gaEventsOfflineStorage.clearAll();

            setGAParameters(gaParameters);
        }

        function getGAParameters() {
            return {
                screenResolution: ga.P[0].model.data.ea[':screenResolution'],
                viewportSize: ga.P[0].model.data.ea[':viewportSize'],
                language: ga.P[0].model.data.ea[':language'],
                time: Date.now()
            };
        }

        function setGAParameters(parameters, setQueueTime) {
            ga('set', 'screenResolution', parameters.screenResolution);
            ga('set', 'viewportSize', parameters.viewportSize);
            ga('set', 'language', parameters.language);
            if (setQueueTime) {
                ga('set', 'queueTime', Date.now() - new Date(parameters.time));
            } else {
                ga('set', 'queueTime', 0);
            }
        }
    }

})();
