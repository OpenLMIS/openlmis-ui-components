(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .factory('RequisitionFactory', requisitionFactory);

  requisitionFactory.$inject = ['$resource', 'OpenlmisURL', 'RequisitionURL', 'Template', 'LineItemFactory', 'CategoryFactory', 'Status', 'Source'];

  function requisitionFactory($resource, OpenlmisURL, RequisitionURL, Template, LineItemFactory, CategoryFactory, Status, Source) {
    var resource = $resource(RequisitionURL('/api/requisitions/:id'), {}, {
      'getStockAdjustmentReasonsByProgram': {
        url: OpenlmisURL('/referencedata/api/stockAdjustmentReasons/search'),
        isArray: true
      },
      'authorize': {
        url: RequisitionURL('/api/requisitions/:id/authorize'),
        method: 'POST'
      },
      'save': {
        method: 'PUT',
        transformRequest: transformRequisition
      },
      'submit': {
        url: RequisitionURL('/api/requisitions/:id/submit'),
        method: 'POST'
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

    return requisition;

    function requisition(requisition, template, approvedProducts) {
        var lineItems = requisition.requisitionLineItems,
            programId = requisition.program.id;

        requisition.$getStockAdjustmentReasons = getStockAdjustmentReasons;
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
        requisition.$template = new Template(template, requisition);
        requisition.$fullSupplyCategories = CategoryFactory.groupFullSupplyLineItems(lineItems, programId);
        requisition.$nonFullSupplyCategories = CategoryFactory.groupNonFullSupplyLineItems(lineItems, programId);
        requisition.$approvedCategories= CategoryFactory.groupProducts(lineItems, approvedProducts);
        requisition.requisitionLineItems.forEach(LineItemFactory);

        return requisition;
    }

    function getStockAdjustmentReasons() {
      return resource.getStockAdjustmentReasonsByProgram({
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
      }, {}).$promise;
    }

    function approve() {
      return resource.approve({
        id: this.id
      }, {}).$promise;
    }

    function reject() {
      return resource.reject({
        id: this.id
      }, {}).$promise;
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
      var isValid = true,
      fullSupplyColumns = this.$template.getColumns(),
      nonFullSupplyColumns = this.$template.getColumns(true);

      this.$fullSupplyCategories.forEach(function(category) {
        category.lineItems.forEach(function(lineItem) {
          isValid = lineItem.$areColumnsValid(fullSupplyColumns) && isValid;
        });
      });

      this.$nonFullSupplyCategories.forEach(function(category) {
        category.lineItems.forEach(function(lineItem) {
          isValid = lineItem.$areColumnsValid(nonFullSupplyColumns) && isValid;
        });
      });

      return isValid;
    }

    function transformRequisition(requisition) {
      var columns = requisition.$template.columns;
      angular.forEach(requisition.requisitionLineItems, function(lineItem) {
        transformLineItem(lineItem, columns);
      })
      return angular.toJson(requisition);
    }

    function transformLineItem(lineItem, columns) {
      angular.forEach(columns, function(column) {
        if (!column.display || column.source === Source.CALCULATED) {
          lineItem[column.name] = null;
        }
      });
    }
  }

})();
