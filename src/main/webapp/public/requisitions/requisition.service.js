(function() {
  
  'use strict';

  angular.module('openlmis.requisitions').factory('Requisition', requisition);

  requisition.$inject = ['$resource', 'RequisitionURL'];

  function requisition($resource, RequisitionURL) {
    return $resource(RequisitionURL('/api/requisitions/:id'));
  }

})();