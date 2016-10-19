(function() {
  
  'use strict';

  angular.module('openlmis.requisitions').factory('RequisitionFactory', requisitionFactory);

  requisitionFactory.$inject = ['$resource', 'RequisitionURL'];

  function requisitionFactory($resource, RequisitionURL) {

    var resource = $resource(RequisitionURL('/api/requisitions/:id'), {}, {
      'getTemplateByProgram': {
        url: RequisitionURL('/api/requisitionTemplates/search')
      },
      'authorize': {
        url: RequisitionURL('/api/requisitions/:id/authorize'),
        method: 'POST'
      },
      'save': {
        method: 'PUT'
      }
    });

    var service = {
      get: get
    };
    return service;

    function get(id) {
      var requisition = resource.get({id: id});
      requisition.$promise.then(function(requisition) {
        requisition.$getTemplate = getTemplate;
        requisition.$authorize = authorize;
        requisition.$save = save;
      });
      return requisition;
    }

    function getTemplate() {
      return resource.getTemplateByProgram({
        program: this.program.id
      }).$promise;
    }

    function authorize() {
      return resource.authorize({id: this.id}).$promise;
    }

    function save() {
          return resource.save(
            {id: this.id},
            this).$promise;
        }
  }

})();