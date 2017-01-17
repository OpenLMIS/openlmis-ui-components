(function() {

    'use strict';

    angular
        .module('order')
        .factory('ordersUrlFactory', factory);

    factory.$inject = ['openlmisUrlFactory', 'pathFactory'];

    function factory(openlmisUrlFactory, pathFactory) {

        var ordersUrl = '@@ORDERS_SERVICE_URL';

        if (ordersUrl.substr(0, 2) == '@@') {
            ordersUrl = '';
        }

        return function(url) {
            url = pathFactory(ordersUrl, url);
            return openlmisUrlFactory(url);
        }
    }

})();
