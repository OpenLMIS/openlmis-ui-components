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
     * @ngdoc object
     * @name admin-user-form-modal.UserFormModal
     *
     * @description
     * Represents a single user form modal. It gives the ability to create/update the given user.
     */
    angular
        .module('admin-user-form-modal')
        .factory('UserFormModal', userFormModalFactory);

    userFormModalFactory.$inject = [
        'openlmisModalService'
    ];

    function userFormModalFactory(openlmisModalService) {

        return UserFormModal;

        /**
         * @ngdoc method
         * @methodOf admin-user-form-modal.UserFormModal
         * @name UserFormModal
         *
         * @description
         * Opens a modal allowing editing the user, if it was given, or creating a new one if it was
         * not.
         *
         * @param   {Object}    user    the user to be updated, if no user is given a new one will
         *                              be Created
         * @return  {Promise}           the promise resolving to the new/updated user
         */
        function UserFormModal(user) {
            //we do this to keep the changes made to the user when hiding/showing modal
            var persistent = {
                user: user ? angular.copy(user) : {
                    loginRestricted: true,
                    verified: false
                }
            };

            return openlmisModalService.createDialog({
                controller: 'UserFormModalController',
                controllerAs: 'vm',
                templateUrl: 'admin-user-form-modal/user-form-modal.html',
                show: true,
                resolve: {
                    user: function() {
                        return persistent.user;
                    }
                }
            }).promise.finally(function() {
                persistent = undefined;
            });
        }

    }

})();
