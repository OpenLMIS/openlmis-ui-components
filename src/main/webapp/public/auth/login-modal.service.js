(function(){
  "use strict";

  /**
    *
    * @ngdoc service
    * @name openlmis-auth.LoginModalService
    * @description
    * Helper service for auth-interceptor
    *
    */

  angular.module('openlmis-auth')
  .service('LoginModalService', LoginModalService);

  LoginModalService.$inject = ['$rootScope', '$compile', 'bootbox', '$templateRequest', 'LoadingModalService', 'LoginService', 'messageService', 'authService', '$q'];
  function LoginModalService($rootScope, $compile, bootbox, $templateRequest, LoadingModalService, LoginService, messageService, authService, $q) {

    this.onLoginRequired = onLoginRequired;

    /**
      *
      * @ngdoc function
      * @name onLoginRequired
      * @methodOf openlmis-auth.LoginModalService
      * @param {boolean} reload true if reload page after login
      *
      * @description
      * Make and show login modal, close loading modal.
      *
      */
    function onLoginRequired(noRetryRequest) {
      var deferred = $q.defer();
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
        LoginService.login(scope.username, scope.password).then(function(){
          scope.dialog.modal('hide');
          if (noRetryRequest == true) {
            deferred.resolve();
          } else {
            authService.loginConfirmed();
            deferred.reject();
          }
        })
        .catch(function(){
          scope.loginError = messageService.get("user.login.error");
        })
        .finally(function(){
          scope.password = undefined;
        });
      }

      return deferred.promise;
    }
  }

})();
