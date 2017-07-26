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
     * @name openlmis-table.directive:trOpenlmisInvalid
     *
     * @description
     * Sets openlmis-invalid-hidden until the TR has recieved focus once, and
     * subsequently lost it.
     *
     * The table row will also show errors if a containing form control is in
     * the $submitted state, or a openlmis-form-submit event is sent through
     * the scope.
     */
    
    angular
        .module('openlmis-table')
        .directive('tr', directive);

    directive.$inject = ['$compile'];
    function directive() {
        return {
            link: link,
            restrict: 'E',
            require: ['?^^form']
        };

        function link(scope, element, attrs, ctrls) {
            var formCtrl,
                wasFocused = false;

            if(ctrls[0]) {
                formCtrl = ctrls[0];
            }

            element.attr('openlmis-invalid-hidden','');

            scope.$watch(function(){
                return element.hasClass('is-focused');
            }, function(isFocused) {
                if(isFocused) {
                    wasFocused = true;
                }
                if(!isFocused && wasFocused){
                    element.removeAttr('openlmis-invalid-hidden');
                }
            });

            scope.$on('openlmis-form-submit', function(){
                element.removeAttr('openlmis-invalid-hidden');
            });

            if(formCtrl) {
                scope.$watch(function(){
                    return formCtrl.$submitted;
                }, function(isSubmitted){
                    if(isSubmitted){
                        element.removeAttr('openlmis-invalid-hidden');
                    }
                })
            }
        }
    }

})();
