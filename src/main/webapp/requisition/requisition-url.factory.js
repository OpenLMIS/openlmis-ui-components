(function() {

    'use strict';

    angular
        .module('requisition')
        .factory('requisitionUrlFactory', factory);

    factory.$inject = ['openlmisUrlFactory', 'pathFactory'];

    function factory(openlmisUrlFactory, pathFactory) {

        var requisitionUrl = '@@REQUISITION_SERVICE_URL';

        if (requisitionUrl.substr(0, 2) == '@@') {
            requisitionUrl = '';
        }

        return function(url) {
            url = pathFactory(requisitionUrl, url);
            return openlmisUrlFactory(url);
        }
    }

})();
