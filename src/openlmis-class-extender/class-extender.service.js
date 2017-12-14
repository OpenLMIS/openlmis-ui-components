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
     * @name openlmis-class-extender.classExtender
     *
     * @description
     * Holds boilerplate code related to prototype extension to avoid code duplication.
     */
    angular
        .module('openlmis-class-extender')
        .service('classExtender', classExtender);

    classExtender.$inject = [];

    function classExtender() {
        var service = this;

        service.extend = extend;

        /**
         * @ngdoc method
         * @methodOf openlmis-class-extender.classExtender
         * @name extend
         *
         * @description
         * Extends the extending class with parent class. It makes sure that the prototype is not
         * shared across multiple children of the parent class.
         *
         * @param  {Function}   extending   the extending class
         * @param  {Function}   parent    the parent class
         */
        function extend(extending, parent) {
            if (!extending) {
                throw 'The extending class must be defined';
            }

            if (!parent) {
                throw 'The parent class must be defined';
            }

            extending.prototype = angular.copy(parent.prototype);
            extending.prototype.constructor = extending;
        }
    }

})();
