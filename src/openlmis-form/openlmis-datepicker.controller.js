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
     * @name requisition-form.controller:OpenlmisDatepickerController
     *
     * @description
     * Controller for openlmis datepicker.
     */
    angular
        .module('openlmis-form')
        .controller('OpenlmisDatepickerController', OpenlmisDatepickerController);

    OpenlmisDatepickerController.$inject = ['$scope', 'DEFAULT_DATE_FORMAT'];

    function OpenlmisDatepickerController($scope, DEFAULT_DATE_FORMAT) {
        var vm = this;

        /**
         * @ngdoc property
         * @propertyOf requisition-form.controller:OpenlmisDatepickerController
         * @name dateFormat
         * @type {String}
         *
         * @description
         * Format of displayed date. If not provided, default format is set.
         */
        vm.dateFormat = angular.isDefined($scope.dateFormat) ? $scope.dateFormat : DEFAULT_DATE_FORMAT;
    }
})();