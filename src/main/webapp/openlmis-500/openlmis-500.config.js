(function() {

    'use strict';

    angular
        .module('openlmis-500')
        .config(config);

    config.$inject = ['$httpProvider'];

    function config($httpProvider) {
        $httpProvider.interceptors.push('serverErrorHandler');
    }

})();
