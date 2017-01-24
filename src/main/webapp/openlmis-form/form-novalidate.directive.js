(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-form.form
     *
     * @description
     * Dynamically adds novalidate directive to the form.
     */
    angular
        .module('openlmis-form')
        .directive('form', directive);

    function directive() {
        var directive = {
            link: link,
            restrict: 'E'
        };
        return directive;
    }

    function link(scope, element, attrs) {
        element.attr('novalidate', '');
    }

})();
