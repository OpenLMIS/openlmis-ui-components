(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .factory('ValidationFactory', validationFactory);

  validationFactory.$inject = ['messageService'];

  function validationFactory(messageService) {
    var factory = {
      nonNegative: nonNegative,
      nonEmpty: nonEmpty,
      nonEmptyIfPropertyIsSet: nonEmptyIfPropertyIsSet,
      validCalculation: validCalculation
    };
    return factory;

    function nonNegative(value) {
      if (value < 0) {
        return messageService.get('error.negative');
      }
    }

    function nonEmpty(value) {
      if (value === null || value === undefined || value ==='') {
        return messageService.get('error.required');
      }
    }

    function nonEmptyIfPropertyIsSet(setProperty) {
      return function(value, lineItem) {
        if (lineItem[setProperty]) {
          return nonEmpty(value);
        }
      };
    }

    function validCalculation(calculation) {
      return function(value, lineItem) {
        if (value !== calculation(lineItem)) {
          return messageService.get('error.wrongCalculation');
        }
      }
    }
  }

})();