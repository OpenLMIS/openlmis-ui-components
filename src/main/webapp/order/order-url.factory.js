(function() {

    'use strict';

    /**
     *
     * @ngdoc service
     * @name order.fulfillmentUrlFactory
     *
     * @description
     * Supplies application with fulfillment URL.
     */
    angular
        .module('order')
        .factory('fulfillmentUrlFactory', factory);

    factory.$inject = ['openlmisUrlFactory', 'pathFactory'];

    function factory(openlmisUrlFactory, pathFactory) {

        var fulfillmentUrl = '@@FULLFILMENT_SERVICE_URL';

        if (fulfillmentUrl.substr(0, 2) == '@@') {
            fulfillmentUrl = '';
        }

        /**
         * @ngdoc function
         * @name fulfillmentUrlFactory
         * @methodOf order.fulfillmentUrlFactory
         *
         * @description
         * It parses the given URL and prepend fulfillment service URL to it.
         *
         * @param {String} url fulfillment URL from grunt file
         * @return {String} fulfillment URL
         */
        return function(url) {
            url = pathFactory(fulfillmentUrl, url);
            return openlmisUrlFactory(url);
        }
    }

})();
