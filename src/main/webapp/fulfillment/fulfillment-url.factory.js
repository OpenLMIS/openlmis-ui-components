(function() {

    'use strict';

    /**
     *
     * @ngdoc service
     * @name fulfillment.fulfillmentUrlFactory
     *
     * @description
     * Supplies application with fulfillment URL.
     */
    angular
        .module('fulfillment')
        .factory('fulfillmentUrlFactory', factory);

    factory.$inject = ['openlmisUrlFactory', 'pathFactory'];

    function factory(openlmisUrlFactory, pathFactory) {

        var fulfillmentUrl = '@@FULFILLMENT_SERVICE_URL';

        if (fulfillmentUrl.substr(0, 2) == '@@') {
            fulfillmentUrl = '';
        }

        /**
         * @ngdoc function
         * @name fulfillmentUrlFactory
         * @methodOf fulfillment.fulfillmentUrlFactory
         *
         * @description
         * It parses the given URL and appends fulfillment service URL to it.
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
