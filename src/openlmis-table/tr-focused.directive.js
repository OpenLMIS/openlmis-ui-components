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
     * @ngdoc directive
     * @restrict E
     * @name openlmis-table.directive:trFocusable
     *
     * @description
     * Watches if the user's focus is in the current table row, and exposes
     * that state through trCtrl.
     * 
     */
    
    angular
        .module('openlmis-table')
        .directive('tr', directive);

    function directive() {
        return {
            link: link,
            restrict: 'E'
        };

        function link(scope, element, attrs) {
            var listenerSet;

            element.on('focusin', onFocus);
            scope.$on('$destroy', removeFocusListenters);

            function onFocus(event) {
                element.addClass('is-focused');
                setFocusListenters();
                if (!scope.$$phase) scope.$apply();       
            }

            function onBlur(event) {
                if(!jQuery.contains(element[0], event.target)){
                    element.removeClass('is-focused');
                    removeFocusListenters();
                    if (!scope.$$phase) scope.$apply();
                }
            }

            function setFocusListenters() {
                if(!listenerSet){
                    listenerSet = true;
                    angular.element('body').on('click', onBlur);
                    angular.element('body').on('focusin', onBlur);
                }
            }

            function removeFocusListenters(){
                if(listenerSet){
                    listenerSet = false;
                    angular.element('body').off('focus', onBlur);
                    angular.element('body').off('click', onBlur);
                }
            }
        }

    }

})();
