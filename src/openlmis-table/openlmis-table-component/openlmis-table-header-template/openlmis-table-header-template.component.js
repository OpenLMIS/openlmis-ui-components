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
     * @name openlmis-table.component:openlmisTableHeaderTemplate
     *
     * @description
     * Component responsible for rendering a content inside the <th> element
     *
     * @param {TableHeaderConfig} headerConfig - holds table header config properties
     *
     * @typedef TableHeaderConfig
     * @property {any} value - value of the item[propertyPath], used when a template is not passed
     * @property {string|function} template - optional property which specifies how item should
     *  displayed. More about template in 'openlmis-table.component.js'
    */
    angular
        .module('openlmis-table')
        .component('openlmisTableHeaderTemplate', {
            templateUrl: 'openlmis-table/openlmis-table-component' +
                '/openlmis-table-header-template/openlmis-table-header-template.html',
            bindings: {
                headerConfig: '<?'
            },
            controller: 'openlmisTableHeaderTemplateController',
            controllerAs: '$ctrl'
        });
})();
