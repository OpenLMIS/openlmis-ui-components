(function() {
  
  'use strict';

  angular
    .module('openlmis.requisitions')
    .constant('Status', status());

  function status() {
    return {
      INITIATED: 'INITIATED',
      SUBMITTED: 'SUBMITTED',
      AUTHORIZED: 'AUTHORIZED',
      APPROVED: 'APPROVED'
    };
  }

})();