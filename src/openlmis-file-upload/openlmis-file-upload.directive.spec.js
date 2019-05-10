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

    beforeEach(function() {
        module('openlmis-file-upload');
        module('openlmis-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
            this.$timeout = $injector.get('$timeout');
        });

        var markup = '<form><input id="file" type="file" ng-model="example" id="file" accept=".csv"/></form>';
        this.scope = this.$rootScope.$new();
        this.input = this.$compile(markup)(this.scope);
        this.scope.$apply();
        this.$timeout.flush();

        this.inputElement = angular.element(this.input.find('input'));
        this.parent = this.inputElement.parent();

        this.file = {
            name: 'file.csv'
        };
    });

    it('should add openlmis-file-input class to parent', function() {
        expect(this.parent.hasClass('openlmis-file-upload')).toBe(true);
    });

    it('should assign file value to ng-model', function() {
        this.inputElement.triggerHandler({
            type: 'change',
            target: {
                files: [this.file]
            }
        });
        this.scope.$apply();

        expect(this.scope.example).toEqual(this.file);
    });

    it('should clear ng-model', function() {
        this.file.name = 'file.abc';
        this.inputElement.triggerHandler({
            type: 'change',
            target: {
                files: [this.file]
            }
        });
        this.scope.$apply();

        expect(this.scope.example).toEqual(this.file);

        this.scope.clear();
        this.scope.$apply();

        expect(this.scope.example).toEqual(undefined);
    });

    it('should trigger click after clicking select button', function() {
        var result;
        this.inputElement.on('click', function() {
            result = 'click-triggered';
        });

        this.inputElement.parent().find('button')
            .trigger('click');

        this.scope.select();
        this.$rootScope.$apply();

        expect(result).toEqual('click-triggered');
    });

    it('should expose file name', function() {
        this.scope.example = this.file;
        this.scope.$apply();

        expect(this.scope.getFileName()).toEqual(this.file.name);
    });
});*/