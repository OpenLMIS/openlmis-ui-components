/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */


(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-login.loginRequiredInterceptor
     *
     * @description
     * When there is 401 unauthorized status code after request, the user is shown login modal
     * window. After authenticate request is retried.
     */
    angular
        .module('openlmis-login')
        .run(loginRequiredInterceptor);

    loginRequiredInterceptor.$inject = [
        '$rootScope', '$compile', 'bootbox', '$templateRequest', 'loadingModalService',
        'authService', 'accessTokenFactory'
    ];

    function loginRequiredInterceptor($rootScope, $compile, bootbox, $templateRequest,
                                      loadingModalService, authService, accessTokenFactory) {

        var noRetryRequest, dialog, dialogScope;

        $rootScope.$on('event:auth-loginRequired', onLoginRequired);
        $rootScope.$on('auth.login-modal', onLoginModal);

        /**
         * @ngdoc method
         * @methodOf openlmis-login.loginRequiredInterceptor
         * @name onLoginRequired
         *
         * @description
         * Make and show login modal, close loading modal.
         *
         * @param {Object}  event          event
         * @param {Boolean} noRetryRequest true if should no retry request
         */
        function onLoginRequired(event, _noRetryRequest_) {
            noRetryRequest = _noRetryRequest_;

            if (dialogScope) dialogScope.$destroy();
            dialogScope = $rootScope.$new();

            $templateRequest('openlmis-login/login-form.html').then(function(html) {
                dialog = bootbox.dialog({
                    message: $compile(html)(dialogScope),
                    closeButton: false,
                    className: 'login-modal'
                });
            });
            loadingModalService.close();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-login.loginRequiredInterceptor
         * @name onLoginModal
         *
         * @description
         * Hides login modal and updates access token.
         */
        function onLoginModal() {
            dialog.modal('hide');
            dialog = undefined;
            dialogScope.$destroy();

            if (noRetryRequest === true) {
                $rootScope.$emit('event:auth-loggedIn');
            } else {
                authService.loginConfirmed(null, function(config) {
                    config.url = accessTokenFactory.updateAccessToken(config.url);
                    return config;
                });
            }
        }
    }
})();
