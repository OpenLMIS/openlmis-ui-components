(function(){
  "use strict";

  /**
    *
    * @ngdoc service
    * @name openlmis-auth.InterceptorService
    * @description
    * Helper service for auth-interceptor
    *
    */

  angular.module('openlmis-auth')
  .service('InterceptorService', InterceptorService);

  InterceptorService.$inject = ['$rootScope', '$compile', 'bootbox', '$templateRequest', 'LoadingModalService', 'LoginService', 'messageService', 'authService'];
  function InterceptorService($rootScope, $compile, bootbox, $templateRequest, LoadingModalService, LoginService, messageService, authService) {
    var service = {};

    service.onLoginRequired = onLoginRequired;

    /**
      *
      * @ngdoc function
      * @name onLoginRequired
      * @methodOf openlmis-auth.InterceptorService
      * @param {boolean} reload true if reload page after login
      *
      * @description
      * Make and show login modal, close loading modal.
      *
      */
    function onLoginRequired(reload) {
      var scope = $rootScope.$new();

      scope.doLogin = doLogin;

      $templateRequest('auth/login-modal.html').then(function(html){
        scope.dialog = bootbox.dialog({
          message: $compile(html)(scope),
          size: 'large',
          closeButton: false
        });
      });
      LoadingModalService.close();

      function doLogin() {
        LoginService.login(scope.username, scope.password)
        .then(function(){
          scope.dialog.modal('hide');
          if (reload == true) {
            location.reload();
          } else {
            authService.loginConfirmed();
          }
        })
        .catch(function(){
          scope.loginError = messageService.get("user.login.error");
        })
        .finally(function(){
          scope.password = undefined;
        });
      }
    }

    return service;
  }

})();
