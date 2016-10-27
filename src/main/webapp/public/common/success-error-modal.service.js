(function(){
  "use strict";

  angular.module('openlmis-core')
  .service('SuccessErrorModal', SuccessErrorModal);

  SuccessErrorModal.$inject = ['$rootScope', '$templateRequest', '$compile', 'bootbox'];

  function SuccessErrorModal($rootScope, $templateRequest, $compile, bootbox) {

    function showModal(message, type){
        var scope = $rootScope.$new();
        scope.message = message;
        scope.type = type;

        $templateRequest('common/success-error.html')
        .then(function(html){

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
                }, 5000);
            });

        });
    }

    var showSuccess = function (successMessage) {
        showModal(successMessage, 'success');
    }

    var showError = function (errorMessage) {
        showModal(errorMessage, 'error');
    }

    return {
        showSuccess:showSuccess,
        showError:showError
    }
  }
})();