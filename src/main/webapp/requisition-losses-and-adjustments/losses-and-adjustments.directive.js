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
     * @restrict A
     * @name requisition-product-grid.lossesAndAdjustments
     *
     * @description
     * Responsible for creating total losses and adjustments cell in product grid.
     * It opens modal that displays reasons upon clicking it.
     *
     * @example
     * This directive requires 'requisition' and 'line-item' attributes.
     * ```
     * <div losses-and-adjustments
     *     line-item="lineItem"
     *     requisition="requisition"></div>
     * ```
     *
     * This is how will look product grid cell after rendering.
     * ```
     * <a class="losses-and-adjustments" ng-class="{'disabled': vm.isDisabled()}" ng-click="vm.showModal()">
     *     {{vm.lineItem.totalLossesAndAdjustments || 0}}
     * </a>
     * ```
     */
    angular
        .module('requisition-losses-and-adjustments')
        .directive('lossesAndAdjustments', lossesAndAdjustments);

    lossesAndAdjustments.$inject = ['$compile', '$templateRequest', 'messageService'];

    function lossesAndAdjustments($compile, $templateRequest, messageService) {
        var directive = {
            restrict: 'A',
            replace: true,
            controller: 'LossesAndAdjustmentsController',
            controllerAs: 'vm',
            templateUrl: 'requisition-losses-and-adjustments/losses-and-adjustments-cell.html',
            scope: {
                lineItem: '=',
                requisition: '='
            },
            link: link
        }
        return directive;

        function link(scope, element, attr, vm) {
            var dialog;

            vm.showModal = showModal;
            vm.hideModal = hideModal;

            element.on('$destroy', function() {
                if (dialog) dialog.remove();
                dialog = undefined;
            });

            function showModal() {
                $templateRequest('requisition-losses-and-adjustments/losses-and-adjustments-modal.html')
                    .then(function(modal){
                        if (dialog) {
                            dialog.remove();
                            dialog = undefined;
                        }
                        dialog = bootbox.dialog({
                            title: messageService.get('label.losses.adjustments'),
                            message: $compile(modal)(scope),
                            backdrop: true,
                            onEscape: true,
                            closeButton: true
                        });
                    }
                );
            }

            function hideModal() {
                dialog.modal('hide');
                dialog = undefined;
            }
        }
    }

})();
