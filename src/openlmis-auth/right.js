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
     * @name openlmis-auth.Right
     *
     * @description
     * Represents a single right along with related programs, warehouses and supervisory nodes.
     */
    angular
        .module('openlmis-auth')
        .factory('Right', factory);

    factory.$inject = [];

    function factory() {

        Right.buildRights = buildRights;

        return Right;

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.Right
         * @name Right
         *
         * @description
         * Creates a Right class object.
         *
         * @param {String} id         the id of the Right
         * @param {String} name       the name of the Right
         * @param {Array}  programs   the list of related programs
         * @param {Array}  facilities the list of related warehouses
         * @param {Array}  nodes      the list of related supervisory nodes
         */
        function Right(id, name, programCodes, programIds, warehouseCodes, warehouseIds, nodeCodes, nodeIds, isDirect) {
            this.id = id;
            this.name = name;
            this.programCodes = programCodes;
            this.programIds = programIds
            this.warehouseCodes = warehouseCodes;
            this.warehouseIds = warehouseIds;
            this.supervisoryNodeCodes = nodeCodes;
            this.supervisoryNodeIds = nodeIds;
            this.isDirect = isDirect;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.Right
         * @name buildRights
         *
         * @description
         * Builds a list or rights from the given list of role assignments.
         *
         * @param  {Array} assignments the list of role assignments
         * @return {Array}             the list of user rights
         */
        function buildRights(assignments) {
            var rights = {};

            assignments.forEach(function(assignment) {
                assignment.role.rights.forEach(function(rightObj) {
                    var name = rightObj.name;

                    var right;
                    if (!rights[name]) {
                        right = {
                            id: rightObj.id,
                            programCode: [],
                            programId: [],
                            warehouseCode: [],
                            warehouseId: [],
                            supervisoryNodeCode: [],
                            supervisoryNodeId: []
                        };
                        rights[name] = right;
                    } else {
                        right = rights[name];
                    }

                    var isDirect = true;

                    [
                        'programCode', 'programId',
                        'warehouseCode', 'warehouseId',
                        'supervisoryNodeCode', 'supervisoryNodeId'
                    ]
                    .forEach(function(field) {
                        var fieldValue = assignment[field];
                        if (fieldValue) {
                            if (right[field].indexOf(fieldValue) === -1) {
                                right[field].push(fieldValue);
                            }
                            isDirect = false;
                        }
                    });

                    if (isDirect) {
                        right.isDirect = true;
                    }
                });
            });

            return toRightList(rights);
        }

        function toRightList(rights) {
            var rightList = [];
            for (var right in rights) {
                rightList.push(new Right(
                    rights[right].id,
                    right,
                    rights[right].programCode,
                    rights[right].programId,
                    rights[right].warehouseCode,
                    rights[right].warehouseId,
                    rights[right].supervisoryNodeCode,
                    rights[right].supervisoryNodeId,
                    rights[right].isDirect
                ));
            }
            return rightList;
        }

    }

})();
