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

describe('Select search option directive', function() {

    'use strict';

    var jQuery, $compile, scope, element, searchForm;

    beforeEach(function() {

        module('openlmis-templates');

        module('openlmis-pagination', function($provide){
            $provide.constant('PAGE_SIZE', 3);
        });

        module('openlmis-form');

        inject(function(_jQuery_, _$compile_, $rootScope) {
            jQuery = _jQuery_;
            $compile = _$compile_;

            spyOn(jQuery.prototype, 'popover').andCallThrough();

            scope = $rootScope.$new();
            scope.options = [1,2];
            element = $compile(
                '<select ng-model="value" ng-options="option for option in options"></select>'
                )(scope);
            scope.$apply();
            element = angular.element(element[0]);
            searchForm = jQuery(jQuery.prototype.popover.mostRecentCall.args[0].content[0]);
        });
    });

    describe('select popover', function(){

        it('creates a popover for a select element', function(){
            var popoverTemplate = jQuery(jQuery.prototype.popover.mostRecentCall.args[0].template[0]);
            expect(popoverTemplate.hasClass('select-search-option'));
        });

        it('closes the popover when an option is clicked', function(){
            
        });

        it('hides the search box when there are less options than PAGE_SIZE', function(){
            expect(searchForm.hasClass('select-search')).toBe(true);
            expect(searchForm.hasClass('ng-hide')).toBe(true);
        });

    });

    describe('search-able pop-out', function() {

        it('should display search box when there are more options than PAGE_SIZE', function() {
            scope.options = [1, 2, 3, 4];
            element.click();
            scope.$apply();

            expect(searchForm.hasClass('select-search')).toBe(true);
            // expect(searchForm.hasClass('ng-show')).toBe(true);
        });

        it('searches options when text is entered', function(){
            
        });
    });

});
