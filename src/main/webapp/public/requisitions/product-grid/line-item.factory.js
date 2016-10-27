(function() {
  
  'use strict';

  angular.module('openlmis.requisitions').factory('LineItemFactory', lineItemFactory);

  lineItemFactory.$inject = ['ValidationFactory', 'CalculationFactory', 'Column', 'Source'];

  function lineItemFactory(ValidationFactory, CalculationFactory, Column, Source) {

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

    function getColumnValue(column) {
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
        this[name] = CalculationFactory[name](this);
        this.$isColumnValid(column);
      }

      return this[name];
    }
  };

})();