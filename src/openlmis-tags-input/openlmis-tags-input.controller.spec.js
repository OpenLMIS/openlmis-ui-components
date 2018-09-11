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

describe('OpenlmisTagsInputController', function() {

    var tagsInputVm, $controller, $rootScope, $scope, availableTags;

    beforeEach(function() {
        module('openlmis-tags-input');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
        });

        availableTags = [
            'TestTagOne',
            'TestTagTwo',
            'TestTagThree'
        ];

        $scope = $rootScope.$new();
        $scope.availableTags = availableTags;
        $scope.allowNewTags = true;

        tagsInputVm = $controller('OpenlmisTagsInputController', {
            $scope: $scope
        });
    });

    describe('setErrorMessage', function() {

        it('should set message', function() {
            expect(tagsInputVm.errorMessage).toBeUndefined();

            tagsInputVm.setErrorMessage('some.error.message');

            expect(tagsInputVm.errorMessage).toEqual('some.error.message');
        });

        it('should unset message if undefined is given', function() {
            tagsInputVm.errorMessage = 'some.error.message';

            tagsInputVm.setErrorMessage(undefined);

            expect(tagsInputVm.errorMessage).toBeUndefined();
        });

    });

    describe('filterAvailableTags', function() {

        it('should return all if undefined is given', function() {
            var result;
            tagsInputVm.filterAvailableTags()
                .then(function(tags) {
                    result = tags;
                });
            $rootScope.$apply();

            expect(result).toEqual(availableTags);
        });

        it('should return filtered tags if query is defined', function() {
            var result;
            tagsInputVm.filterAvailableTags('TestTagT')
                .then(function(tags) {
                    result = tags;
                });
            $rootScope.$apply();

            expect(result).toEqual(['TestTagTwo', 'TestTagThree']);
        });

        it('should omit letter casing when searching', function() {
            var result;
            tagsInputVm.filterAvailableTags('testtagt')
                .then(function(tags) {
                    result = tags;
                });
            $rootScope.$apply();

            expect(result).toEqual(['TestTagTwo', 'TestTagThree']);
        });

        it('should return empty list if the list of available tags is undefined', function() {
            $scope.availableTags = undefined;

            var result;
            tagsInputVm.filterAvailableTags()
                .then(function(tags) {
                    result = tags;
                });
            $rootScope.$apply();

            expect(result).toEqual([]);
        });

    });

});