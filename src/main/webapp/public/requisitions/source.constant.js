(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .constant('Source', source());

  function source() {
    return {
      USER_INPUT: 'USER_INPUT',
      CALCULATED: 'CALCULATED',
      REFERENCEDATA: 'REFERENCE_DATA',
    };
  }

})();