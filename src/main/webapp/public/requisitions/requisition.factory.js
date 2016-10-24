(function() {
  
  'use strict';

  angular.module('openlmis.requisitions').factory('RequisitionFactory', requisitionFactory);

  requisitionFactory.$inject = ['$resource', 'RequisitionURL', 'LineItemFactory'];

  function requisitionFactory($resource, RequisitionURL, LineItemFactory) {

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
      },
      'submit': {
        url: RequisitionURL('/api/requisitions/:id/submit'),
        method: 'POST'
      },
      'initiate': {
        url: RequisitionURL('/api/requisitions/initiate'),
        method: 'POST'
      },
      'remove': {
        url: RequisitionURL('/api/requisitions/:id'),
        method: 'DELETE'
      },
      'search': {
        url: RequisitionURL('/api/requisitions/search'),
        method: 'GET',
        isArray: true
      }
    });

    var service = {
      get: get,
      initiate: initiate,
      search: search
    };
    return service;

    function get(id) {
      var requisition = resource.get({id: id});
      requisition.$promise.then(addRequisitionMethods);
      return requisition;
    }

    function getTemplate() {
      return resource.getTemplateByProgram({
        program: this.program.id
      }).$promise;
    }

    function authorize() {
      return resource.authorize({
        id: this.id
      }, {}).$promise;
    }

    function remove() {
      return resource.remove({
        id: this.id
      }).$promise;
    }

    function save() {
      return resource.save({
        id: this.id
      },this).$promise;
    }

    function submit() {
      return resource.submit({
        id: this.id
      }, this).$promise;
    }

    function initiate(facility, program, suggestedPeriod, emergency) {
      return resource.initiate({
        facility: facility,
        program: program,
        suggestedPeriod: suggestedPeriod,
        emergency: emergency
      }, {}).$promise;
    }

    function search(programId, facilityId) {
      return resource.search({
        program: programId, 
        facility: facilityId
      }).$promise;
    }

    function isPossibleToDelete() {
        return $scope.requisition.status === "INITIATED" && AuthorizationService.hasPermission("DELETE_REQUISITION");
    };

    function addRequisitionMethods(requisition) {
      requisition.$getTemplate = getTemplate;
      requisition.$authorize = authorize;
      requisition.$save = save;
      requisition.$submit = submit;
      requisition.$remove = remove;
      angular.forEach(requisition.requisitionLineItems, LineItemFactory.extendLineItem);
    }
  }

})();