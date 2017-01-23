(function() {

    'use strict';

    angular
        .module('referencedata')
        .factory('referencedataUrlFactory', factory);

    factory.$inject = ['openlmisUrlFactory', 'pathFactory'];

    function factory(openlmisUrlFactory, pathFactory) {

        var referencedataUrl = '@@REFERENCEDATA_SERVICE_URL';

        if (referencedataUrl.substr(0, 2) == '@@') {
            referencedataUrl = '';
        }

        return function(url) {
            url = pathFactory(referencedataUrl, url);
            return openlmisUrlFactory(url);
        };
    }

})();
