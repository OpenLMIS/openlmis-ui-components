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
     * @ngdoc controller
     * @name openlmis-table.controller:openlmisTableHeaderTemplateController      *
     *
     * @description - manages rendering the content inside the <td> based on
     *  headerConfig
     *
     */
    angular
        .module('openlmis-table')
        .controller('openlmisTableHeaderTemplateController', openlmisTableHeaderTemplateController);

    openlmisTableHeaderTemplateController.$inject = ['$compile', '$scope', '$timeout', 'uniqueIdService', 'jQuery',
        'openlmisTableService'];

    function openlmisTableHeaderTemplateController($compile, $scope, $timeout, uniqueIdService, jQuery) {
        var $ctrl = this;

        $ctrl.$onInit = onInit;

        function onInit() {
            $ctrl.divId = uniqueIdService.generate();
            if ($ctrl.headerConfig.template) {
                $timeout(function() {
                    injectHtmlContent();
                });
            }
        }

        function injectHtmlContent() {
            var htmlContent = $ctrl.headerConfig.template();
            try {
                var compiledHtml = $compile(angular.element(htmlContent))($scope);
                if (compiledHtml.length === 0) {
                    throw Error('Compilation not possible');
                }

                jQuery('#' + $ctrl.divId).append(compiledHtml);
            } catch (error) {
                jQuery('#' + $ctrl.divId).append(htmlContent);
            }
        }
    }
})();
