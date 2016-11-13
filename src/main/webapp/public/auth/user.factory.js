(function() {
  
    'use strict';

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

        function get(id) {
            var user = resource.get({id: id});
            user.$promise.then(extendUser);
            return user;
        }

        function extendUser(user) {
            user.$updateProfile = updateProfile;
            return user;
        }

        function updateProfile() {
            var profileInfo = {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email
            }
            return resource.save({id: this.id}, profileInfo).$promise;
        }
    }

})();