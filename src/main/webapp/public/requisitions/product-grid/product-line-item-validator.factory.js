(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .factory('productLineItemValidator', productLineItemValidator);

  productLineItemValidator.$inject = ['messageService'];

  function productLineItemValidator(messageService) {
    var nonMandatoryField = [
      'approvedQuantity',
      'skipped',
      'remarks',
      'totalLossesAndAdjustments',
      'requestedQuantityExplanation'
    ];

    var validationFunctions = {
      nonNegative: nonNegative,
      nonEmpty: nonEmpty,
      nonEmptyIfPropertyIsSet: nonEmptyIfPropertyIsSet
    };

    var validations = {
      stockOnHand: [validationFunctions.nonNegative],
      totalConsumedQuantity: [validationFunctions.nonNegative],
      requestedQuantityExplanation: [validationFunctions.nonEmptyIfPropertyIsSet('requestedQuantity')]
    };

    return {
      validate: validate,
    };

    function validate(lineItem, property, displayName) {
      var error = undefined;
      if (nonMandatoryField.indexOf(property) === -1) {
        error = error || validationFunctions.nonEmpty(lineItem, property);
      }
      angular.forEach(validations[property], function(validation) {
        error = error || validation(lineItem, property, displayName);
      });
      return error;
    }

    function nonNegative(lineItem, property, displayName) {
      if (lineItem[property] < 0) {
        return messageService.get('error.negative');
      }
    }

    function nonEmpty(lineItem, property) {
      if (lineItem[property] === null) {
        return messageService.get('error.required');
      }
    }

    function nonEmptyIfPropertyIsSet(setProperty) {
      return function(lineItem, property) {
        if (lineItem[setProperty]) {
          return nonEmpty(lineItem, property);
        }
      };
    }
  }

})();