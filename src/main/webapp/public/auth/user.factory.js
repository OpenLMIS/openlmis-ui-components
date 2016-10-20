(function() {
  
  'use strict';

  angular.module('openlmis-auth').factory('UserFactory', userFactory);

  userFactory.$inject = ['OpenlmisURL', '$resource'];

  function userFactory(OpenlmisURL, $resource) {

    var resource = $resource(OpenlmisURL('/referencedata/api/users/:id'));

    var service = {
      get: get
    };
    return service;

    function get(id) {
      var user = resource.get({id: id});
      return user;
    }
  }

})();