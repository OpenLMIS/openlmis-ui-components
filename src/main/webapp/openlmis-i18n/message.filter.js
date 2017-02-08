(function() {

    'use strict';

    angular
        .module('openlmis-i18n')
        .filter('message', messageFilter);

    messageFilter.$inject = ['messageService'];

    function messageFilter(messageService) {
        return function(msg, parameters) {
            return messageService.get(msg, parameters);
        }
    }

})();
