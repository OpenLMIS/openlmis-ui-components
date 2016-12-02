(function() {

    'use strict';

    angular
        .module('openlmis-auth')
        .factory('Right', factory);

    factory.$inject = [];

    function factory() {

        Right.buildRights = buildRights;

        return Right;

        function Right(name, programs, facilities, nodes) {
            this.name = name;
            this.programs = programs;
            this.facilities = facilities;
            this.nodes = nodes;
        }

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
                            }
                            isDirect = false;
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
                    rights[right].supervisoryNodeCode
                ));
            }
            return rightList;
        }

    }

})();
