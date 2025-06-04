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

    angular
        .module('openlmis-quantity-unit-toggle')
        .run(setDefaultQuantityUnit);

    setDefaultQuantityUnit.$inject = ['featureFlagService', 'DEFAULT_QUANTITY_UNIT_FEATURE_FLAG', 'QUANTITY_UNIT'];

    /**
     * @ngdoc function
     * @name openlmis-quantity-unit-toggle.run:setDefaultQuantityUnit
     * 
     * @description
     * This function sets the feature flag for the default quantity unit.
     * It initializes the feature flag with a default value of 'DOSES'.
     */
    function setDefaultQuantityUnit(featureFlagService, DEFAULT_QUANTITY_UNIT_FEATURE_FLAG, QUANTITY_UNIT) {
        featureFlagService.set(DEFAULT_QUANTITY_UNIT_FEATURE_FLAG, '${DEFAULT_QUANTITY_UNIT}', QUANTITY_UNIT.DOSES);
    }
})();