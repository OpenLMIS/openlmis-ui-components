(function(){
  "use strict";

  angular.module('openlmis-core')
  .service('SuccessErrorModal', SuccessErrorModal);

  SuccessErrorModal.$inject = [];

  function SuccessErrorModal() {

    var showSuccess = function (successMessage) {
        return bootbox.dialog({
            title: '<p><i class="fa fa-check-circle-o fa-3x" style="color:green;"/> '
            + successMessage + '</p>',
            message: 'Click or press any button to continue',
            className: 'success-error-modal',
            backdrop: true,
            onEscape: true,
            closeButton: false
        });
    }

    var showError = function (errorMessage) {
        return bootbox.dialog({
            title: '<p><i class="fa fa-times-circle-o fa-3x" style="color:red;"/> '
            + errorMessage + '</p>',
            message: 'Click or press any button to continue',
            className: 'success-error-modal',
            backdrop: true,
            onEscape: true,
            closeButton: false
        });
    }

    return {
        showSuccess:showSuccess,
        showError:showError
    }
  }
})();