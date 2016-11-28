(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .factory('LineItem', lineItem);

  lineItem.$inject = ['validations', 'calculations', 'Columns', 'Source'];

  function lineItem(validations, calculations, Columns, Source) {

    LineItem.prototype.getFieldValue = getFieldValue;

    return LineItem;

    function LineItem(lineItem) {
        angular.merge(this, lineItem);
        this.$errors = {};
    }

    function getFieldValue(column, status) {
      var name = column.name,
        value;

      if (name.indexOf('.') > -1) { // for product code and product name
        value = this;
        angular.forEach(name.split('.'), function(property) {
          value = value[property];
        });
        return value;
      }

      if (column.source === Source.CALCULATED) {
        this[name] = CalculationFactory[name](this, status);
      }

      return this[name];
    }

  };

})();
