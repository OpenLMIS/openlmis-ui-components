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
     * @name openlmis-tags-input.controller:OpenlmisTagsInputController
     * @description
     * Controller responsible for managing openlmisTagInput directive.
     */
    angular
        .module('openlmis-tags-input')
        .controller('OpenlmisTagsInputController', OpenlmisTagsInputController);

    OpenlmisTagsInputController.$inject = ['$scope', '$q'];

    function OpenlmisTagsInputController($scope, $q) {
        var tagsInputVm = this;

        tagsInputVm.$onInit = onInit;
        tagsInputVm.setErrorMessage = setErrorMessage;
        tagsInputVm.filterAvailableTags = filterAvailableTags;

        /**
         * @ngdoc method
         * @methodOf openlmis-tags-input.controller:OpenlmisTagsInputController
         * @name $onInit
         *
         * @description
         * Initialization method of the OpenlmisTagsInputController.
         */
        function onInit() {
            tagsInputVm.allowNewTags = $scope.allowNewTags !== false;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-tags-input.controller:OpenlmisTagsInputController
         * @name setErrorMessage
         *
         * @description
         * Sets the error message to be displayed through openlmisInvalid directive.
         *
         * @param {String} errorMessage the key of the message
         */
        function setErrorMessage(errorMessage) {
            tagsInputVm.errorMessage = errorMessage;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-tags-input.controller:OpenlmisTagsInputController
         * @name filterAvailableTags
         *
         * @description
         * Filters the list of available tags with the given query. Returns a promise resolving to the filtered list.
         * The reason why this method returns a promise is that it is required by the ngTagsInput.
         *
         * @param  {String} query the query used when filtering tags
         * @return {Promise}      the promise resolving to filtered list
         */
        function filterAvailableTags(query) {
            if (!$scope.availableTags) {
                return $q.resolve([]);
            }

            if (!query) {
                return $q.resolve($scope.availableTags);
            }

            return $q.resolve($scope.availableTags.filter(function(tag) {
                return tag.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }));
        }
    }

})();