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

    var element, $compile, $rootScope, $scope, $timeout, tagsInputModel, inputModel;

    beforeEach(function() {
        module('openlmis-tags-input');

        inject(function($injector) {
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
            $timeout = $injector.get('$timeout');
        });

        $scope = $rootScope.$new();
        $scope.tags = ['tagOne', 'tagTwo'];
        $scope.availableTags = ['tagOne', 'tagTwo', 'tagThree'];
    });

    it('should set error if tag is duplicated', function() {
        var element = compileElement('<openlmis-tags-input ng-model="tags"></openlmis-tags-input>');

        inputModel.$setViewValue('tagTwo');
        tagsInputModel.$valid = false;

        $rootScope.$apply();

        expect(element.find('[openlmis-invalid="openlmisTagsInput.duplicatedTag"]').length).toBe(1);
    });

    it('should set error if tag is not on the list of available tags', function() {
        var element = compileElement(
            '<openlmis-tags-input ng-model="tags" allow-new-tags="false" available-tags="availableTags">' +
            '</openlmis-tags-input>'
        );

        inputModel.$setViewValue('tagFive');
        tagsInputModel.$valid = false;

        $rootScope.$apply();

        expect(element.find('[openlmis-invalid="openlmisTagsInput.nonExistingTag"]').length).toBe(1);
    });

    it('should wait with clearing error message for input change', function() {
        var element = compileElement(
            '<openlmis-tags-input ng-model="tags" allow-new-tags="false" available-tags="availableTags">' +
            '</openlmis-tags-input>'
        );

        inputModel.$setViewValue('tagFive');
        tagsInputModel.$valid = false;
        $rootScope.$apply();

        expect(element.find('[openlmis-invalid="openlmisTagsInput.nonExistingTag"]').length).toBe(1);

        tagsInputModel.$valid = true;
        $rootScope.$apply();

        expect(element.find('[openlmis-invalid="openlmisTagsInput.nonExistingTag"]').length).toBe(1);

        inputModel.$setViewValue('tagFiv');
        $rootScope.$apply();

        expect(element.find('[openlmis-invalid="openlmisTagsInput.nonExistingTag"]').length).toBe(0);
    });

    afterEach(function() {
        $scope.$destroy();
    });

    function compileElement(template) {
        var element = $compile(template)($scope);
        $scope.$digest();
        $timeout.flush();

        tagsInputModel = element.find('tags-input').controller('ngModel');
        inputModel = element.find('input').controller('ngModel');

        return element;
    }

});