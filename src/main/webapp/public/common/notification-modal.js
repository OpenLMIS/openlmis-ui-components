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

    NotificationModal.$inject = ['$rootScope', '$templateCache', '$templateRequest', '$compile', '$timeout', '$q', 'bootbox', 'messageService'];

    function NotificationModal($rootScope, $templateCache, $templateRequest, $compile, $timeout, $q, bootbox, messageService) {
        var templateURL = 'common/notification-modal.html';

        function showModal(message, type){
            var deferred = $q.defer(),
                scope = $rootScope.$new();
            scope.message = messageService.get(message);
            scope.type = type;

            // Made function within scope to deal with cache checking
            function makeModal(html) {
                var timeoutPromise,
                    dialog = bootbox.dialog({
                        message: $compile(html)(scope),
                        className: 'notification-modal',
                        backdrop: true,
                        onEscape: true,
                        closeButton: false
                    });

                dialog.on('click.bs.modal', function(){
                    dialog.modal('hide');
                });
                dialog.on('hide.bs.modal', function(){
                    deferred.resolve();
                    if(timeoutPromise){
                        $timeout.cancel(timeoutPromise);
                    }
                });
                dialog.on('hidden.bs.modal', function(){
                    angular.element(document.querySelector('.notification-modal')).remove();
                });

                timeoutPromise = $timeout(function(){
                    dialog.modal('hide');
                }, 3000);
            }

            var template = $templateCache.get(templateURL);
            if (template){
                makeModal(template);
            } else {
                $templateRequest(templateURL).then(makeModal);
            }

            return deferred.promise;
        }

        /**
            *
            * @ngdoc function
            * @name showSuccess
            * @methodOf openlmis-core.NotificationModal
            * 
            * @description
            * Shows success modal with custom message and return promise.
            *
            */
        function showSuccess(successMessage) {
            return showModal(successMessage, 'success');
        }

        /**
            *
            * @ngdoc function
            * @name showError
            * @methodOf openlmis-core.NotificationModal
            * 
            * @description
            * Shows error modal with custom message and return promise.
            *
            */
        function showError(errorMessage) {
            return showModal(errorMessage, 'error');
        }

        return {
            showSuccess: showSuccess,
            showError: showError
        }
    }
})();