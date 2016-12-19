
(function(){
    "use strict";

    angular.module('openlmis-core')
        .filter('message', messageFilter);

    messageFilter.$inject = ['messageService'];
    function messageFilter(messageService){
        return function(msg){
            return messageService.get(msg);
        }
    }

})();