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

    angular.module('openlmis-locale')
        .controller('LocaleController', LocaleController);

    LocaleController.$inject = ['$scope', 'messageService', 'alertService', 'notificationService', 'OPENLMIS_LANGUAGES', '$state']
    function LocaleController($scope, messageService, alertService, notificationService, OPENLMIS_LANGUAGES, $state) {
        var locale = this;
        locale.changeLocale = changeLocale;
        locale.getLocaleName = getLocaleName;
        
        locale.locales = Object.keys(OPENLMIS_LANGUAGES).sort();

        locale.selectedLocale = messageService.getCurrentLocale();
        $scope.$on('openlmis.messages.populated', function(){
            locale.selectedLocale = messageService.getCurrentLocale();
            $state.reload();
        });

        if(!locale.selectedLocale){
            messageService.populate();
        }

        function changeLocale (localeKey) {
            if(localeKey) {
                messageService.populate(localeKey)
                    .then(function () {
                        notificationService.success('locale.load.success');
                    })
                    .catch(function () {
                        alertService.error('locale.load.error');
                    });
            }
        }

        function getLocaleName(key){
            if(OPENLMIS_LANGUAGES[key]){
                return OPENLMIS_LANGUAGES[key];
            }

            return key;
        }
    }

})();
