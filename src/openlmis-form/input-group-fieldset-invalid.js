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
     * Changes the location of any openlmis-invalid registered error messages,
     * so they are displayed either at the top of the fieldset or immedately
     * below the fieldset's legend.
     *
     * @example
     * If a radio input group is written in the following way, an
     * openlmis-invalid messages section will be added to the fieldset.
     * 
     * ```html
     * <fieldset>
     *   <legend>Example</legend>
     *   <label>
     *     <input type="radio" ng-model="example" value="true" required />
     *     Example radio button group
     *   </label>
     * </fieldset>
     * ```
     *
     * Will become
     * ```html
     * <fieldset input-control openlmis-invalid class="is-invalid">
     *   <legend class="is-required">Example</legend>
     *   <ul class="openlmis-invalid">
     *     <li>This field is required</li>
     *   </ul>
     *   <label>
     *     <input type="radio" ng-model="example" value="true" required />
     *     Example radio button group
     *   </label>
     * </fieldset>
     * ```
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
        };
    }

    function link(scope, element, attrs, ctrls) {
        var inputCtrl = ctrls[0],
            invalidCtrl = ctrls[1];

        if (!inputCtrl || !invalidCtrl) {
            return;
        }

        element.on('openlmisInvalid.show', showMessage);

        function showMessage(event, messageElement) {
            event.preventDefault();
            event.stopPropagation();

            var legend = element.children('legend:first');
            if (legend.length > 0) {
                legend.after(messageElement);
            } else {
                element.prepend(messageElement);
            }
        }
    }

})();