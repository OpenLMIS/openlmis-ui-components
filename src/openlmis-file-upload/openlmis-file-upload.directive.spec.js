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

/*describe('File input directive', function() {

    var $timeout, $rootScope, $compile,
        input, inputElement, scope, file;

    beforeEach(function() {

        module('openlmis-file-upload');
        module('openlmis-form');

        inject(function($injector) {
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
            $timeout = $injector.get('$timeout');
        });

        var markup = '<form><input type="file" ng-model="example" id="file" accept=".csv"/></form>';

        scope = $rootScope.$new();

        input = $compile(markup)(scope);
        angular.element('body').append(input);

        scope.$apply();
        $timeout.flush();

        inputElement = angular.element(document.querySelector('#file'));

        parent = input.parent();

        file = {
            name: 'file.csv'
        };
    });

    it('should add openlmis-file-input class to parent', function() {
        expect(parent.hasClass('openlmis-file-input')).toBe(true);
    });

    it('should assign file value to ng-model', function() {
        inputElement.triggerHandler({
            type: 'change',
            target: {
                files: [file]
            }
        });
        scope.$apply();

        expect(scope.example).toEqual(file);
    });

    it('should clear ng-model', function() {
        file.name = 'file.abc';
        inputElement.triggerHandler({
            type: 'change',
            target: {
                files: [file]
            }
        });
        scope.$apply();

        expect(scope.example).toEqual(file);

        scope.clear();
        scope.$apply();

        expect(scope.example).toEqual(undefined);
    });

    it('should trigger click after clicking select button', function() {
        var result;
        inputElement.on('change', function() {
            result = 'click-triggered';
        });

        scope.select();
        $rootScope.$apply();

        expect(result).toEqual('click-triggered');
    });

    it('should expose file name', function() {
        scope.example = file;
        scope.$apply();

        expect(scope.getFileName()).toEqual(file.name);
    });
});*/
