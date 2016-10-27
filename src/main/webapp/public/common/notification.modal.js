(function(){
  "use strict";

  angular.module('openlmis-core')
  .service('NotificationModal', NotificationModal);

  NotificationModal.$inject = ['$rootScope', '$templateRequest', '$compile', 'bootbox', 'messageService'];

  function NotificationModal($rootScope, $templateRequest, $compile, bootbox, messageService) {

    function showModal(message, callback, type){
        var scope = $rootScope.$new();
        scope.message = messageService.get(message);
        scope.type = type;

        $templateRequest('common/success-error.html').then(function(html){

            var dialog = bootbox.dialog({
                message: $compile(html)(scope),
                className: 'notification-modal',
                backdrop: true,
                onEscape: true,
                closeButton: false
            });

            dialog.init(function(){
                setTimeout(function(){
                    dialog.modal('hide');
                    if (callback) 
                        callback();
                }, 3000);
            });

        });
    }

    var showSuccess = function (successMessage, callback) {
        showModal(successMessage, callback, 'success');
    }

    var showError = function (errorMessage) {
        showModal(errorMessage, null, 'error');
    }

    return {
        showSuccess:showSuccess,
        showError:showError
    }
  }
})();