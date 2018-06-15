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
     * @name openlmis-feature-flag.featureFlagService
     *
     * @description
     * Allows to get current status of feature flag.
     */
    angular
        .module('openlmis-feature-flag')
        .service('featureFlagService', featureFlagService);

    function featureFlagService() {

        var featureFlags = {};

        this.get = get;
        this.set = set;

        /**
         * @ngdoc method
         * @methodOf admin-template-configure-columns.requisitionTemplateService
         * @name get
         *
         * @description
         * Returns true if feature flag is turned on, false otherwise. If there is 
         *
         * @param  {String}  name feature flag name
         * @return {boolean}      current status of feature flag.
         */
        function get(name) {
            if (!featureFlags.hasOwnProperty(name)) {
                console.warn('There is no feature flag with name ' + name);
                return undefined;
            }
            return featureFlags[name];
        }

        /**
         * @ngdoc method
         * @methodOf admin-template-configure-columns.requisitionTemplateService
         * @name set
         *
         * @description
         * Sets 
         *
         * @param {String}  name         feature flag name
         * @param {String}  value        value retrieved from environment variable
         * @param {boolean} defaultValue current status of feature flag
         */
        function set(name, value, defaultValue) {
            featureFlags[name] = getValue(value, defaultValue);
        }

        function getValue(value, defaultValue) {
            if (value === 'true') {
                return true;
            } else if (value === 'false') {
                return false;
            }
            return defaultValue;
        }
    }
})();
