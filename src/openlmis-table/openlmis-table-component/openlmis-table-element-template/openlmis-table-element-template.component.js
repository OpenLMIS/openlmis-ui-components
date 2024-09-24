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
     * @name openlmis-table.component:openlmisTableElementTemplate
     *
     * @description
     * Component responsible for rendering a content inside the <td> element
     *
     * @param {TableElementConfig} elementConfig - holds table element config properties
     *
     * @typedef TableElementConfig
     * @property {any} value - value of the item[propertyPath], used when a template is not passed
     * @property {string|function} template - optional property which specifies how item should
     *  displayed. More about template in 'openlmis-table.component.js'
     * @property {Object} item - single element from data array that is displayed in table row
     * of this cell
    */
    angular
        .module('openlmis-table')
        .component('openlmisTableElementTemplate', {
            templateUrl: 'openlmis-table/openlmis-table-component' +
                '/openlmis-table-element-template/openlmis-table-element-template.html',
            bindings: {
                elementConfig: '<?'
            },
            controller: 'openlmisTableElementTemplateController',
            controllerAs: '$ctrl'
        });
})();
