
(function(){
    "use strict";

    angular.module('openlmis-i18n')
        .filter('message', messageFilter);

    messageFilter.$inject = ['messageService'];
    function messageFilter(messageService){
        return function(msg){
            return messageService.get(msg);
        }
    }

})();
