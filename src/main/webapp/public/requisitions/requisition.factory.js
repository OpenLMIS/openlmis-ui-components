(function() {

  'use strict';

  /**
   * @ngdoc service
   * @name openlmis.requisitions.RequisitionFactory
   *
   * @description
   * Responsible for storing all information related to the requisition.
   */
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

    /**
     * @ngdoc function
     * @name getStockAdjustmentReasons
     * @methodOf openlmis.requisitions.RequisitionFactory
     *
     * @description
     * Retrieves stock adjustment reasons based on program.
     *
     * @return {*|Function} promise
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
     *
     * @description
     *
     * @return {*|Function} promise
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
     *
     * @description
     *
     * @return {*|Function} promise
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
     *
     * @description
     *
     * @return {*|Function} promise
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
     *
     * @description
     *
     * @return {*|Function} promise
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
     *
     * @description
     *
     * @return {*|Function} promise
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
     *
     * @description
     *
     * @return {*|Function} promise
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

    /**
     * @ngdoc function
     * @name isValid
     * @methodOf openlmis.requisitions.RequisitionFactory
     *
     * @description
     * Determines whether the requisition is valid based on line items' columns validity.
     *
     * @return {boolean} is requisition valid
     */
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

      /**
       *
       * @param requisition requisition which needs to be converted into a JSON-formatted string
       * @return {string|string|undefined}
       */
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
