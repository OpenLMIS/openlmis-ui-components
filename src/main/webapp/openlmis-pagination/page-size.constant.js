(function() {

    'use strict';

    angular
        .module('openlmis-pagination')
        .constant('PAGE_SIZE', constant());

    function constant() {
        var pageSize = '@@PAGE_SIZE';
        return (parseInt(pageSize) && parseInt(pageSize) > 0) ? parseInt(pageSize) : 10;
    }

})();
