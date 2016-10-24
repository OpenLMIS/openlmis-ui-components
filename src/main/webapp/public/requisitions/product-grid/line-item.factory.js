(function() {
  
  'use strict';

  angular.module('openlmis.requisitions').factory('LineItemFactory', lineItemFactory);

  lineItemFactory.$inject = ['ValidationFactory', 'CalculationFactory'];

  function lineItemFactory(ValidationFactory, CalculationFactory) {

    var nonMandatoryField = [
      'approvedQuantity',
      'skipped',
      'remarks',
      'totalLossesAndAdjustments',
      'requestedQuantityExplanation'
    ];

    var validationsToPass = {
      stockOnHand: [ValidationFactory.nonNegative],
      totalConsumedQuantity: [ValidationFactory.nonNegative],
      requestedQuantityExplanation: [ValidationFactory.nonEmptyIfPropertyIsSet('requestedQuantity')]
    };

    var factory = {
      extendLineItem: extendLineItem
    };
    return factory;

    function extendLineItem(lineItem) {
      lineItem.$valid = valid;
      lineItem.$errors = errors();
      lineItem.$getPropertyError = getPropertyError;
      lineItem.$validateProperty = validateProperty;
      lineItem.$getValue = getValue;
    }

    function valid() {
      valid = true;

      angular.forEach(this.$errors(), function(error) {
        valid = valid && !error;
      });

      return valid;
    }

    function validateProperty(name) {
      var error = undefined,
          lineItem = this;

      if (nonMandatoryField.indexOf(name) === -1) {
        error = error || ValidationFactory.nonEmpty(lineItem[name], lineItem);
      }
      angular.forEach(validationsToPass[name], function(validation) {
        error = error || validation(lineItem[name], lineItem);
      });

      return this.$errors()[name] = error;
    }

    function getPropertyError(propertyName) {
      return this.$errors()[propertyName];
    }

    function errors() {
      var errors = {};
      return function(newErrors) {
        return arguments.length ? (errors = newErrors) : errors;
      }
    }

    function getValue(propertyName, calculate) {
      if (calculate) {
        var value = CalculationFactory[propertyName](this),
            lineItem = this,
            error;
        
        angular.forEach(validationsToPass[propertyName], function(validation) {
          error = error || validation(value, lineItem);
        });
        this.$errors()[propertyName] = error;
        this[propertyName] = null;

        return value;
      }
      return this[propertyName];
    }
  };

})();