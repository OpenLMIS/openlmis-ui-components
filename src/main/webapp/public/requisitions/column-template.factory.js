(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .factory('ColumnTemplateFactory', columnTemplateFactory);

  columnTemplateFactory.$inject = ['$q', '$resource', 'RequisitionURL', 'Column', 'Source', 'Status'];

  function columnTemplateFactory($q, $resource, RequisitionURL, Column, Source, Status) {
    var resource = $resource(RequisitionURL('/api/requisitionTemplates/search'));

    var nonMandatoryFields = [
      Column.SKIPPED,
      Column.REMARKS,
      Column.TOTAL_LOSSES_AND_ADJUSTMENTS,
      Column.REQUESTED_QUANTITY_EXPLANATION
    ];

    var dependencies = {
      stockOnHand: [
        Column.BEGINNING_BALANCE,
        Column.TOTAL_RECEIVED_QUANTITY,
        Column.TOTAL_CONSUMED_QUANTITY,
        Column.TOTAL_LOSSES_AND_ADJUSTMENTS
      ],
      requestedQuantityExplanation: [
        Column.REQUESTED_QUANTITY
      ]
    };

    var factory = {
      getColumnTemplates: getColumnTemplates
    }
    return factory;

    function getColumnTemplates(requisition) {
      var deferred = $q.defer();

      resource.get({
        program: requisition.program.id
      }).$promise.then(function(response) {
        deferred.resolve(toColumnTemplates(response, requisition));
      }, function(error) {
        deferred.reject(error);
      })

      return deferred.promise;
    }

    function toColumnTemplates(requisitionTemplate, requisition) {
      var columnTemplates = [];
      angular.forEach(requisitionTemplate.columnsMap, function(column) {
        if (displayColumn(column.name, requisition.status)) {
          columnTemplates.push(toColumnTemplate(column, requisition));
        }
      });
      return columnTemplates
    }

    function toColumnTemplate(column, requisition) {
      var name = column.name,
          type = column.columnDefinition.columnType;

      return {
        name: name,
        type: type,
        source: column.source,
        label: column.label,
        displayOrder: column.displayOrder,
        required: (nonMandatoryFields.indexOf(name) === -1 && type !== Source.CALCULATED),
        dependencies: dependencies[name]
      };
    }

    function displayColumn(name, status) {
      return [Column.APPROVED_QUANTITY, Column.REMARKS].indexOf(name) === -1 ||
             [Status.AUTHORIZED, Status.APPROVED].indexOf(status) > -1;
    }
  }

})();