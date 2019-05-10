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

describe('Input required directive', function() {
    'use strict';

    beforeEach(function() {
        module('openlmis-templates');
        module('openlmis-form');
    });

    describe('- input test -', function() {
        var scope,
            element;

        beforeEach(inject(function($compile, $rootScope) {
            scope = $rootScope.$new();
            scope.isRequired = true;
            scope.id = 'input';
            element = $compile(
                '<form><label for="input">Label</label><input id="{{id}}" ng-required="isRequired" /></form>'
            )(scope);
            angular.element('body').append(element);
            scope.$apply();

        }));

        it('marks the input label as required', function() {

            expect(element.find('label').hasClass('is-required')).toBe(true);
        });

        it('removes the required label if not required', function() {
            expect(element.find('label').hasClass('is-required')).toBe(true);

            scope.isRequired = false;
            scope.$apply();

            expect(element.find('label').hasClass('is-required')).toBe(false);
        });

        it('removes the required label if the ID changes', function() {
            expect(element.find('label').hasClass('is-required')).toBe(true);

            scope.id = 'different-id';
            scope.$apply();

            expect(element.find('label').hasClass('is-required')).toBe(false);
        });
    });

    it('marks the select label as required', inject(function($compile, $rootScope) {
        var scope = $rootScope.$new();
        var element = $compile(
            '<form><label for="select">Label</label><select id="select" required ></select></form>'
        )(scope);
        angular.element('body').append(element);
        scope.$apply();

        expect(element.find('label').hasClass('is-required')).toBe(true);
    }));

    it('marks the textarea label as required', inject(function($compile, $rootScope) {
        var scope = $rootScope.$new();
        var element = $compile(
            '<form><label for="textarea">Label</label><textarea id="textarea" required /></form>'
        )(scope);
        angular.element('body').append(element);
        scope.$apply();

        expect(element.find('label').hasClass('is-required')).toBe(true);
    }));

});
