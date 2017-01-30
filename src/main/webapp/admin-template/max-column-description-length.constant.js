(function() {

    'use strict';

    angular
        .module('admin-template')
        .constant('MAX_COLUMN_DESCRIPTION_LENGTH', constant());

    function constant() {

        return 140;
    }

})();
