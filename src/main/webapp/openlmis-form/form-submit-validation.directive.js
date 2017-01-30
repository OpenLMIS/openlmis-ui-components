(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-form.form
     *
     * @description
     *
     */
    angular
        .module('openlmis-form')
        .directive('form', directive);

    function directive() {
        var directive = {
            link: link,
            require: 'form'
        };
        return directive;
    }

    function link(scope, element, attrs, form) {
        element.bind('submit', function(event) {
            if (form.$invalid) {
                event.preventDefault();
                form.$setSubmitted();
                return false;
            }
        });
    }

})();
