(function() {

    'use strict';

    angular
        .module('requisition')
        .factory('RequisitionURL', RequisitionUrl);

    RequisitionUrl.$inject = ['OpenlmisURL', 'pathFactory'];

    function RequisitionUrl(OpenlmisURL, pathFactory) {

        var requisitionUrl = "@@REQUISITION_SERVICE_URL";

        if (requisitionUrl.substr(0, 2) == "@@") {
            requisitionUrl = "";
        }

        return function(url) {
            url = pathFactory(requisitionUrl, url);
            return OpenlmisURL(url);
        }
    }

})();
