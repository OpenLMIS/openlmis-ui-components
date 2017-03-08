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
     * @name openlmis-form.directive:select-search-option
     *
     * @description
     * Disables select dropdown and displays modal with options and search input.
     * This functionality will be applied to select when there is
     * more than 10 options or it has pop-out attribute.
     *
     * @example
     * ```
     * <select .... pop-out ... > ..... </select>
     * ```
     */
    angular
        .module('openlmis-form')
        .directive('select', select);

    select.$inject = ['bootbox', '$rootScope', '$compile', '$templateRequest'];

    function select(bootbox, $rootScope, $compile, $templateRequest) {
        return {
            restrict: 'E',
            replace: false,
            require: ['select', '?ngModel'],
            link: link
        };

        function link(scope, element, attrs, ctrls) {
            var selectCtrl = ctrls[0],
                ngModelCtrl = ctrls[1],
                modal, modalScope;

            element.off('click');

            element.on('mousedown', function (event) {
                if(isPopOut()) {
                    event.stopPropagation();
                    element.attr('disabled', true);
                    showModal();
                }
            });

            element.bind('keydown', function (event) {
                if(isPopOut() && event.which === 13) {
                    event.stopPropagation();
                    element.attr('disabled', true);
                    showModal();
                }
            });

            element.on('$destroy', function() {
                modal = undefined;
                if (modalScope) modalScope.$destroy();
            });

            updateSelect();
            if(ngModelCtrl) {
                // using instead of $ngModelCtrl.$render
                // beacuse ngSelect uses it
                scope.$watch(function() {
                    return ngModelCtrl.$modelValue;
                }, updateSelect);

                // See if ng-repeat or ng-options changed
                scope.$watch(function() {
                    return element.html();
                }, updateSelect);
            }

            function updateSelect() {
                if(isPopOut()) {
                    element.addClass('pop-out');
                } else {
                    element.removeClass('pop-out');
                }
            }

            function showModal() {
                $templateRequest('openlmis-form/select-search-option.html').then(function(template) {
                    if (modalScope) modalScope.$destroy();
                    modalScope = $rootScope.$new();

                    modalScope.options = getOptions();
                    modalScope.select = selectOption;
                    modalScope.findSelectedOption = findSelectedOption;

                    modalScope.findSelectedOption();

                    modal = bootbox.dialog({
                        title: getModalTitle(element),
                        message: $compile(template)(modalScope),
                        backdrop: true,
                        onEscape: closeModal
                    });
                });
            }

            function closeModal() {
                element.attr('disabled', false);
                if (modalScope) modalScope.$destroy();
                if(modal){
                    modal.modal('hide');
                }
            }

            function findSelectedOption() {
                var selectedOption,
                    scope = this;

                angular.forEach(this.options, function(option) {
                    if(option.selected) selectedOption = option;
                });

                this.selected = selectedOption;
            }

            function getOptions() {
                var options = [];

                angular.forEach(element.children('option:not(.placeholder)'), function(option) {
                    options.push(angular.element(option)[0]);
                });

                return options;
            }

            function selectOption(option) {
                element.children('option[selected="selected"]').removeAttr('selected');
                element.children('option[label="' + option.label + '"]').attr('selected', 'selected');

                ngModelCtrl.$setViewValue(selectCtrl.readValue());
                closeModal();
            }

            function isPopOut() {
                return (attrs.popOut !== null && attrs.popOut !== undefined) ||
                    (getOptions().length > 10);
            }

            function getModalTitle(element) {
                var labelElement = element.siblings('label[for="' + element[0].id + '"]');
                return labelElement[0] ? labelElement[0].textContent : '';
            }
        }
    }
})();
