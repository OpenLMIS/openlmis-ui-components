(function() {
  
  'use strict';

  angular.module('openlmis.requisitions').factory('Requisition', requisition);

  requisition.$inject = ['$resource', 'RequisitionURL'];

  function requisition($resource, RequisitionURL) {
    var resource = $resource(RequisitionURL('/api/requisitions/:id'), {}, {
      'getTemplateForProgramId': {
        method: 'GET',
        url: RequisitionURL('/api/requisitionTemplates/search')
      }
    });

    function getRequisition(id) {
      return resource.get({
        id: id
      }).$promise;
    }

    function getTemplate(requisition) {
      return resource.getTemplateForProgramId({
        program: requisition.program.id
      }).$promise;
    }

    return {
      getRequisition: getRequisition,
      getTemplate: getTemplate
    };
  }

})();