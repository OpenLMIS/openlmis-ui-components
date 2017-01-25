(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name referencedata.referencedataUrlFactory
     *
     * @description
     * Supplies application with referencedata URL.
     */
    angular
        .module('referencedata')
        .factory('referencedataUrlFactory', factory);

    factory.$inject = ['openlmisUrlFactory', 'pathFactory'];

    function factory(openlmisUrlFactory, pathFactory) {

        var referencedataUrl = '@@REFERENCEDATA_SERVICE_URL';

        if (referencedataUrl.substr(0, 2) == '@@') {
            referencedataUrl = '';
        }

        /**
         * @ngdoc function
         * @name referencedataUrlFactory
         * @methodOf referencedata.referencedataUrlFactory
         *
         * @description
         * It parses the given URL and appends referencedata service URL to it.
         *
         * @param {String} url referencedata URL from grunt file
         * @return {String} referencedata URL
         */
        return function(url) {
            url = pathFactory(referencedataUrl, url);
            return openlmisUrlFactory(url);
        };
    }

})();
