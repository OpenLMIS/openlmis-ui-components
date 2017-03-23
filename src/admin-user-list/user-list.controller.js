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
     * @name admin-user-list.controller:UsersListController
     *
     * @description
     * Controller for managing user list screen.
     */
	angular
		.module('admin-user-list')
		.controller('UserListController', controller);

	controller.$inject = ['$controller', '$state', 'items', 'totalItems', 'stateParams', 'confirmService'];

	function controller($controller, $state, items, totalItems, stateParams, confirmService) {

		var vm = this;

		$controller('BasePaginationController', {
			vm: vm,
			items: items,
			totalItems: totalItems,
			stateParams: stateParams,
			externalPagination: true,
			itemValidator: undefined
		});

		vm.goToCreateNewUser = goToCreateNewUser;
        vm.editUser = editUser;
        vm.resetUserPassword = resetUserPassword;

        /**
         * @ngdoc method
         * @methodOf admin-user-list.controller:UsersListController
         * @name goToCreateNewUser
         *
         * @description
         * Redirects to create new user page.
         */
		function goToCreateNewUser() {
			//$state.go('');
		}

        /**
         * @ngdoc method
         * @methodOf admin-user-list.controller:UsersListController
         * @name editUser
         *
         * @description
         * Redirects to edit user page.
         *
         * @param {String} userId the user UUID
         */
		function editUser(userId) {
			/*$state.go('administration.user.edit', {
                id: userId
            });*/
		}

        /**
         * @ngdoc method
         * @methodOf admin-user-list.controller:UsersListController
         * @name editUser
         *
         * @description
         * Redirects to edit user page.
         *
         * @param {String} userId the user UUID
         */
		function resetUserPassword(userId) {
            confirmService.confirm('msg.question.confirmation.resetPassword').then(function() {

            });
		}
	}

})();
