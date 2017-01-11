(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-user.userFactory
     *
     * @description
     * Allows user to perform actions on user resource
     */
    angular
        .module('openlmis-user')
        .factory('userFactory', factory);

    factory.$inject = ['openlmisUrlFactory', '$resource'];

    function factory(openlmisUrlFactory, $resource) {

        var resource = $resource(openlmisUrlFactory('/api/users/:id'), {}, {
            'update': {
                url: openlmisUrlFactory('/api/users/update/:id'),
                method: 'POST'
            }
        });

        var factory = {
            get: get
        };
        return factory;


        /**
         * @ngdoc function
         * @name  get
         * @methodOf openlmis-user.userFactory
         *
         * @description
         * Gets user by id.
         *
         * @param   {String}    id  User id
         * @returns {Resource}      User info
         */
        function get(id) {
            return resource.get({id: id});
        }
    }

})();
