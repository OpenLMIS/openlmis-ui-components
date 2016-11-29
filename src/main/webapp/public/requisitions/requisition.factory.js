(function() {

  'use strict';

  /**
   * @ngdoc service
   * @name openlmis.requisitions.RequisitionFactory
   *
   * @description
   * Responsible for supplying requisition with additional methods.
   */
  angular
    .module('openlmis.requisitions')
    .factory('RequisitionFactory', requisitionFactory);

  requisitionFactory.$inject = ['$resource', 'OpenlmisURL', 'RequisitionURL', 'Template', 'LineItem', 'CategoryFactory', 'Status', 'Source'];

  function requisitionFactory($resource, OpenlmisURL, RequisitionURL, Template, LineItem, CategoryFactory, Status, Source) {
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

    /**
     * @ngdoc function
     * @name requisition
     * @methodOf openlmis.requisitions.RequisitionFactory
     * @param {Resource} requisition resource with requisition
     * @param {Resource} template resource with requisition template
     * @param {Resource} approvedProducts resource with approved products
     * @return {Object} requisition with methods
     *
     * @description
     * Adds all needed methods and information from template to given requisition.
     *
     */
    function requisition(requisition, template, approvedProducts) {
        var programId = requisition.program.id;

        requisition.$getStockAdjustmentReasons = getStockAdjustmentReasons;
        requisition.$authorize = authorize;
        requisition.$save = save;
        requisition.$submit = submit;
        requisition.$remove = remove;
        requisition.$approve = approve;
        requisition.$reject = reject;
        requisition.$isInitiated = isInitiated;
        requisition.$isSubmitted = isSubmitted;
        requisition.$isApproved = isApproved;
        requisition.$isAuthorized = isAuthorized;
        requisition.$template = new Template(template, requisition);

        var lineItems = [];
        requisition.requisitionLineItems.forEach(function(lineItem) {
            lineItems.push(new LineItem(lineItem, programId, requisition.$template.columns, requisition.status));
        });
        requisition.requisitionLineItems = lineItems;

        requisition.$fullSupplyCategories = CategoryFactory.groupFullSupplyLineItems(lineItems, programId);
        requisition.$nonFullSupplyCategories = CategoryFactory.groupNonFullSupplyLineItems(lineItems, programId);
        requisition.$approvedCategories= CategoryFactory.groupProducts(lineItems, approvedProducts);
        return requisition;
    }

    /**
     * @ngdoc function
     * @name getStockAdjustmentReasons
     * @methodOf openlmis.requisitions.RequisitionFactory
     * @return {Promise} promise with reasons
     *
     * @description
     * Retrieves stock adjustment reasons based on requisition program.
     *
     */
    function getStockAdjustmentReasons() {
      return resource.getStockAdjustmentReasonsByProgram({
        program: this.program.id
      }).$promise;
    }

    /**
     * @ngdoc function
     * @name authorize
     * @methodOf openlmis.requisitions.RequisitionFactory
     * @return {Promise} requisition promise
     *
     * @description
     * Authorizes requisition.
     *
     */
    function authorize() {
      return resource.authorize({
        id: this.id
      }, {}).$promise;
    }

    /**
     * @ngdoc function
     * @name remove
     * @methodOf openlmis.requisitions.RequisitionFactory
     * @return {Promise} promise that resolves after requisition is deleted
     *
     * @description
     * Removes requisition.
     *
     */
    function remove() {
      return resource.remove({
        id: this.id
      }).$promise;
    }

    /**
     * @ngdoc function
     * @name save
     * @methodOf openlmis.requisitions.RequisitionFactory
     * @return {Promise} requisition promise
     *
     * @description
     * Saves requisition.
     *
     */
    function save() {
      return resource.save({
        id: this.id
      },this).$promise;
    }

    /**
     * @ngdoc function
     * @name submit
     * @methodOf openlmis.requisitions.RequisitionFactory
     * @return {Promise} requisition promise
     *
     * @description
     * Submits requisition.
     *
     */
    function submit() {
      return resource.submit({
        id: this.id
      }, {}).$promise;
    }

    /**
     * @ngdoc function
     * @name approve
     * @methodOf openlmis.requisitions.RequisitionFactory
     * @return {Promise} promise that resolves when requisition is approved
     *
     * @description
     * Approves requisition.
     *
     */
    function approve() {
      return resource.approve({
        id: this.id
      }, {}).$promise;
    }

    /**
     * @ngdoc function
     * @name reject
     * @methodOf openlmis.requisitions.RequisitionFactory
     * @return {Promise} promise that resolves when requisition is rejected
     *
     * @description
     * Rejects requisition.
     *
     */
    function reject() {
      return resource.reject({
        id: this.id
      }, {}).$promise;
    }

    /**
     * @ngdoc function
     * @name isInitiated
     * @methodOf openlmis.requisitions.RequisitionFactory
     *
     * @description
     * Responsible for checking if requisition is initiated.
     * Returns true only if requisition status equals initiated.
     *
     * @return {boolean} is requisition initiated
     */
    function isInitiated() {
      return this.status === Status.INITIATED;
    }

    /**
     * @ngdoc function
     * @name isSubmitted
     * @methodOf openlmis.requisitions.RequisitionFactory
     *
     * @description
     * Responsible for checking if requisition is submitted.
     * Returns true only if requisition status equals submitted.
     *
     * @return {boolean} is requisition submitted
     */
    function isSubmitted() {
      return this.status === Status.SUBMITTED;
    }

    /**
     * @ngdoc function
     * @name isAuthorized
     * @methodOf openlmis.requisitions.RequisitionFactory
     *
     * @description
     * Responsible for checking if requisition is authorized.
     * Returns true only if requisition status equals authorized.
     *
     * @return {boolean} is requisition authorized
     */
    function isAuthorized() {
      return this.status === Status.AUTHORIZED;
    }

    /**
     * @ngdoc function
     * @name isApproved
     * @methodOf openlmis.requisitions.RequisitionFactory
     *
     * @description
     * Responsible for checking if requisition is approved.
     * Returns true only if requisition status equals approved.
     *
     * @return {boolean} is requisition approved
     */
    function isApproved() {
      return this.status === Status.APPROVED;
    }

    function transformRequisition(requisition) {
        var columns = requisition.$template.columns;
        angular.forEach(requisition.requisitionLineItems, function(lineItem) {
            transformLineItem(lineItem, columns);
        });
        requisition.$nonFullSupplyCategories.forEach(function(category) {
            category.lineItems.forEach(function(lineItem) {
                if (requisition.requisitionLineItems.indexOf(lineItem) === -1) {
                    requisition.requisitionLineItems.push(lineItem);
                }
            });
        });
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
