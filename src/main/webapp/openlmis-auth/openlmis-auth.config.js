(function() {

    'use strict';

    angular
        .module('openlmis-auth')
        .config(config);

    config.$inject = ['$httpProvider'];

    function config($httpProvider) {
        $httpProvider.interceptors.push('accessTokenProvider');
    }

})();
