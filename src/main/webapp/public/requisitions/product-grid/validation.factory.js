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
      nonEmptyIfPropertyIsSet
    };
    return factory;

    function nonNegative(lineItem, property) {
      if (lineItem[property] < 0) {
        return messageService.get('error.negative');
      }
    }

    function nonEmpty(lineItem, property) {
      var value = lineItem[property];
      if (value === null || value === undefined || value ==='') {
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