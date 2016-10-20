(function() {

  "use strict";

  angular.module('openlmis-dashboard').config(routes);

  routes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routes($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'dashboard/home.html'
    })
    .state('404', {
      url: '/404',
      templateUrl: 'dashboard/404.html'
    });

  }

})();