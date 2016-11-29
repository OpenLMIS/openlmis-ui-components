(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .factory('RequisitionColumn', requisitionColumn);

  requisitionColumn.$inject = ['Columns', 'Source', 'Status'];

  function requisitionColumn(Columns, Source, Status) {

    var nonMandatoryFields = [
      Columns.SKIPPED,
      Columns.REMARKS,
      Columns.TOTAL_LOSSES_AND_ADJUSTMENTS,
      Columns.REQUESTED_QUANTITY_EXPLANATION
    ];

    var dependencies = {
      stockOnHand: [
        Columns.BEGINNING_BALANCE,
        Columns.TOTAL_RECEIVED_QUANTITY,
        Columns.TOTAL_CONSUMED_QUANTITY,
        Columns.TOTAL_LOSSES_AND_ADJUSTMENTS
      ],
      total: [
        Columns.BEGINNING_BALANCE,
        Columns.TOTAL_RECEIVED_QUANTITY
      ],
      requestedQuantityExplanation: [
        Columns.REQUESTED_QUANTITY
      ],
      packsToShip: [
        Columns.REQUESTED_QUANTITY,
        Columns.APPROVED_QUANTITY
      ]
    };

    var nonFullSupplyColumns = [
        Columns.REQUESTED_QUANTITY,
        Columns.REQUESTED_QUANTITY_EXPLANATION,
        Columns.PRODUCT_CODE,
        Columns.PRODUCT_NAME,
        Columns.UNIT_UNIT_OF_ISSUE,
        Columns.PACKS_TO_SHIP,
        Columns.APPROVED_QUANTITY,
        Columns.REMARKS
    ];

    return RequisitionColumn;

    function RequisitionColumn(column, requisition) {
        var name = column.name,
            source = column.source;

        this.name = name;
        this.type = column.columnDefinition.columnType;
        this.source = source;
        this.label = column.label;
        this.display = displayColumn(column, requisition);
        this.displayOrder = column.displayOrder;
        this.required = (nonMandatoryFields.indexOf(name) === -1 && source == Source.USER_INPUT);
        this.fullSupplyOnly = nonFullSupplyColumns.indexOf(name) === -1;
        this.dependencies = dependencies[name];
    }

    function displayColumn(column, requisition) {
      return column.isDisplayed && (
              [Columns.APPROVED_QUANTITY, Columns.REMARKS].indexOf(column.name) === -1 ||
              [Status.AUTHORIZED, Status.APPROVED].indexOf(requisition.status) > -1);
    }
  }

})();
