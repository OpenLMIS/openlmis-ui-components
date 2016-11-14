(function() {
  
    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-auth.UserFactory
     *
     * @description
     * 
     * Allows user to perform actions on user resource
     * 
     */
    angular.module('openlmis-auth').factory('UserFactory', userFactory);

    userFactory.$inject = ['OpenlmisURL', '$resource'];

    function userFactory(OpenlmisURL, $resource) {

        var resource = $resource(OpenlmisURL('/referencedata/api/users/:id'), {}, {
            'update': {
                url: OpenlmisURL('/referencedata/api/users/update/:id'),
                method: 'POST'
            }
        });

        var service = {
            get: get
        };
        return service;


        /**
         * @ngdoc function
         * @name  get
         * @methodOf openlmis-auth.UserFactory
         * @param {String} id User id 
         * @returns {Resource} User info
         * 
         * @description
         *
         * Get user by id
         */
        function get(id) {
            var user = resource.get({id: id});
            user.$promise.then(extendUser);
            return user;
        }

        function extendUser(user) {
            user.$updateProfile = updateProfile;
            return user;
        }

        /**
         * @ngdoc function
         * @name  updateProfile
         * @methodOf openlmis-auth.UserFactory
         * @returns {Promise} updated User
         * 
         * @description
         *
         * Updates user profile info
         */
        function updateProfile() {
            var profileInfo = {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email
            }
            return resource.update({id: this.id}, profileInfo).$promise;
        }
    }

})();