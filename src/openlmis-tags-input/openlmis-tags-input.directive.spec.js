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

describe('openlmisTagsInput', function() {

    beforeEach(function() {
        module('openlmis-tags-input');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
            this.$timeout = $injector.get('$timeout');
        });

        this.$scope = this.$rootScope.$new();
        this.$scope.tags = ['tagOne', 'tagTwo'];
        this.$scope.availableTags = ['tagOne', 'tagTwo', 'tagThree'];

        this.compileElement = function(template) {
            this.element = this.$compile(template)(this.$scope);
            this.$scope.$digest();
            this.$timeout.flush();

            this.tagsInputModel = this.element.find('tags-input').controller('ngModel');
            this.inputModel = this.element.find('input').controller('ngModel');
        };
    });

    it('should set error if tag is duplicated', function() {
        var markup = '<openlmis-tags-input ng-model="tags"></openlmis-tags-input>';

        this.compileElement(markup);

        this.inputModel.$setViewValue('tagTwo');
        this.tagsInputModel.$valid = false;

        this.$rootScope.$apply();

        expect(this.element.find('[openlmis-invalid="openlmisTagsInput.duplicatedTag"]').length).toBe(1);
    });

    it('should set error if tag is not on the list of available tags', function() {
        var markup =
            '<openlmis-tags-input ng-model="tags" allow-new-tags="false" available-tags="availableTags">' +
            '</openlmis-tags-input>';

        this.compileElement(markup);

        this.inputModel.$setViewValue('tagFive');
        this.tagsInputModel.$valid = false;

        this.$rootScope.$apply();

        expect(this.element.find('[openlmis-invalid="openlmisTagsInput.nonExistingTag"]').length).toBe(1);
    });

    it('should wait with clearing error message for input change', function() {
        var markup =
            '<openlmis-tags-input ng-model="tags" allow-new-tags="false" available-tags="availableTags">' +
            '</openlmis-tags-input>';

        this.compileElement(markup);

        this.inputModel.$setViewValue('tagFive');
        this.tagsInputModel.$valid = false;
        this.$rootScope.$apply();

        expect(this.element.find('[openlmis-invalid="openlmisTagsInput.nonExistingTag"]').length).toBe(1);

        this.tagsInputModel.$valid = true;
        this.$rootScope.$apply();

        expect(this.element.find('[openlmis-invalid="openlmisTagsInput.nonExistingTag"]').length).toBe(1);

        this.inputModel.$setViewValue('tagFiv');
        this.$rootScope.$apply();

        expect(this.element.find('[openlmis-invalid="openlmisTagsInput.nonExistingTag"]').length).toBe(0);
    });

    afterEach(function() {
        this.$scope.$destroy();
    });

});