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
     * @name openlmis-form.directive:input-group-fieldset-invalid
     *
     * @description
     * Fieldset specific behavior for an input-control.
     */
    
    angular
        .module('openlmis-form')
        .directive('fieldset', directive);

    function directive() {
        return {
            link: link,
            restrict: 'E',
            priority: 1,
            require: [
                '?inputControl',
                '?openlmisInvalid'
            ]
        }
    }

    function link(scope, element, attrs, ctrls) {
    	var inputCtrl = ctrls[0],
            invalidCtrl = ctrls[1];

        if(!inputCtrl || !invalidCtrl) {
    		return;
    	}

        scope.$on('openlmisInvalid.show', showMessage);

        function showMessage(event, targetElement, messageElement) {
            if(targetElement !== element){
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            var legend = element.children('legend:first');
            if(legend.length > 0) {
                legend.after(messageElement);
            } else {
                element.prepend(messageElement);
            }
        }
    }

})();