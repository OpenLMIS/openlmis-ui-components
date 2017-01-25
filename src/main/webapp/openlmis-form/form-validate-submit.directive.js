(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-form.formValidateSubmit
     *
     * @description
     * Prevents from from submitting invalid forms.
     */
    angular
        .module('openlmis-form')
        .directive('form', directive);

    function directive() {
        var directive = {
            link: link,
            priority: -1,
            require: 'form'
        };
        return directive;
    }

    function link(scope, element, attrs, form) {
        element.on('submit', function(event) {
            if (form.$invalid) {
                event.stopImmediatePropagation();
            }
        });
    }

})();
