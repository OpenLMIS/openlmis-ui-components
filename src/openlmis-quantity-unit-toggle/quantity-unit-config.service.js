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
     * @name openlmis-quantity-unit-toggle.quantityUnitConfigService
     *
     * @description
     * Holds the current quantity unit display mode (PACKS, DOSES or BOTH). The mode defaults to the
     * build-time ${QUANTITY_UNIT_OPTION} placeholder, but may be overridden at runtime (e.g. from the
     * current user's home facility configuration) via setMode.
     */
    angular
        .module('openlmis-quantity-unit-toggle')
        .service('quantityUnitConfigService', service);

    service.$inject = ['QUANTITY_UNIT', 'localStorageService'];

    function service(QUANTITY_UNIT, localStorageService) {

        var QUANTITY_UNIT_KEY = 'quantityUnit';
        var VALID_MODES = [QUANTITY_UNIT.PACKS, QUANTITY_UNIT.DOSES, QUANTITY_UNIT.BOTH];
        var VALID_UNITS = [QUANTITY_UNIT.PACKS, QUANTITY_UNIT.DOSES];

        var defaultMode = toValid(VALID_MODES, '${QUANTITY_UNIT_OPTION}', QUANTITY_UNIT.BOTH);
        var defaultUnit = toValid(VALID_UNITS, '${DEFAULT_QUANTITY_UNIT}', QUANTITY_UNIT.DOSES);
        var mode = defaultMode;

        this.getMode = getMode;
        this.getEffectiveUnit = getEffectiveUnit;
        this.setSelectedUnit = setSelectedUnit;
        this.setMode = setMode;
        this.resetMode = resetMode;

        /**
         * @ngdoc method
         * @methodOf openlmis-quantity-unit-toggle.quantityUnitConfigService
         * @name getMode
         *
         * @description
         * Returns the current display mode (PACKS, DOSES or BOTH).
         */
        function getMode() {
            return mode;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-quantity-unit-toggle.quantityUnitConfigService
         * @name getEffectiveUnit
         *
         * @description
         * Resolves the unit (PACKS or DOSES) that should currently be displayed. When the facility
         * mode forces a single unit it is returned and any cached user choice is ignored; when the
         * mode is BOTH the user's last choice from local storage is used, falling back to the
         * default unit. This is the single source of truth for all consumers.
         *
         * @return {String}  PACKS or DOSES
         */
        function getEffectiveUnit() {
            if (mode !== QUANTITY_UNIT.BOTH) {
                return mode;
            }

            var cachedQuantityUnit = localStorageService.get(QUANTITY_UNIT_KEY);
            return cachedQuantityUnit === null ? defaultUnit : cachedQuantityUnit;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-quantity-unit-toggle.quantityUnitConfigService
         * @name setSelectedUnit
         *
         * @description
         * Persists the unit the user selected on the toggle so it becomes their default on the next
         * page. Only meaningful while the mode is BOTH.
         *
         * @param {String} unit PACKS or DOSES
         */
        function setSelectedUnit(unit) {
            if (VALID_UNITS.indexOf(unit) !== -1) {
                localStorageService.add(QUANTITY_UNIT_KEY, unit);
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-quantity-unit-toggle.quantityUnitConfigService
         * @name setMode
         *
         * @description
         * Overrides the display mode. Invalid values are ignored so a misconfigured facility cannot
         * break the toggle.
         *
         * @param {String} newMode one of PACKS, DOSES, BOTH
         */
        function setMode(newMode) {
            if (VALID_MODES.indexOf(newMode) !== -1) {
                mode = newMode;
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-quantity-unit-toggle.quantityUnitConfigService
         * @name resetMode
         *
         * @description
         * Resets the mode back to the build-time default. Called at the start of each post-login
         * flow (and on logout) so a user without facility-level configuration does not inherit the
         * previous user's facility mode.
         */
        function resetMode() {
            mode = defaultMode;
        }

        function toValid(allowed, value, fallback) {
            return allowed.indexOf(value) === -1 ? fallback : value;
        }
    }
})();
