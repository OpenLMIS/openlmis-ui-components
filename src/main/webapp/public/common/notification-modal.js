(function(){
    "use strict";

    /**
      * 
      * @ngdoc service
      * @name openlmis-core.NotificationModal
      * @description
      * Service allows to display error/success modal that expires after short with custom message.
      *
      */

    angular.module('openlmis-core')
        .service('NotificationModal', NotificationModal);

    NotificationModal.$inject = ['$rootScope', '$templateRequest', '$compile', '$timeout', 'bootbox', 'messageService'];

    function NotificationModal($rootScope, $templateRequest, $compile, $timeout, bootbox, messageService) {

        function showModal(message, callback, type){
            var scope = $rootScope.$new();
            scope.message = messageService.get(message);
            scope.type = type;

            $templateRequest('common/notification-modal.html').then(function(html){

                var dialog = bootbox.dialog({
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
                    $timeout(function(){
                        dialog.modal('hide');
                    }, 3000);
                });

            });
        }

        /**
          *
          * @ngdoc function
          * @name showSuccess
          * @methodOf openlmis-core.NotificationModal
          * 
          * @description
          * Shows success modal with custom message and callback function called on closing modal.
          *
          */
        function showSuccess(successMessage, callback) {
            showModal(successMessage, callback, 'success');
        }

        /**
          *
          * @ngdoc function
          * @name showError
          * @methodOf openlmis-core.NotificationModal
          * 
          * @description
          * Shows error modal with custom message.
          *
          */
        function showError(errorMessage) {
            showModal(errorMessage, null, 'error');
        }

        return {
            showSuccess: showSuccess,
            showError: showError
        }
    }
})();