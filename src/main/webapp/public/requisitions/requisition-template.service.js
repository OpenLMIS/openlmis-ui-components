(function() {

  'use strict';

  angular.module('openlmis.requisitions').factory('RequisitionTemplate', requisitionTemplate);

  requisitionTemplate.$inject = ['$resource', 'RequisitionURL'];

  function requisitionTemplate($resource, RequisitionURL) {
    return $resource(RequisitionURL('/api/requisitionTemplates/:id'));
  } 

})();