(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-auth.openlmisDownload
     *
     * @description
     * Adds an on-click action that will download file from the the url passed as the attribute
     * value. If the given URL doesn't include an access token this directive will add it.
     *
     * @example
     * Add a on click action to a button that will cause it to download a file.
     * ```
     * <button openlmis-download="http://some.url/api/file"></button>
     * ```
     */
    angular
        .module('openlmis-auth')
        .directive('openlmisDownload', directive);

    directive.$inject = ['$window', 'accessTokenFactory'];

    function directive($window, accessTokenFactory) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            element.bind('click', function() {
                $window.location = accessTokenFactory.addAccessToken(attrs.openlmisDownload);
            });
        }
    }

})();
