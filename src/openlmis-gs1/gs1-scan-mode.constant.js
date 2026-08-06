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
     * @ngdoc object
     * @name openlmis-gs1.GS1_SCAN_MODE
     *
     * @description
     * The workflows the scan input can be wired into. The component behaves identically in every
     * mode and just passes it through, so the handler can apply workflow policy - whether an
     * unknown lot may be created, for instance.
     *
     * Adding a workflow is an entry here plus handling in the consuming service. Kit unpack is left
     * out on purpose - unpacking changes which product exists, so tallying a scanned line is not the
     * same operation.
     */
    angular
        .module('openlmis-gs1')
        .constant('GS1_SCAN_MODE', {
            ISSUE: 'ISSUE',
            RECEIVE: 'RECEIVE',
            PHYSICAL_INVENTORY: 'PHYSICAL_INVENTORY',
            ADJUSTMENT: 'ADJUSTMENT'
        });

})();
