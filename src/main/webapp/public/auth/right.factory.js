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
         * @ngdoc function
         * @methodOf openlmis-auth.Right
         * @name constructor
         *
         * @description
         * Creates a Right class object.
         *
         * @param {String}  name        the name of the Right
         * @param {Array}   programs    the list of related programs
         * @param {Array}   facilities  the list of related warehouses
         * @param {Array}   nodes       the list of related supervisory nodes
         */
        function Right(name, programs, facilities, nodes, isDirect) {
            this.name = name;
            this.programs = programs;
            this.facilities = facilities;
            this.nodes = nodes;
            this.isDirect = isDirect;
        }

        /**
         * @ngdoc methodOf
         * @methodOf openlmis-auth.Right
         * @name buildRights
         *
         * @description
         * Builds a list or rights from the given list of role assignments.
         *
         * @param  {Array}  assignments the list of role assignments
         * @return {Array}              the list of user rights
         */
        function buildRights(assignments) {
            var rights = {};

            assignments.forEach(function(assignment) {
                assignment.role.rights.forEach(function(rightObj) {
                    var name = rightObj.name;

                    var right;
                    if (!rights[name]) {
                        right = {
                            programCode: [],
                            warehouseCode: [],
                            supervisoryNodeCode: []
                        };
                        rights[name] = right;
                    } else {
                        right = rights[name];
                    }

                    var isDirect = true;

                    ['programCode', 'warehouseCode', 'supervisoryNodeCode']
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
                    right,
                    rights[right].programCode,
                    rights[right].warehouseCode,
                    rights[right].supervisoryNodeCode,
                    rights[right].isDirect
                ));
            }
            return rightList;
        }

    }

})();
