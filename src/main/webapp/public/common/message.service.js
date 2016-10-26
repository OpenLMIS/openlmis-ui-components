
(function(){
  "use strict";

  angular.module('openlmis-core')
    .factory('messageService', messageService);

  messageService.$inject = ['localStorageService', '$rootScope', 'version', '$http'];

  function messageService (localStorageService, $rootScope, version, $http) {

    var populate = function (selectedLocale) {
      if (localStorageService.get('version') != version) {
        localStorageService.add('version', version);
        $http.get('/public/messages/messages_' + selectedLocale + '.json').success(function (data) {
          for (var attr in data) {
            localStorageService.add('message.' + attr, data[attr]);
          }
          $rootScope.$broadcast('messagesPopulated');
        });
      }
    };

    var get = function () {
      var keyWithArgs = Array.prototype.slice.call(arguments);
      var displayMessage =  localStorageService.get('message.' + keyWithArgs[0]);
      if(keyWithArgs.length > 1 && displayMessage) {
        $.each(keyWithArgs, function (index, arg) {
          if (index > 0) {
            displayMessage = displayMessage.replace("{" + (index-1) + "}", arg);
          }
        });
      }
      return displayMessage || keyWithArgs[0];
    };

    return{
      populate:populate,
      get:get
    };
  }

})();
