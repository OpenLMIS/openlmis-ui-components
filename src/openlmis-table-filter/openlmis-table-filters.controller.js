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

        function onInit() {
            form = compileForm();
            form.on('submit', submitForms);

            filterButton = compileFilterButton();
            submitButton = form.find(SUBMIT_ELEMENT);

            openPopoverIfFormIsInvalidAndPristine();
        }

        function submitForms() {
            if (forms) forms.each(submitForm);
        }

        function submitForm(index, form) {
            angular.element(form).trigger('submit');
        }

        function registerElement(element) {
            replaceSubmitButtonIfElementContainsSubmitButton(element);

            if (element.is('form')) {
                registerForm(element);
            } else if (element.is(SUBMIT_ELEMENT)) {
                submitButton.replaceWith(element);
            } else {
                form.prepend(element);
            }
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

        function getFormElement() {
            return form;
        }

        function getFilterButton() {
            return filterButton;
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
            var filterButton = compileElement('<button class="filters">{{\'openlmisTableFilter.filter\' | message}}: {{vm.filledInputs.length}}</button>');

            filterButton.popover({
                html: true,
                container: 'body',
                placement: 'auto top',
                content: form
            })
            .data('bs.popover')
            .tip()
            .addClass('openlmis-table-filters');

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
    }

})();
