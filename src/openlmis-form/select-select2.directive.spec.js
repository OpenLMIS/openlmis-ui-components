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

    'use strict';

    var jQuery, $compile, scope;

    beforeEach(function() {

        module('openlmis-templates');

        module('openlmis-pagination', function($provide){
            $provide.constant('PAGE_SIZE', 3);
        });

        module('openlmis-form');

        inject(function(_jQuery_, _$compile_, $rootScope, messageService) {
            jQuery = _jQuery_;
            $compile = _$compile_;

            spyOn(jQuery.prototype, 'select2');

            spyOn(messageService, 'get').andCallFake(function(){
            	return "placeholder text";
            });

            scope = $rootScope.$new();
            scope.options = [1,2];
            var element = $compile(
                '<select ng-model="value" ng-options="option for option in options"></select>'
                )(scope);
            scope.$apply();
        });
    });

    it('instantiates a select2 element', function() {
    	expect(jQuery.prototype.select2).toHaveBeenCalled();
    });

    it('sets the placeholder value, if there is a placeholder element', function() {
        var placeholder = jQuery.prototype.select2.mostRecentCall.args[0].placeholder;
        expect(placeholder.text).toBe('placeholder text');
    });

    it('hides the search box when there are less options than PAGE_SIZE', function(){
    	var minimumResultsForSearch = jQuery.prototype.select2.mostRecentCall.args[0].minimumResultsForSearch;
    	expect(minimumResultsForSearch).toBe(3);
    });


});
