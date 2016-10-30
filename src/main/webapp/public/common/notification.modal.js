(function(){
  "use strict";

  angular.module('openlmis-core')
  .service('NotificationModal', NotificationModal);

  NotificationModal.$inject = ['$rootScope', '$templateRequest', '$compile', 'bootbox', 'messageService'];

  function NotificationModal($rootScope, $templateRequest, $compile, bootbox, messageService) {

    function showModal(message, callback, type){
        var scope = $rootScope.$new();
        scope.message = messageService.get(message);
        scope.footerMessage = messageService.get('msg.notification.modal.footer');
        scope.type = type;

        $templateRequest('common/notification-modal.html').then(function(html){

            var isClosed = false,
                dialog = bootbox.dialog({
                    message: $compile(html)(scope),
                    className: 'notification-modal',
                    backdrop: true,
                    onEscape: true,
                    closeButton: false
                }).on('hide.bs.modal', function(e) {
                    if(callback) callback();
                }).on('click.bs.modal', function(e) {
                    dialog.modal('hide');
                }
            );

            dialog.init(function(){
                setTimeout(function(){
                    dialog.modal('hide');
                }, 3000);
            });

        });
    }

    function showSuccess(successMessage, callback) {
        showModal(successMessage, callback, 'success');
    }

    function showError(errorMessage) {
        showModal(errorMessage, null, 'error');
    }

    return {
        showSuccess: showSuccess,
        showError: showError
    }
  }
})();