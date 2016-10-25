(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .constant('Type', type());

  function type() {
    return {
      CURRENCY: 'CURRENCY',
      TEXT: 'TEXT',
      BOOLEAN: 'BOOLEAN',
      NUMERIC: 'NUMERIC'
    };
  }

})();