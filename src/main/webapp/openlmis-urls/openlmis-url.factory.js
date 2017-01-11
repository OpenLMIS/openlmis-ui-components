(function() {

    'use strict';

    angular
        .module('openlmis-urls')
        .factory('openlmisUrlFactory', factory);

    factory.$inject = ['openlmisUrlService'];

    function factory(openlmisUrlService) {
        return function() {
            return openlmisUrlService.format.apply(this, arguments);
        }
    }

})();
