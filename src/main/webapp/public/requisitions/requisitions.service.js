(function() {
  
  'use strict';

  angular
    .module('openlmis.requisitions')
    .service('Requisitions', requisitions);

  requisitions.$inject = ['$resource', 'RequisitionURL', 'requisition', 'Source', 'Column'];

  function requisitions($resource, RequisitionURL, requisition, Source, Column) {

    var resource = $resource(RequisitionURL('/api/requisitions/:id'), {}, {
      'initiate': {
        url: RequisitionURL('/api/requisitions/initiate'),
        method: 'POST'
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
      var response = resource.get({id: id});
      response.$promise.then(requisition);
      return response;
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

  }

})();