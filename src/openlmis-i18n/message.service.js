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
     * @name openlmis-i18n.messageService
     *
     * @description
     * Responsible for retrieving messages.
     */
    angular
        .module('openlmis-i18n')
        .factory('messageService', messageService);

    var LOCALE_STORAGE_KEY = 'current_locale';

    messageService.$inject = ['$q', '$rootScope', 'OPENLMIS_MESSAGES', 'DEFAULT_LANGUAGE', 'localStorageService'];

    function messageService($q, $rootScope, OPENLMIS_MESSAGES, DEFAULT_LANGUAGE, localStorageService) {

        var service = {
            getCurrentLocale: getCurrentLocale,
            populate: populate,
            get: get
        };

        return service;

        /**
         * @ngdoc method
         * @methodOf openlmis-i18n.messageService
         * @name getCurrentLocale
         *
         * @description
         * Returns current locale.
         *
         * @return {String} current locale
         */
        function getCurrentLocale() {
            return localStorageService.get(LOCALE_STORAGE_KEY);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-i18n.messageService
         * @name populate
         *
         * @description
         * Returns current locale.
         *
         * @param  {String}  locale (optional) locale to populate
         * @return {Promise}        Promise
         */
        function populate(locale) {
            if(!locale) locale = DEFAULT_LANGUAGE;

            var deferred = $q.defer();
            if(OPENLMIS_MESSAGES[locale]){
                localStorageService.add(LOCALE_STORAGE_KEY, locale);
                $rootScope.$broadcast('openlmis.messages.populated');
                return $q.when();
            } else {
                return $q.reject();
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-i18n.messageService
         * @name get
         *
         * @description
         * Returns message for current locale.
         *
         * @return {String} display message
         */
        function get() {
            var keyWithArgs = Array.prototype.slice.call(arguments);
            var displayMessage = keyWithArgs[0];
            var parameters = keyWithArgs[1];
            var currentLocale = getCurrentLocale();
            if(OPENLMIS_MESSAGES[currentLocale] && OPENLMIS_MESSAGES[currentLocale][keyWithArgs[0]]){
                displayMessage = OPENLMIS_MESSAGES[currentLocale][keyWithArgs[0]]
            }
            if (parameters) {
                displayMessage = displayMessage.replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function(_, match){
                    return parameters[match.trim()];
                });
            }
            return displayMessage;
        }
    }

})();
