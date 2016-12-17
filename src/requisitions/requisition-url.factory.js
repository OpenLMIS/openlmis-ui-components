(function() {

  'use strict';

  angular.module('openlmis.requisitions').factory('RequisitionURL', RequisitionUrl);

  RequisitionUrl.$inject = ['OpenlmisURL', 'PathFactory'];

  function RequisitionUrl(OpenlmisURL, PathFactory) {

    var requisitionUrl = "@@REQUISITION_SERVICE_URL";

    if(requisitionUrl.substr(0,2) == "@@"){
      requisitionUrl = "";
    }

    return function(url){
      url = PathFactory(requisitionUrl, url);
      return OpenlmisURL(url);
    }
  }

})();