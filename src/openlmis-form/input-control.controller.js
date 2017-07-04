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
     * @ngdoc controller
     * @name openlmis-form.controller:inputControlController
     *
     * @description
     * Controller used by input-control directive. Other directives will
     * register their ngModelCtrl to the InputControlController, which then 
     * returns aggrigated responses to the input-control directive.
     */
    
    angular
        .module('openlmis-form')
        .controller('InputControlController', controller);

    function controller() {
        var vm = this;

        var elements = [];

        this.addNgModel = addNgModel;
        this.getErrors = getErrors;

        /**
         * @ngdoc method
         * @methodOf openlmis-form.controller:inputControlController
         * @name addNgModel
         *
         * @description
         * Adds ngModelCtrls to internal array.
         * 
         * @param {object} ngModelCtrl The ngModelCtrl to track.
         *
         * @returns {boolean} If successful it returns true, and false
         * otherwise.
         */
        function addNgModel(ngModelCtrl) {
            // needs to dedup
            elements.push(ngModelCtrl);
            return true;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-form.controller:inputControlController
         * @name getErrors
         *
         * @description
         * Looks through internal ngModelCtrl array and returns aggrigated
         * errors.
         * 
         * @returns {Object} Object of error keys and message values.
         */
        function getErrors() {
            var messages = {};

            elements.forEach(function(ngModelCtrl) {
                angular.forEach(ngModelCtrl.$error, function(value, key) {
                    messages[key] = value;
                });
            });

            return messages;
        }

    }
        
})();