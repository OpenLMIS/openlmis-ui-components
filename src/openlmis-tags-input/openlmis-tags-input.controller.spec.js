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

    beforeEach(function() {
        module('openlmis-tags-input');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.availableTags = [
            'TestTagOne',
            'TestTagTwo',
            'TestTagThree'
        ];

        this.$scope = this.$rootScope.$new();
        this.$scope.availableTags = this.availableTags;
        this.$scope.allowNewTags = true;

        this.tagsInputVm = this.$controller('OpenlmisTagsInputController', {
            $scope: this.$scope
        });
    });

    describe('setErrorMessage', function() {

        it('should set message', function() {
            expect(this.tagsInputVm.errorMessage).toBeUndefined();

            this.tagsInputVm.setErrorMessage('some.error.message');

            expect(this.tagsInputVm.errorMessage).toEqual('some.error.message');
        });

        it('should unset message if undefined is given', function() {
            this.tagsInputVm.errorMessage = 'some.error.message';

            this.tagsInputVm.setErrorMessage(undefined);

            expect(this.tagsInputVm.errorMessage).toBeUndefined();
        });

    });

    describe('filterAvailableTags', function() {

        it('should return all if undefined is given', function() {
            var result;
            this.tagsInputVm.filterAvailableTags()
                .then(function(tags) {
                    result = tags;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.availableTags);
        });

        it('should return filtered tags if query is defined', function() {
            var result;
            this.tagsInputVm.filterAvailableTags('TestTagT')
                .then(function(tags) {
                    result = tags;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(['TestTagTwo', 'TestTagThree']);
        });

        it('should omit letter casing when searching', function() {
            var result;
            this.tagsInputVm.filterAvailableTags('testtagt')
                .then(function(tags) {
                    result = tags;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(['TestTagTwo', 'TestTagThree']);
        });

        it('should return empty list if the list of available tags is undefined', function() {
            this.$scope.availableTags = undefined;

            var result;
            this.tagsInputVm.filterAvailableTags()
                .then(function(tags) {
                    result = tags;
                });
            this.$rootScope.$apply();

            expect(result).toEqual([]);
        });

    });

});