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

    OpenlmisTableFiltersController.$inject = ['$scope', '$compile']

    function OpenlmisTableFiltersController($scope, $compile) {
        var form, forms, submitButton, filterButton,
            SUBMIT_ELEMENT = '[type="submit"]',
            NGMODEL_ELEMENT = '[ng-model]',
            vm = this;

        vm.$onInit = onInit;
        vm.registerElement = registerElement;
        vm.getFormElement = getFormElement;
        vm.getFilterButton = getFilterButton;
        vm.$onDestroy = onDestroy;

        /**
         * @ngdoc method
         * @methodOf openlmis-table-filter.controller:OpenlmisTableFiltersController
         * @name $onInit
         *
         * @description
         * Initialization method of the OpenlmisTableFiltersController. Creates filter form and
         * button and exposes them to the openlmisTableFilters directive.
         */
        function onInit() {
            form = compileForm();
            form.on('submit', submitForms);
            $scope.count = 0;

            $scope.$watchCollection(getNgModels, function(newValue, oldValue) {
                if (newValue.length && newValue[0] !== undefined) {
                    $scope.count++;
                }
            });

            filterButton = compileFilterButton();
            submitButton = form.find(SUBMIT_ELEMENT);

            openPopoverIfFormIsInvalidAndPristine();
        }

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
        function registerElement(element) {
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

        function submitForms() {
            if (forms) forms.each(submitForm);
            broadcastEvent();
            compileFilterButton();
        }

        function submitForm(index, form) {
            angular.element(form).trigger('submit');
        }

        function broadcastEvent() {
            var modelValues = {};
            form.find(NGMODEL_ELEMENT).each(function(index, ngModelElement) {
                var element = angular.element(ngModelElement),
                    name = element.attr('name'),
                    modelValue = element.controller('ngModel').$modelValue;

                modelValues[name] = modelValue;
            });
            $scope.$broadcast('openlmis-table-filter', modelValues);
        }

        function registerForm(element) {
            addForm(element);
            form.prepend(element.children().not(SUBMIT_ELEMENT));
            element.detach();
        }

        function replaceSubmitButtonIfElementContainsSubmitButton(element) {
            var submit = element.find(SUBMIT_ELEMENT);
            if (submit.length ) {
                submitButton.replaceWith(submit);
            }
        }

        function addForm(form) {
            if (!forms) {
                forms = form;
            } else {
                forms.push(form);
            }
        }

        function onDestroy() {
            hidePopover();
            filterButton.remove();
            filterButton = undefined;

            submitButton.remove();
            submitButton = undefined;

            form.remove();
            form = undefined;

            removeForms();
            forms = undefined;
        }

        function removeForms() {
            if (forms) {
                forms.each(function(index, form) {
                    form.remove();
                });
            }
        }

        function openPopoverIfFormIsInvalidAndPristine() {
            var stopWatch = $scope.$watch(
                isFormInvalidAndPristine,
                openPopoverAndStopWatch,
                true
            );

            function openPopoverAndStopWatch(isInvalidAndPristine) {
                if (isInvalidAndPristine) {
                    filterButton.popover('show');
                    stopWatch();
                }
            }
        }

        function isFormInvalidAndPristine() {
            var formCtrl = form.controller('form');
            return formCtrl.$invalid && formCtrl.$pristine;
        }

        function compileForm() {
            return compileElement(
                '<form>' +
                    '<input id="close-filters" type="button" value="{{\'openlmisTableFilter.cancel\' | message}}"/>' +
                    '<input type="submit" value="{{\'openlmisTableFilter.update\' | message}}"/>' +
                '</form>'
            );
        }

        function compileFilterButton() {
            var filterButton = compileElement(
                '<button class="filters">{{\'openlmisTableFilter.filter\' | message }}' +
                    '<span class="badge">{{count}}</span>' +
                '</button>'
            );

            filterButton.popover({
                html: true,
                container: 'body',
                placement: 'auto top',
                content: form
            })
            .data('bs.popover')
            .tip()
            .addClass('openlmis-table-filters');
            filterButton.hide();

            form.on('submit', hidePopover);
            form.find('#close-filters').on('click', hidePopover);

            return filterButton;
        }

        function compileElement(markup) {
            return $compile(angular.element(markup))($scope);
        }

        function hidePopover() {
            filterButton.popover('hide');
        }

        function getNgModels() {
            var modelValues = [];

            form.find(NGMODEL_ELEMENT).each(function(index, inputElement) {
                var element = angular.element(inputElement),
                    modelValue = element.controller('ngModel').$modelValue;
                if (modelValue) {
                    modelValues.push(modelValue);
                }
            });
            return modelValues;
        }
    }

})();
