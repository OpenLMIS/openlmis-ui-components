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

describe('Select2 for select elements', function() {

    beforeEach(function() {
        module('openlmis-pagination', function($provide) {
            $provide.constant('PAGE_SIZE', 3);
        });
        module('openlmis-form');

        inject(function($injector) {
            this.jQuery = $injector.get('jQuery');
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
            this.messageService = $injector.get('messageService');
        });

        spyOn(this.jQuery.prototype, 'select2').and.callThrough();
        spyOn(this.messageService, 'get').and.callFake(function() {
            return 'placeholder text';
        });

        this.scope = this.$rootScope.$new();
        this.scope.options = [1, 2];
        this.element = this.$compile(
            '<div><select ng-model="value" ng-options="option for option in options"></select></div>'
        )(this.scope);
        this.scope.$apply();

        angular.element('body').append(this.element);

        this.select = this.element.find('select');
    });

    it('instantiates a select2 element', function() {
        expect(jQuery.prototype.select2).toHaveBeenCalled();
    });

    it('sets the placeholder value, if there is a placeholder element', function() {
        var placeholder = jQuery.prototype.select2.calls.mostRecent().args[0].placeholder;

        expect(placeholder.text).toBe('placeholder text');
    });

    it('hides the search box when there are less options than PAGE_SIZE', function() {
        var minimumResultsForSearch = jQuery.prototype.select2.calls.mostRecent().args[0].minimumResultsForSearch;

        expect(minimumResultsForSearch).toBe(3);
    });

    it('does not open the select dropdown after clearning the selection', function() {
        this.scope.value = 2;
        this.scope.$apply();

        var openedSelect = false;
        this.select.on('select2:open', function() {
            openedSelect = true;
        });

        this.element.find('.select2-selection__clear').trigger('mousedown');
        this.scope.$apply();

        expect(openedSelect).toBe(false);
    });
});
