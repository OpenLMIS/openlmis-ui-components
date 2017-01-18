(function() {

    'use strict';

    /**
     *
     * @ngdoc service
     * @name order.fullfilmentUrlFactory
     *
     * @description
     * Supplies application with fullfilment URL.
     */
    angular
        .module('order')
        .factory('fullfilmentUrlFactory', factory);

    factory.$inject = ['openlmisUrlFactory', 'pathFactory'];

    function factory(openlmisUrlFactory, pathFactory) {

        var fullfilmentUrl = '@@FULLFILMENT_SERVICE_URL';

        if (fullfilmentUrl.substr(0, 2) == '@@') {
            fullfilmentUrl = '';
        }

        /**
         * @ngdoc function
         * @name fullfilmentUrlFactory
         * @methodOf order.fullfilmentUrlFactory
         *
         * @description
         * Returns fullfilment URL based on flag from grunt file.
         *
         * @param {String} url fullfilment URL from grunt file
         * @return {String} fullfilment URL
         */
        return function(url) {
            url = pathFactory(fullfilmentUrl, url);
            return openlmisUrlFactory(url);
        }
    }

})();
