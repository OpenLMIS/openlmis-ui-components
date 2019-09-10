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

describe('OpenlmisTableFiltersController', function() {

    beforeEach(function() {
        module('openlmis-table-filter');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
            this.$timeout = $injector.get('$timeout');
        });

        this.$scope = this.$rootScope.$new();
        this.vm = this.$controller('OpenlmisTableFiltersController', {
            $scope: this.$scope
        });

        this.compileMarkup = function(markup) {
            var element = this.$compile(markup)(this.$scope);
            this.$scope.$apply();
            return element;
        };
    });

    describe('getFormElement', function() {

        it('should return undefined if no element was added', function() {
            expect(this.vm.getFormElement()).toBeUndefined();
        });

        it('should return form if element was registered', function() {
            this.vm.registerElement(angular.element('<div id="one"></div>'));

            var form = this.vm.getFormElement();

            expect(form).not.toBeUndefined();
            expect(form.is('form')).toBe(true);
        });

        it('should return a form with a submit button', function() {
            this.vm.registerElement(angular.element('<div id="one"></div>'));

            var form = this.vm.getFormElement();

            expect(form.find('[type="submit"]').length).toBe(1);
        });

    });

    describe('getFilterButton', function() {

        it('should return undefined if no element was registered', function() {
            expect(this.vm.getFilterButton()).toBeUndefined();
        });

        it('should return form if controller was initialized', function() {
            this.vm.registerElement(angular.element('<div id="one"></div>'));

            var filterButton = this.vm.getFilterButton();

            expect(filterButton).not.toBeUndefined();
            expect(filterButton.is('button')).toBe(true);
        });

    });

    describe('registerElement', function() {

        it('should add registered element to the form', function() {
            var element = angular.element('<div id="one"></div>');

            this.vm.registerElement(element);

            expect(this.vm.getFormElement().find(element).length).toBe(1);
        });

        it('should override submit if some other submit element was marked as filter', function() {
            var submit = angular.element('<input type="submit"/>');
            this.vm.registerElement(angular.element('<div id="one"></div>'));

            var form = this.vm.getFormElement();

            expect(form.find('[type="submit"]').is(submit)).toBe(false);

            this.vm.registerElement(submit);
            this.$rootScope.$apply();

            expect(form.find('[type="submit"]').length).toBe(1);
            expect(form.find('[type="submit"]').is(submit)).toBe(true);
        });

        it('should override submit if registered element has a submit element descendant', function() {
            var submit = angular.element('<input type="submit"/>'),
                element = angular.element('<div></div>');

            this.vm.registerElement(angular.element('<div id="one"></div>'));
            var form = this.vm.getFormElement();

            element.append(submit);

            expect(form.find('[type="submit"]').is(submit)).toBe(false);

            this.vm.registerElement(element);
            this.$rootScope.$apply();

            expect(form.find('[type="submit"]').length).toBe(1);
            expect(form.find('[type="submit"]').is(submit)).toBe(true);
        });

        it('should copy children if registering form', function() {
            var elementOne = angular.element('<input id="elementOne"/>'),
                elementTwo = angular.element('<input id="elementTwo"/>'),
                newForm = angular.element('<form></form>');

            newForm.append(elementOne);
            newForm.append(elementTwo);

            this.vm.registerElement(newForm);

            var form = this.vm.getFormElement();

            expect(form.find(elementOne).length).toBe(1);
            expect(form.find(elementTwo).length).toBe(1);
            expect(form.is(newForm)).toBe(false);
        });

        it('should detach registered form', function() {
            var newForm = angular.element('<form></form>');

            spyOn(newForm, 'detach');

            this.vm.registerElement(newForm);

            expect(newForm.detach).toHaveBeenCalled();
        });

    });

    describe('$onDestroy', function() {

        it('should close modal if element was registered', function() {
            this.vm.registerElement(angular.element('<div id="one"></div>'));

            var filterButton = this.vm.getFilterButton();
            spyOn(filterButton, 'popover').andCallThrough();

            this.vm.$onDestroy();

            expect(filterButton.popover).toHaveBeenCalledWith('hide');
        });

        it('should do nothing if element was not registered', function() {
            var vm = this.vm;

            expect(function() {
                vm.$onDestroy();
            }).not.toThrow();
        });

    });

    describe('filterButton', function() {

        it('should be hidden if no elements were registered', function() {
            var filterButton = this.vm.getFilterButton();

            expect(filterButton).toBeUndefined();
        });

        it('should be visible if at least one element was registered', function() {
            this.vm.registerElement(angular.element('<div></div>'));

            var filterButton = this.vm.getFilterButton();

            expect(filterButton).toBeDefined();
        });

    });

    describe('popover', function() {

        beforeEach(function() {
            this.vm.registerElement(angular.element('<div></div>'));

            this.form = this.vm.getFormElement();
            this.filterButton = this.vm.getFilterButton();

            spyOn(this.filterButton, 'popover').andCallThrough();
        });

        it('should close on cancel click', function() {
            this.form.find('#close-filters').click();

            expect(this.filterButton.popover).toHaveBeenCalledWith('hide');
        });

        it('should close on submit click', function() {
            this.$timeout.flush();
            this.$scope.$apply();

            this.form.submit();

            expect(this.filterButton.popover).toHaveBeenCalledWith('hide');
        });

        it('should not open if form is pristine and valid', function() {
            expect(this.filterButton.popover).not.toHaveBeenCalledWith('show');
        });

        //This handles popover opening when we enter the state and the form is has empty required
        //fields
        it('should open if form is pristine and invalid', function() {
            expect(this.filterButton.popover).not.toHaveBeenCalledWith('show');

            this.form.controller('form').$setValidity('isInvalid', false);
            this.$scope.$apply();

            expect(this.filterButton.popover).toHaveBeenCalledWith('show');
        });

        it('should not open if form is dirty and invalid', function() {
            this.$scope.$apply();
            this.form.controller('form').$setDirty();

            expect(this.filterButton.popover).not.toHaveBeenCalledWith('show');
        });

        it('should open if form was previously closed', function() {
            this.form.find('#close-filters').click();

            expect(this.filterButton.popover).toHaveBeenCalledWith('hide');

            this.form.controller('form').$setValidity('isInvalid', false);
            this.$scope.$apply();

            expect(this.filterButton.popover).toHaveBeenCalledWith('show');
        });

    });

    describe('popover options', function() {

        it('should be set properly when filter is used on the screen', function() {
            this.vm.registerElement(angular.element('<div></div>'), 'body');

            this.form = this.vm.getFormElement();
            this.filterButton = this.vm.getFilterButton();

            spyOn(this.filterButton, 'popover').andCallThrough();

            expect(this.filterButton.data('bs.popover').options.html).toBeTruthy();
            expect(this.filterButton.data('bs.popover').options.container).toEqual('body');
            expect(this.filterButton.data('bs.popover').options.placement).toEqual('auto top');
            expect(this.filterButton.data('bs.popover').options.content).toEqual(this.form);
        });

        it('should be set properly when filter is used on the modal', function() {
            this.vm.registerElement(angular.element('<div></div>'), '.modal-content');

            this.form = this.vm.getFormElement();
            this.filterButton = this.vm.getFilterButton();

            spyOn(this.filterButton, 'popover').andCallThrough();

            expect(this.filterButton.data('bs.popover').options.html).toBeTruthy();
            expect(this.filterButton.data('bs.popover').options.container).toEqual('.modal-content');
            expect(this.filterButton.data('bs.popover').options.placement).toEqual('auto top');
            expect(this.filterButton.data('bs.popover').options.content).toEqual(this.form);
        });
    });

    describe('submit event', function() {

        it('should contain a map of input names and model values', function() {
            var modelValues,
                modelOne = 'someValue1',
                modelTwo = 1,
                modelThree = {
                    some: 'otherValue'
                };

            this.$scope.$on('openlmis-table-filter', function(event, args) {
                modelValues = args;
            });

            this.$scope.modelOne = modelOne;
            this.$scope.modelTwo = modelTwo;
            this.$scope.modelThree = modelThree;

            this.$scope.$digest();

            this.vm.registerElement(this.compileMarkup('<input name="inputOne" ng-model="modelOne"/>'));
            this.vm.registerElement(this.compileMarkup('<input name="inputTwo" ng-model="modelTwo"/>'));
            this.vm.registerElement(this.compileMarkup('<input name="inputThree" ng-model="modelThree"/>'));

            this.$timeout.flush();

            var form = this.vm.getFormElement();
            //ugly hack to prevent page reload
            form.attr('onsubmit', 'return false;');
            form.submit();
            this.$scope.$apply();

            expect(modelValues.inputOne).toEqual(modelOne);
            expect(modelValues.inputTwo).toEqual(modelTwo);
            expect(modelValues.inputThree).toEqual(modelThree);
        });

    });

    it('should not update model values if weren\'t submitted', function() {
        var modelValues,
            modelOne = 'someValue1',
            modelTwo = 1,
            modelThree = {
                some: 'otherValue'
            };

        this.$scope.$on('openlmis-table-filter', function(event, args) {
            modelValues = args;
        });

        this.$scope.modelOne = modelOne;
        this.$scope.modelTwo = modelTwo;
        this.$scope.modelThree = modelThree;

        this.$scope.$digest();

        this.vm.registerElement(this.compileMarkup('<input name="inputOne" ng-model="modelOne"/>'));
        this.vm.registerElement(this.compileMarkup('<input name="inputTwo" ng-model="modelTwo"/>'));
        this.vm.registerElement(this.compileMarkup('<input name="inputThree" ng-model="modelThree"/>'));

        this.$timeout.flush();

        var form = this.vm.getFormElement();
        //ugly hack to prevent page reload
        form.attr('onsubmit', 'return false;');
        form.submit();
        this.$scope.$apply();

        this.$scope.modelOne = 'someValue2';
        this.$scope.modelTwo = undefined;
        this.$scope.modelThree = 'anotherValue';

        this.vm.registerElement(this.compileMarkup('<input name="inputOne" ng-model="modelOne"/>'));
        this.vm.registerElement(this.compileMarkup('<input name="inputTwo" ng-model="modelTwo"/>'));
        this.vm.registerElement(this.compileMarkup('<input name="inputThree" ng-model="modelThree"/>'));

        this.$timeout.flush();

        this.$scope.$apply();

        expect(modelValues.inputOne).toEqual('someValue1');
        expect(modelValues.inputTwo).toEqual(1);
        expect(modelValues.inputThree).toEqual({
            some: 'otherValue'
        });
    });

    it('should submit all registered forms if the main one was submitted', function() {
        var formOne = this.compileMarkup('<form onsubmit="return false;"></form>'),
            formTwo = this.compileMarkup('<form onsubmit="return false;"></form>');

        var formOneSubmitted;
        formOne.on('submit', function() {
            formOneSubmitted = true;
        });

        var formTwoSubmitted;
        formTwo.on('submit', function() {
            formTwoSubmitted = true;
        });

        this.vm.registerElement(formOne);
        this.vm.registerElement(formTwo);

        var form = this.vm.getFormElement();
        //ugly hack to prevent page reload
        form.attr('onsubmit', 'return false;');

        this.$timeout.flush();

        form.submit();

        expect(formOneSubmitted).toBe(true);
        expect(formTwoSubmitted).toBe(true);
    });

    it('should update filters count after form was submitted', function() {
        this.$scope.modelOne = 'Some entered value';
        this.$scope.modelTwo = 'Some other value';
        this.$scope.modelThree = 'Some even different value';

        expect(this.vm.getFilterButton()).toBeUndefined();

        this.vm.registerElement(this.compileMarkup('<input name="inputOne" ng-model="modelOne"/>'));
        this.vm.registerElement(this.compileMarkup('<input name="inputTwo" ng-model="modelTwo"/>'));
        this.vm.registerElement(this.compileMarkup('<input name="inputThree" ng-model="modelThree"/>'));

        this.$timeout.flush();

        expect(this.vm.getFilterButton().find('span')
            .html()).toEqual('(3)');

        this.$scope.modelOne = undefined;
        this.$scope.modelTwo = undefined;
        this.$scope.$apply();

        expect(this.vm.getFilterButton().find('span')
            .html()).toEqual('(3)');

        var form = this.vm.getFormElement();
        form.attr('onsubmit', 'return false;');
        form.controller('form').$submitted = true;
        form.submit();
        this.$scope.$apply();

        expect(this.vm.getFilterButton().find('span')
            .html()).toEqual('(1)');
    });

    it('should roll back changes if Cancel button was clicked', function() {
        spyOn(_, 'defer').andCallFake(function(fn) {
            fn();
        });

        this.$scope.modelOne = 'Some entered value';
        this.$scope.modelTwo = 'Some other value';
        this.$scope.modelThree = 'Some even different value';

        expect(this.vm.getFilterButton()).toBeUndefined();

        this.vm.registerElement(this.compileMarkup('<input name="inputOne" ng-model="modelOne"/>'));
        this.vm.registerElement(this.compileMarkup('<input name="inputTwo" ng-model="modelTwo"/>'));
        this.vm.registerElement(this.compileMarkup('<input name="inputThree" ng-model="modelThree"/>'));

        this.$timeout.flush();

        expect(this.vm.getFilterButton().find('span')
            .html()).toEqual('(3)');

        this.$scope.modelOne = undefined;
        this.$scope.modelTwo = undefined;
        this.$scope.$digest();

        expect(this.vm.getFilterButton().find('span')
            .html()).toEqual('(3)');

        this.vm.getFormElement().find('#close-filters')
            .click();
        this.$scope.$apply();

        expect(this.vm.getFilterButton().find('span')
            .html()).toEqual('(3)');
    });

    it('should change button status if all inputs were cleared', function() {
        this.$scope.modelOne = 'Some entered value';
        this.$scope.modelTwo = 'Some other value';
        this.$scope.modelThree = 'Some even different value';

        expect(this.vm.getFilterButton()).toBeUndefined();

        this.vm.registerElement(this.compileMarkup('<input name="inputOne" ng-model="modelOne"/>'));
        this.vm.registerElement(this.compileMarkup('<input name="inputTwo" ng-model="modelTwo"/>'));
        this.vm.registerElement(this.compileMarkup('<input name="inputThree" ng-model="modelThree"/>'));

        this.$timeout.flush();

        expect(this.vm.getFilterButton().hasClass('is-active')).toBe(true);

        this.$scope.modelOne = undefined;
        this.$scope.modelTwo = undefined;
        this.$scope.$apply();

        var form = this.vm.getFormElement();
        form.attr('onsubmit', 'return false;');
        form.controller('form').$submitted = true;
        form.submit();
        this.$scope.$apply();

        expect(this.vm.getFilterButton().hasClass('is-active')).toBe(true);

        this.$scope.modelThree = undefined;
        this.$scope.$apply();

        form.submit();
        this.$scope.$apply();

        expect(this.vm.getFilterButton().hasClass('is-active')).toBe(false);
    });

});
