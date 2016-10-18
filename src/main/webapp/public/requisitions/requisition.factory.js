(function() {
  
  'use strict';

  angular.module('openlmis.requisitions').factory('RequisitionFactory', requisitionFactory);

  requisitionFactory.$inject = ['$resource', 'RequisitionURL'];

  function requisitionFactory($resource, RequisitionURL) {

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
      }).$promise;
    }

    function transformResponse(data, headersGetter, status) {
      if (status !== 200) return data;
      var requisition = angular.fromJson(data);
      requisition.$getTemplate = getTemplate;
      return requisition;
    }

    return service;
  }

})();