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

describe('Input Control Wrap', function() {

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
            this.$templateCache = $injector.get('$templateCache');
        });

        this.scope = this.$rootScope.$new();

        spyOn(this.$templateCache, 'get').and.returnValue('<div class="input-control" input-control></div>');
    });

    describe('- input -', function() {

        beforeEach(inject(function() {
            var markup = '<form><input /></form>';
            this.element = this.$compile(markup)(this.scope);
            this.scope.$apply();

            this.input = this.element.find('input');
        }));

        it('adds an input-control element around an input', function() {
            expect(this.input.parents('[input-control]').length).toBe(1);
        });
    });

    it('does not add input-control elements if parent(s) are input-control', function() {
        var markup = '<form><div id="example" input-control ><input /></div></form>',
            element = this.$compile(markup)(this.scope);
        this.scope.$apply();

        var input = element.find('input');

        expect(input.parents('[input-control]').length).toBe(1);
        expect(input.parents('[input-control]').attr('id')).toBe('example');

    });

    it('does not add input-control elements to input types SUBMIT and BUTTON', function() {
        var markup = '<form><input type="button" /></form>',
            element = this.$compile(markup)(this.scope),
            input = element.find('input');
        this.scope.$apply();

        expect(input.parents('[input-control]').length).toBe(0);

        markup = '<form><input type="submit" /></form>',
        element = this.$compile(markup)(this.scope);
        input = element.find('input');
        this.scope.$apply();

        expect(input.parents('[input-control]').length).toBe(0);
    });

    it('adds an input-control element around select elements', function() {
        var markup = '<form><select /></form>',
            element = this.$compile(markup)(this.scope),
            select = element.find('select');
        this.scope.$apply();

        expect(select.parents('[input-control]').length).toBe(1);
    });

    it('adds an input-control element around textarea elements', function() {
        var markup = '<form><textarea /></form>',
            element = this.$compile(markup)(this.scope),
            textarea = element.find('textarea');
        this.scope.$apply();

        expect(textarea.parents('[input-control]').length).toBe(1);
    });

    it('moves ng-if from input element to wrapper', function() {
        var markup = '<form><textarea ng-show="true"/></form>',
            element = this.$compile(markup)(this.scope);

        this.scope.$apply();

        var textarea = element.find('textarea');

        expect(textarea.parents('[input-control]').length).toBe(1);
        expect(textarea.parents('[input-control]').attr('ng-show')).toEqual('true');
    });
});
