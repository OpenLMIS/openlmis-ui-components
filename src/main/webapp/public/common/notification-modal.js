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

    NotificationModal.$inject = ['$rootScope', '$templateCache', '$templateRequest', '$compile', '$timeout', 'bootbox', 'messageService'];

    function NotificationModal($rootScope, $templateCache, $templateRequest, $compile, $timeout, bootbox, messageService) {
        var templateURL = 'common/notification-modal.html';

        function showModal(message, callback, type){
            var scope = $rootScope.$new();
            scope.message = messageService.get(message);
            scope.type = type;

            // Made function within scope to deal with cache checking
            function makeModal(html){
              var timeoutPromise;

              var dialog = bootbox.dialog({
                  message: $compile(html)(scope),
                  className: 'notification-modal',
                  backdrop: true,
                  onEscape: true,
                  closeButton: false,
                  callback: callback
              });

              dialog.on('click.bs.modal', function(){
                dialog.modal('hide');
              });
              dialog.on('hide.bs.modal', function(){
                if(callback) callback();
                if(timeoutPromise){
                  $timeout.cancel(timeoutPromise);
                }
              });
              dialog.on('hidden.bs.modal', function(){
                // remove modal from DOM
              });

              timeoutPromise = $timeout(function(){
                dialog.modal('hide');
                if(callback) callback();
              }, 3000);
            }

            var tempalte = $templateCache.get(templateURL);
            if(tempalte){
              makeModal(tempalte);
            } else {
              $templateRequest(templateURL).then(makeModal);
            }
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