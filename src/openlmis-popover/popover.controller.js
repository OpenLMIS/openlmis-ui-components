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

    angular.module('openlmis-popover')
        .controller('OpenlmisPopoverController', controller);

    controller.$inject = [];
    function controller() {
        var vm = this,
            elements = {};

        vm.getElements = getElements;
        vm.addElement = addElement;
        vm.removeElement = removeElement;

        function getElements() {
            var keys = Object.keys(elements);
            keys = keys.sort(function(a, b) {
                if (elements[a].priority === elements[b].priority) {
                    // sort by item key order
                    return a - b;
                }
                return elements[a].priority - elements[b].priority;

            });

            var toReturn = [];
            keys.forEach(function(key) {
                toReturn.push(elements[key].element);
            });
            return toReturn;
        }

        var itemNumber = 0;
        function addElement(element, priority) {
            itemNumber += 1;

            if (priority === null || typeof(priority) !== 'number') {
                priority = 10;
            }

            elements[itemNumber] = {
                element: element,
                priority: priority
            };

            return true;
        }

        function removeElement(element) {
            var elementKey;
            angular.forEach(elements, function(obj, key) {
                if (element === obj.element) {
                    elementKey = key;
                }
            });

            if (elementKey) {
                delete elements[elementKey];
                return true;
            }
            return false;

        }
    }

})();