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

ddescribe('OpenlmisTableFiltersController', function() {

    var vm, form, $scope;

    beforeEach(function() {
        module('openlmis-table-filter');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        });

        $scope = $rootScope.$new();
        vm = $controller('OpenlmisTableFiltersController', {
            $scope: $scope
        });
    });

    describe('getFormElement', function() {

        it('should return undefined if controller was not initialized', function() {
            expect(vm.getFormElement()).toBeUndefined();
        });

        it('should return form if controller was initialized', function() {
            vm.$onInit();

            form = vm.getFormElement();

            expect(form).not.toBeUndefined();
            expect(form.is('form')).toBe(true);
        });

        it('should return a form with a submit button', function() {
            vm.$onInit();

            form = vm.getFormElement();

            expect(form.find('[type="submit"]').length).toBe(1);
        });

    });

    describe('getFilterButton', function() {

        it('should return undefined if controller was not initialized', function() {
            expect(vm.getFilterButton()).toBeUndefined();
        });

        it('should return form if controller was initialized', function() {
            vm.$onInit();

            filterButton = vm.getFilterButton();

            expect(filterButton).not.toBeUndefined();
            expect(filterButton.is('button')).toBe(true);
        });

    });

    describe('registerElement', function() {

        beforeEach(prepareForm);

        it('should add registered element to the form', function() {
            var element = angular.element('<div id="one"></div>');

            vm.registerElement(element);

            expect(form.find(element).length).toBe(1);
        });

        it('should override submit if some other submit element was marked as filter', function() {
            var submit = angular.element('<input type="submit"/>');

            expect(form.find('[type="submit"]').is(submit)).toBe(false);

            vm.registerElement(submit);
            $rootScope.$apply();

            expect(form.find('[type="submit"]').length).toBe(1);
            expect(form.find('[type="submit"]').is(submit)).toBe(true);
        });

        it('should override submit if registered element has a submit element descendant', function() {
            var submit = angular.element('<input type="submit"/>'),
                element = angular.element('<div></div>');

            element.append(submit);

            expect(form.find('[type="submit"]').is(submit)).toBe(false);

            vm.registerElement(element);
            $rootScope.$apply();

            expect(form.find('[type="submit"]').length).toBe(1);
            expect(form.find('[type="submit"]').is(submit)).toBe(true);
        });

        it('should copy children if registering form', function() {
            var elementOne = angular.element('<input id="elementOne"/>'),
                elementTwo = angular.element('<input id="elementTwo"/>'),
                newForm = angular.element('<form></form>');

            newForm.append(elementOne);
            newForm.append(elementTwo);

            vm.registerElement(newForm);

            expect(form.find(elementOne).length).toBe(1);
            expect(form.find(elementTwo).length).toBe(1);
            expect(form.is(newForm)).toBe(false);
        });

        it('should detach registered form', function() {
            var newForm = angular.element('<form></form>');

            spyOn(newForm, 'detach');

            vm.registerElement(newForm);

            expect(newForm.detach).toHaveBeenCalled();
        });

    });

    describe('$onDestroy', function() {

        beforeEach(prepareForm);

        it('should close modal', function() {
            var filterButton = vm.getFilterButton();
            spyOn(filterButton, 'popover').andCallThrough();

            vm.$onDestroy();

            expect(filterButton.popover).toHaveBeenCalledWith('hide');
        });

    });

    describe('popover', function() {

        var filterButton;

        beforeEach(function() {
            prepareForm();
            filterButton = vm.getFilterButton();
            spyOn(filterButton, 'popover').andCallThrough();
        });

        it('should close on submit click', function() {
            form.find('#close-filters').click();

            expect(filterButton.popover).toHaveBeenCalledWith('hide');
        });

        it('should close on cancel click', function() {
            form.find('[type="submit"]').click();

            expect(filterButton.popover).toHaveBeenCalledWith('hide');
        });

        it('should not open if form is pristine and valid', function() {
            expect(filterButton.popover).not.toHaveBeenCalledWith('show');
        });

        //This handles popover opening when we enter the state and the form is has empty required
        //fields
        it('should open if form is pristine and invalid', function() {
            expect(filterButton.popover).not.toHaveBeenCalledWith('show');

            form.controller('form').$setValidity('isInvalid', false);
            $scope.$apply();

            expect(filterButton.popover).toHaveBeenCalledWith('show');
        });

        it('should not open if form is dirty and invalid', function() {
            form.controller('form').$setDirty();
            $scope.$apply();

            expect(filterButton.popover).not.toHaveBeenCalledWith('show');
        });

    });

    it('should submit all registered forms if the main one was submitted', function() {
        window.onbeforeunload = function() {};

        var formOne = compileMarkup('<form></form>'),
            formTwo = compileMarkup('<form></form>');

        var formOneSubmitted;
        formOne.on('submit', function() {
            formOneSubmitted = true;
        });

        var formTwoSubmitted;
        formTwo.on('submit', function() {
            formTwoSubmitted = true;
        });

        vm.$onInit();
        form = vm.getFormElement();

        vm.registerElement(formOne);
        vm.registerElement(formTwo);

        form.submit();

        expect(formOneSubmitted).toBe(true);
        expect(formTwoSubmitted).toBe(true);
    });

    function prepareForm() {
        vm.$onInit();
        form = vm.getFormElement();
    }

    //TODO: DRY this a bit, as it is repeated in numerous tests
    function compileMarkup(markup) {
        var element = $compile(markup)($scope);

        angular.element('body').append(element);
        $scope.$apply();

        return element;
    }

});
