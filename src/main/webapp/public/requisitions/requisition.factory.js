(function() {
  
  'use strict';

  angular.module('openlmis.requisitions').factory('RequisitionFactory', requisitionFactory);

  requisitionFactory.$inject = ['$q', '$resource', 'RequisitionURL', 'LineItemFactory', 'ColumnTemplateFactory', 'Status', 'Source'];

  function requisitionFactory($q, $resource, RequisitionURL, LineItemFactory, ColumnTemplateFactory, Status, Source) {

    var resource = $resource(RequisitionURL('/api/requisitions/:id'), {}, {
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
      },
      'approve': {
        url: RequisitionURL('/api/requisitions/:id/approve'),
        method: 'POST'
      },
      'reject': {
        url: RequisitionURL('/api/requisitions/:id/reject'),
        method: 'PUT'
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

    function addRequisitionMethods(requisition) {
      requisition.$getColumnTemplates = getColumnTemplates;
      requisition.$columnTemplates = columnTemplates();
      requisition.$authorize = authorize;
      requisition.$save = save;
      requisition.$submit = submit;
      requisition.$remove = remove;
      requisition.$approve = approve;
      requisition.$reject = reject;
      requisition.$isValid = isValid;
      requisition.$isInitiated = isInitiated;
      requisition.$isSubmitted = isSubmitted;
      requisition.$isApproved = isApproved;
      requisition.$isAuthorized = isAuthorized;
      angular.forEach(requisition.requisitionLineItems, LineItemFactory.extendLineItem);
    }

    function getColumnTemplates() {
      var deferred = $q.defer(),
          requisition = this;

      ColumnTemplateFactory.getColumnTemplates(this).then(function(columnTemplates) {
        deferred.resolve(requisition.$columnTemplates(columnTemplates));
      }, function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function columnTemplates() {
      var columnTemplates = [];
      return function(newColumnTemplates) {
        return arguments.length ? (columnTemplates = newColumnTemplates) : columnTemplates;
      };
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
      nullCalculatedFields(this, this.$columnTemplates());
      return resource.save({
        id: this.id
      },this).$promise;
    }

    function submit() {
      return resource.submit({
        id: this.id
      }, this).$promise;
    }

    function approve() {
      return resource.approve(
        {id: this.id},
        this).$promise;
    }

    function reject() {
      return resource.reject(
        {id: this.id},
        this).$promise;
    }

    function isInitiated() {
      return this.status === Status.INITIATED;
    }

    function isSubmitted() {
      return this.status === Status.SUBMITTED;
    }

    function isAuthorized() {
      return this.status === Status.AUTHORIZED;
    }

    function isApproved() {
      return this.status === Status.APPROVED;
    }

    function isValid() {
      var columnTemplates = this.$columnTemplates(),
          isValid = true;

      angular.forEach(this.requisitionLineItems, function(lineItem) {
        isValid = lineItem.$areColumnsValid(columnTemplates) && isValid;
      });

      return isValid;
    }

    function nullCalculatedFields(requisition, columnTemplates) {
      angular.forEach(requisition.requisitionLineItems, function(lineItem) {
        angular.forEach(columnTemplates, function(template) {
          if (template.source === Source.CALCULATED) {
            lineItem[template.name] = null;
          }
        })
      });
    }
  }

})();