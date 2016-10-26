(function(){
  "use strict";

  angular.module('openlmis-core')
  .service('SuccessErrorModal', SuccessErrorModal);

  SuccessErrorModal.$inject = [];

  function SuccessErrorModal() {

    var showSuccess = function (successMessage) {
        var dialog = bootbox.dialog({
            title: '<p><i class="fa fa-check-circle-o fa-3x success-icon"/> '
            + successMessage + '</p>',
            message: 'Click or press ESC button to continue',
            className: 'success-error-modal',
            backdrop: true,
            onEscape: true,
            closeButton: false
        });

        dialog.init(function(){
            setTimeout(function(){
                dialog.modal('hide');
            }, 5000);
        });
    }

    var showError = function (errorMessage) {
        var dialog = bootbox.dialog({
            title: '<p><i class="fa fa-times-circle-o fa-3x error-icon"/> '
            + errorMessage + '</p>',
            message: 'Click or press ESC button to continue',
            className: 'success-error-modal',
            backdrop: true,
            onEscape: true,
            closeButton: false
        });

        dialog.init(function(){
            setTimeout(function(){
                dialog.modal('hide');
            }, 5000);
        });
    }

    return {
        showSuccess:showSuccess,
        showError:showError
    }
  }
})();