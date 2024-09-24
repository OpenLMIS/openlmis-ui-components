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
     * @ngdoc component
     * @name openlmis-table.component:openlmisTableActions
     *
     * @description
     * Component responsible for rendering an 'actions' column of the table
     *
     * @param {Array<ActionConfig>} actionsConfig - holds config for all action that should be displayed
     *  structure of 'ActionConfig' is described in openlmis-table.component.js
     * @param {Object} item - single element from data array that is displayed in table row
     * where this actions cell is placed
    */
    angular
        .module('openlmis-table')
        .component('openlmisTableActions', {
            templateUrl: 'openlmis-table/openlmis-table-component/openlmis-table-actions/openlmis-table-actions.html',
            bindings: {
                actionsConfig: '<?',
                item: '<?'
            },
            controllerAs: '$ctrl'
        });
})();
