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
     * @name openlmis-table:openlmisTableService
     *
     * @description
     * Responsible for managing the table elements configuration
     */
    angular
        .module('openlmis-table')
        .service('openlmisTableService', openlmisTableService);

    openlmisTableService.$inject = [];

    function openlmisTableService() {
        return {
            getElementsConfiguration: getElementsConfiguration,
            getElementPropertyValue: getElementPropertyValue,
            setColumnsDefaults: setColumnsDefaults,
            getHeadersConfiguration: getHeadersConfiguration
        };

        function getElementsConfiguration(tableConfig) {
            var elementsConfiguration = [];
            if (tableConfig.data) {
                tableConfig.data.forEach(function(item) {
                    elementsConfiguration.push(getSingleRowConfig(tableConfig.columns, item));
                });
            }
            return elementsConfiguration;
        }

        function getHeadersConfiguration(columns) {
            var usedHeaders = [];

            return columns.map(function(column) {
                var alreadyUsed = usedHeaders.includes(column.header);
                usedHeaders.push(column.header);

                return {
                    text: column.header,
                    template: column.headerTemplate,
                    isDisplayed: !alreadyUsed
                };
            });
        }

        function getSingleRowConfig(tableColumns, item) {
            return tableColumns.map(function(column) {
                return {
                    value: getElementPropertyValue(item, column.propertyPath),
                    template: column.template,
                    item: item,
                    displayCell: column.displayColumn ? column.displayColumn(item) : true
                };
            });
        }

        function setColumnsDefaults(columns) {
            columns.forEach(function(column) {
                var defaultPopover = {
                    template: '',
                    text: ''
                };

                column.popover = column.popover ? column.popover : defaultPopover;
            });
        }

        function getElementPropertyValue(obj, propertyPath) {
            if (!obj || !propertyPath) {
                return undefined;
            }

            var keys = propertyPath.split('.');
            var value = obj;
            for (var i = 0; i < keys.length; i++) {
                if (value === undefined || value === null) {
                    return undefined;
                }
                value = value[keys[i]];
            }
            return value;
        }
    }
})();
