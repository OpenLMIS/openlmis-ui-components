/*
* This program is part of the OpenLMIS logistics management information system platform software.
* Copyright © 2013 VillageReach
*
* This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
*  
* This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
*/

(function(){
    "use strict";

    angular.module('openlmis-core')
        .controller('LocaleController', LocaleController);

    LocaleController.$inject = ['$scope', 'messageService', 'Alert', 'Notification'] 
    function LocaleController($scope, messageService, Alert, Notification) {
        var vm = this;
        // this should be fetched...
        vm.locales = ['en', 'es', 'fr', 'pt'];

        vm.selectedLocale = messageService.getCurrentLocale();
        $scope.$on('openlmis.messages.populated', function(){
            vm.selectedLocale = messageService.getCurrentLocale();
        });

        if(!vm.selectedLocale){
            messageService.populate();
        }

        vm.changeLocale = function (localeKey) {
            messageService.populate(localeKey)
            .then(function(){
                Notification.success('locale.load.success');
            })
            .catch(function(){
                Alert.error('locale.load.error');
            });
        };
    }

})();