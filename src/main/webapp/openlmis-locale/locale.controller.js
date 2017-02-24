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


(function(){
    "use strict";

    /**
     * @ngdoc controller
     * @name openlmis-locale.controller:LocaleController
     *
     * @description
     * Controller that drives locale.
     */
    angular.module('openlmis-locale')
        .controller('LocaleController', LocaleController);

    LocaleController.$inject = ['$scope', 'messageService', 'alertService', 'notificationService', 'OPENLMIS_LANGUAGES', '$window']
    function LocaleController($scope, messageService, alertService, notificationService, OPENLMIS_LANGUAGES, $window) {
        var locale = this;
        locale.changeLocale = changeLocale;
        locale.getLocaleName = getLocaleName;

        locale.locales = Object.keys(OPENLMIS_LANGUAGES).sort();

        locale.selectedLocale = messageService.getCurrentLocale();
        $scope.$on('openlmis.messages.populated', function(){
            locale.selectedLocale = messageService.getCurrentLocale();
            $window.location.reload();
        });

        if(!locale.selectedLocale){
            messageService.populate();
        }

        /**
         * @ngdoc method
         * @name changeLocale
         * @methodOf openlmis-locale.controller:LocaleController
         *
         * @description
         * Changes locale to selected.
         *
         * @param {String} localeKey key of locale which user want to change to
         */
        function changeLocale (localeKey) {
            if(localeKey) {
                messageService.populate(localeKey)
                    .catch(function () {
                        alertService.error('locale.load.error');
                    });
            }
        }

        /**
         * @ngdoc method
         * @name getLocaleName
         * @methodOf openlmis-locale.controller:LocaleController
         *
         * @description
         * Get locale by name.
         *
         * @param {String} key  key of locale
         * @return              locale name
         */
        function getLocaleName(key){
            if(OPENLMIS_LANGUAGES[key]){
                return OPENLMIS_LANGUAGES[key];
            }

            return key;
        }
    }

})();
