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
     * @name openlmis.requisitions.templateFactory
     *
     * @description
     * Comunicates with templateDataService.
     *
     */
    angular.module('openlmis.requisitions').factory('templateFactory', templateFactory);

    templateFactory.$inject = ['$q', 'RequisitionTemplateService', 'RequisitionColumn', 'Source'];

    function templateFactory($q, RequisitionTemplateService, RequisitionColumn, Source) {

        var factory = {
            get: get,
            getAll: getAll,
            getByProgram: getByProgram
        };

        return factory;

        /**
         * @ngdoc function
         * @name  get
         * @methodOf openlmis.requisitions.templateFactory
         * @param {String} id Template UUID
         * @returns {Promise} Template
         *
         * @description
         * Gets requisition template by id and adds validation and column sorting methods.
         */
        function get(id) {
            var deferred = $q.defer();
            RequisitionTemplateService.get(id).then(function(template) {
                template.$save = save;
                template.$isValid = isTemplateValid;
                template.$moveColumn = moveColumn;
                addDependentColumnValidation(template.columnsMap);
                deferred.resolve(template);
            }, function() {
                deferred.reject();
            });
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name  getAll
         * @methodOf openlmis.requisitions.templateFactory
         * @returns {Promise} Array of requisition templates
         *
         * @description
         * Gets all requisition templates from templateDataService.
         */
        function getAll() {
            return RequisitionTemplateService.getAll();
        }

        /**
         * @ngdoc function
         * @name  getByProgram
         * @methodOf openlmis.requisitions.templateFactory
         * @param {String} programId Program UUID
         * @return {Promise} Template for given program
         *
         * @description
         * Gets requisition template for given program UUID.
         */
        function getByProgram(programId) {
            return RequisitionTemplateService.search(programId);
        }


        // Saves template
        function save() {
            return RequisitionTemplateService.save(this);
        }

        // Creates a array with dependent column names.
        function addDependentColumnValidation(columns) {
            angular.forEach(columns, function(column) {
                var dependencies = RequisitionColumn.columnDependencies(column);
                if(dependencies && dependencies.length > 0) {
                    angular.forEach(dependencies, function(dependency) {
                        if(!columns[dependency].$dependentOn) columns[dependency].$dependentOn = [];
                        columns[dependency].$dependentOn.push(column.name);
                    });
                }
                column.$isValid = isColumnValid;
            });
        }

        // Cheks if all columns in template are valid.
        function isTemplateValid() {
            var valid = true,
                template = this;

            angular.forEach(template.columnsMap, function(column) {
                if(!column.$isValid(template.columnsMap)) valid = false;
            });

            return valid;
        }

        // Checks if column is valid.
        // Column is not valid when isn't displayed, but at least one is dependent column is displayed.
        function isColumnValid(columns) {
            var valid = true,
                column = this;

            if(column.source === undefined || column.source === null  || column.source === '') return false;
            if(!column.isDisplayed && column.source === Source.USER_INPUT && column.columnDefinition.sources.length > 1) return false;
            if(column.$dependentOn && column.$dependentOn.length > 0) {
                angular.forEach(column.$dependentOn, function(columnName) {
                    if(columns[columnName] && isVolumnInvalid(column, columns[columnName])) valid = false;
                });
            }

            return valid;
        }

        function isVolumnInvalid(column, dependentColumn) {
            return (dependentColumn.isDisplayed && !column.isDisplayed && column.source === Source.USER_INPUT) ||
                    (column.source === Source.CALCULATED && dependentColumn.source === Source.CALCULATED);
        }

        // Checks if column can be dropped in area and if so,
        // changes display order of columns beetwen old and new position of dropped column.
        function moveColumn(droppedItem, dropSpotIndex) {
            var maxNumber = 999999999999999,
                pinnedColumns = [], // columns that position can't be changed
                columns = [],       // all columns
                newDisplayOrder,
                min,                // the lowest column displayOrder value in droppable area
                max,                // the highest column displayOrder value in droppable area
                isMovingUpTheList;  // indicates if column is going down or up the list

            convertListToArray(this.columnsMap);
            isMovingUpTheList = getArrayIndexForColumn(droppedItem) > dropSpotIndex;

            if(isMovingUpTheList) newDisplayOrder = columns[dropSpotIndex].displayOrder;    // new displayOrder value depends on if column was dropped below or above
            else newDisplayOrder = columns[dropSpotIndex - 1].displayOrder;

            setMinMaxDisplayOrder(droppedItem.displayOrder);

            if(isInDroppableArea(newDisplayOrder) && droppedItem.columnDefinition.canChangeOrder) {
                angular.forEach(columns, function(column) {
                    if(isInDroppableArea(column.displayOrder) && column.columnDefinition.canChangeOrder) {
                        if(droppedItem.name === column.name) column.displayOrder = newDisplayOrder; // setting new displayOrder for dropped column
                        else if(isMovingUpTheList && column.displayOrder >= newDisplayOrder && column.displayOrder < droppedItem.displayOrder) column.displayOrder++;  // columns beetwen old and new postion must be
                        else if(column.displayOrder <= newDisplayOrder && column.displayOrder > droppedItem.displayOrder) column.displayOrder--;                       // incremented or decremented
                    }
                });
                return true;
            } else {
                return false;
            }

            // Converts list of columns to array, copies "pinned" columns to another array and sorts both.
            function convertListToArray(list) {
                angular.forEach(list, function(column) {
                    if(!column.columnDefinition.canChangeOrder) pinnedColumns.push(column);
                    columns.push(column);
                });

                pinnedColumns.sort(sort)
                columns.sort(sort);
            };

            // Sorting function for column arrays
            function sort(a, b) {
                a = parseInt(a['displayOrder']);
                b = parseInt(b['displayOrder']);
                return a - b;
            }

            // Returns current index in array of gien column.
            function getArrayIndexForColumn(column) {
                var index
                angular.forEach(columns, function(item, idx) {
                    if(column.name === item.name) index = idx;
                });
                return index;
            }

            // Sets min and max diplay order value.
            // In other words it tells you beetwen which "pinned" columns was our dropped column located.
            // This column can be dropped only in this area.
            function setMinMaxDisplayOrder(displayOrder) {
                min = 0;
                max = undefined;
                angular.forEach(pinnedColumns, function(pinnedColumn) {
                    if(displayOrder > pinnedColumn.displayOrder) min = pinnedColumn.displayOrder;
                    if(!max && displayOrder < pinnedColumn.displayOrder) max = pinnedColumn.displayOrder;
                });
                if(!max) max = maxNumber;
            }

            // Based on mix and max from function above checks if column was dropped in proper area
            function isInDroppableArea(displayOrder) {
                return displayOrder > min && displayOrder < max;
            }
        }
    }

})();
