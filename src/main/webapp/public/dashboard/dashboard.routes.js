(function() {

  "use strict";

  angular.module('openlmis-dashboard').config(routes);

  routes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routes($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'dashboard/home.html',
      showInNavigation: true,
      label: 'link.home'
    })
    .state('404', {
      url: '/404',
      templateUrl: 'dashboard/404.html'
    });

  }

})();