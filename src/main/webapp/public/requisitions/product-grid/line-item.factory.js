(function() {
  
  'use strict';

  angular.module('openlmis.requisitions').factory('LineItemFactory', lineItemFactory);

  lineItemFactory.$inject = ['ValidationFactory', 'CalculationFactory', 'Column'];

  function lineItemFactory(ValidationFactory, CalculationFactory, Column) {

    var validationsToPass = {
      stockOnHand: [
        ValidationFactory.nonNegative,
        ValidationFactory.validCalculation(CalculationFactory.stockOnHand)
      ],
      totalConsumedQuantity: [
        ValidationFactory.nonNegative
      ],
      requestedQuantityExplanation: [
        ValidationFactory.nonEmptyIfPropertyIsSet(Column.REQUESTED_QUANTITY)
      ]
    };

    var factory = {
      extendLineItem: extendLineItem
    };
    return factory;

    function extendLineItem(lineItem) {
      lineItem.$isValid = isValid;
      lineItem.$errors = errors();
      lineItem.$getColumnError = getColumnError;
      lineItem.$isColumnValid = isColumnValid;
      lineItem.$areColumnsValid = areColumnsValid;
      lineItem.$getColumnValue = getColumnValue;
    }

    function isValid() {
      var isValid = true;

      angular.forEach(this.$errors(), function(error) {
        isValid = isValid && !error;
      });

      return isValid;
    }

    function isColumnValid(column) {
      var lineItem = this,
          error;

      if (column.required) {
        error = error || ValidationFactory.nonEmpty(lineItem[column.name]);
      }

      angular.forEach(validationsToPass[column.name], function(validation) {
        error = error || validation(lineItem[column.name], lineItem);
      });

      this.$errors()[column.name] = error;
      return !error;
    }

    function areColumnsValid(columns) {
      var lineItem = this,
          areValid = true;

      angular.forEach(columns, function(column) {
        areValid = lineItem.$isColumnValid(column) && areValid;
      })

      return areValid;
    }

    function getColumnError(name) {
      return this.$errors()[name];
    }

    function errors() {
      var errors = {};
      return function(newErrors) {
        return arguments.length ? (errors = newErrors) : errors;
      }
    }

    function getColumnValue(name, calculate) {
      if (calculate) {
        var value = CalculationFactory[name](this),
            lineItem = this,
            error;
        
        angular.forEach(validationsToPass[name], function(validation) {
          error = error || validation(value, lineItem);
        });
        this.$errors()[name] = error;
        this[name] = null;

        return value;
      }
      return this[name];
    }
  };

})();