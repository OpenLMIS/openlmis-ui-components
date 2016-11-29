(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .factory('LineItem', lineItem);

  lineItem.$inject = ['validations', 'calculations', 'Columns', 'Source'];

  function lineItem(validations, calculations, Columns, Source) {

    LineItem.prototype.getFieldValue = getFieldValue;

    return LineItem;

    function LineItem(lineItem, programId) {
        angular.merge(this, lineItem);
        this.$errors = {};
        this.$program = getProgramById(lineItem.orderableProduct.programs, programId);
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
        this[name] = calculations[name](this, status);
      }

      return this[name];
    }

    function getProgramById(programs, programId) {
        var match;
        programs.forEach(function(program) {
            if (program.programId === programId) {
                match = program;
            }
        });
        return match;
    }

  };

})();
