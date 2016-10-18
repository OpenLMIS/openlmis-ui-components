(function() {
  
  'use strict';

  angular.module('openlmis.requisitions').factory('Requisition', requisition);

  requisition.$inject = ['$resource', 'RequisitionURL'];

  function requisition($resource, RequisitionURL) {

    var service = $resource(RequisitionURL('/api/requisitions/:id'), {}, {
      'get': {
        transformResponse: transformResponse
      },
      'getTemplateByProgram': {
        url: RequisitionURL('/api/requisitionTemplates/search')
      }
    });

    function getTemplate() {
      return service.getTemplateByProgram({
        program: this.program.id
      });
    }

    function transformResponse(data, headersGetter, status) {
      if (status === 200) {
        var requisition = angular.fromJson(data);
        requisition.$getTemplate = getTemplate;
        return requisition;
      }
      return angular.fromJson(data);
    }

    return service;
  }

})();