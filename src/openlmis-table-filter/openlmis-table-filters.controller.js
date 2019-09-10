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
     * @name openlmis-table-filter.controller:OpenlmisTableFiltersController
     *
     * @description
     * Handles element registration and places the registered elements inside the filter form
     * element.
     */
    angular
        .module('openlmis-table-filter')
        .controller('OpenlmisTableFiltersController', OpenlmisTableFiltersController);

    OpenlmisTableFiltersController.$inject = ['$scope', '$compile', '$timeout'];

    function OpenlmisTableFiltersController($scope, $compile, $timeout) {
        var form, forms, submitButton, filterButton, ngModels, ngModelValues,
            SUBMIT_ELEMENT = '[type="submit"]',
            NGMODEL_ELEMENT = '[ng-model]',
            vm = this;

        vm.registerElement = registerElement;
        vm.getFormElement = getFormElement;
        vm.getFilterButton = getFilterButton;
        vm.$onDestroy = onDestroy;

        /**
         * @ngdoc method
         * @methodOf openlmis-table-filter.controller:OpenlmisTableFiltersController
         * @name registerElement
         *
         * @description
         * Registers the given element and places it inside the filter form. If the registered
         * element is a form its content is copied to the filter form and the form is detached from
         * the DOM. If a submit type element is registered(or element containing one) it will
         * override the current filter form submit button. Any other element will be moved inside
         * the filter form.
         *
         * @param  {Object} element the element to be registered
         */
        function registerElement(element, container) {
            if (!form) {
                initializeElements(container);
            }
            replaceSubmitButtonIfElementContainsSubmitButton(element);

            if (element.is('form')) {
                registerForm(element);
            } else if (element.is(SUBMIT_ELEMENT)) {
                submitButton.replaceWith(element);
            } else {
                form.prepend(element);
            }

            filterButton.show();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-table-filter.controller:OpenlmisTableFiltersController
         * @name getFormElement
         *
         * @description
         * Returns the filter form element.
         *
         * @return  {Object}    the filter form element
         */
        function getFormElement() {
            return form;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-table-filter.controller:OpenlmisTableFiltersController
         * @name getFilterButton
         *
         * @description
         * Returns the filter button element.
         *
         * @return  {Object}    the filter button element
         */
        function getFilterButton() {
            return filterButton;
        }

        function initializeElements(container) {
            form = compileForm();
            form.on('submit', submitForms);

            $timeout(function() {
                ngModels = getNgModels();
                ngModelValues = getAllModelValues(ngModels);
                $scope.count = getDefinedModelsLength(ngModels);
                updateButtonState();
            }, 50);

            filterButton = compileFilterButton(container);
            submitButton = form.find(SUBMIT_ELEMENT);

            openPopoverIfFormIsInvalidAndPristine();
        }

        function submitForms() {
            if (forms) {
                forms.each(submitForm);
            }
            broadcastEvent();
        }

        function submitForm(index, form) {
            angular.element(form)
                .trigger('submit');
        }

        function broadcastEvent() {
            var modelValues = getAllModelValues(ngModels);
            $scope.$broadcast('openlmis-table-filter', modelValues);
        }

        function registerForm(element) {
            addForm(element);
            form.prepend(element.children()
                .not(SUBMIT_ELEMENT));
            element.detach();
        }

        function replaceSubmitButtonIfElementContainsSubmitButton(element) {
            var submit = element.find(SUBMIT_ELEMENT);
            if (submit.length) {
                submitButton.replaceWith(submit);
            }
        }

        function addForm(form) {
            if (forms) {
                forms.push(form);
            } else {
                forms = form;
            }
        }

        function onDestroy() {
            if (filterButton) {
                hidePopover();
                filterButton.remove();
                filterButton = undefined;
            }

            if (submitButton) {
                submitButton.remove();
                submitButton = undefined;
            }

            if (form) {
                form.remove();
                form = undefined;
            }

            if (forms) {
                removeForms();
                forms = undefined;
            }
        }

        function removeForms() {
            if (forms) {
                forms.each(function(index, form) {
                    form.remove();
                });
            }
        }

        function openPopoverIfFormIsInvalidAndPristine() {
            var stopWatch = $scope.$watch(isFormInvalidAndPristine,
                openPopoverAndStopWatch,
                true);

            function openPopoverAndStopWatch(isInvalidAndPristine) {
                if (isInvalidAndPristine) {
                    filterButton.popover('show');
                    stopWatch();
                }
            }
        }

        function isFormInvalidAndPristine() {
            var formCtrl = form.controller('form');
            if (!formCtrl) {
                return false;
            }
            return formCtrl.$invalid && formCtrl.$pristine;
        }

        function compileForm() {
            return compileElement('<form>' +
                    '<input id="close-filters" type="button" value="{{\'openlmisTableFilter.cancel\' | message}}"/>' +
                    '<input type="submit" value="{{\'openlmisTableFilter.update\' | message}}"/>' +
                '</form>');
        }

        function compileFilterButton(container) {
            var filterButton = compileElement('<button class="filters {{class}}">' +
                    '{{\'openlmisTableFilter.filter\' | message }}' +
                    '<span ng-if="count && count !== 0">({{count}})</span>' +
                '</button>');

            filterButton.popover({
                html: true,
                container: container,
                placement: 'auto top',
                content: form
            })
                .data('bs.popover')
                .tip()
                .addClass('openlmis-table-filters');
            filterButton.hide();

            form.on('submit', hidePopover);
            form.find('#close-filters')
                .on('click', hidePopover);

            return filterButton;
        }

        function compileElement(markup) {
            return $compile(angular.element(markup))($scope);
        }

        function hidePopover() {
            filterButton.popover('hide');
            filterButton.data('bs.popover').inState.click = false;

            if (isFormSubmitted()) {
                $scope.count = getDefinedModelsLength(ngModels);
                updateButtonState();
            } else {
                _.defer(function() {
                    $scope.$apply(rollbackChanges);
                });
            }
        }

        function getNgModels() {
            var modelValues = {};
            form.find(NGMODEL_ELEMENT)
                .each(function(index, formElement) {
                    var name = getName(formElement),
                        ngModel = getModel(formElement);

                    modelValues[name] = ngModel;
                });
            return modelValues;
        }

        function rollbackChanges() {
            form.find(NGMODEL_ELEMENT)
                .each(function(index, formElement) {
                    var name = getName(formElement),
                        ngModel = getModel(formElement),
                        modelValue = ngModel.$modelValue,
                        previousValue = ngModelValues[name];

                    if (modelValue !== previousValue) {
                        ngModel.$setViewValue(previousValue);
                        ngModel.$render();
                    }
                });
        }

        function getModel(formElement) {
            return angular.element(formElement)
                .controller('ngModel');
        }

        function getName(formElement) {
            return angular.element(formElement)
                .attr('name');
        }

        function getDefinedModelsLength(models) {
            return Object.keys(models)
                .filter(function(key) {
                    return models[key].$modelValue;
                }).length;
        }

        function getAllModelValues(models) {
            var modelValues = {};
            Object.keys(models)
                .forEach(function(key) {
                    modelValues[key] = models[key].$modelValue;
                });
            return modelValues;
        }

        function updateButtonState() {
            if ($scope.count && $scope.count !== 0) {
                $scope.class = 'is-active';
            } else {
                $scope.class = undefined;
            }
        }

        function isFormSubmitted() {
            return form.controller('form').$submitted;
        }
    }

})();
