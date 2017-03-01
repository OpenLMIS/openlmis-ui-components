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
     * @name openlmis-auth.userRightService
     *
     * @description
     * Responsible for calling check right endpoint.
     */
	angular
		.module('openlmis-auth')
	    .service('userRightService', service);

    service.$inject = ['$resource', 'referencedataUrlFactory'];

    function service($resource, referencedataUrlFactory) {

        var resource = $resource(referencedataUrlFactory('/api/users/:userId/hasRight'), {}, {
	            hasRight: {
	                method: 'GET'
	            }
	        });

        this.hasRight = hasRight;

		/**
         * @ngdoc method
         * @methodOf openlmis-auth.userRightService
         * @name hasRight
         *
         * @description
         * Checks if user has given right.
         *
         * @param  {String}  userId      referencedata user UUID
         * @param  {String}  rightId     right UUID
         * @param  {String}  programId   (optional) program UUID
         * @param  {String}  facilityId  (optional) facility UUID
         * @param  {String}  warehouseId (optional) warehouse UUID
         * @return {Promise}             returns true if user has right, false otherwise
         */
        function hasRight(userId, rightId, programId, facilityId, warehouseId) {
            return resource.hasRight({
                userId: userId,
                rightId: rightId,
                programId: programId,
                facilityId: facilityId,
                warehouseId: warehouseId
            }).$promise;
        }
    }
})();
