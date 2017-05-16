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

describe('Select directive', function() {

    'use strict';

    var $compile, scope;

    beforeEach(function() {
        module('openlmis-templates');
    });

    beforeEach(module('openlmis-form'));

    beforeEach(inject(function(_$compile_, $rootScope){
        $compile = _$compile_;
        scope = $rootScope.$new();
    }));

    beforeEach(inject(function(messageService){
        spyOn(messageService, 'get').andCallFake(function(key){
            return key;
        });
    }));

    function makeElement(string){
        var element = $compile(string)(scope);
        scope.$apply();
        return element;
    }

    // it('shows placeholder attribute as first option', function(){
    //     scope.options = [];
    //     var element = makeElement(
    //         '<select></select>'
    //         );

    //     var firstOption = element.children('option:first');
    //     expect(firstOption.hasClass('placeholder')).toBe(true);
    //     expect(firstOption.text()).toBe('openlmisForm.selectAnOption');
    // });

    // it('reads the placeholder value of an element', function(){
    //    scope.options = [];
    //     var element = makeElement(
    //         '<select placeholder="something"></select>'
    //         );

    //     expect(element.children('option.placeholder').text()).toBe('something');
    // });

    // it("won't overwrite a placeholder that is set as an option", function(){
    //    var element = makeElement(
    //         '<select placeholder="something">'
    //         + '<option value="">My Placeholder</option>'
    //         + '</select>'
    //         );

    //     expect(element.children('option.placeholder').text()).toBe('My Placeholder');
    // });

    // it("will not use a placeholder when no-placeholder is set", function(){
    //     var element = makeElement(
    //         '<select no-placeholder>'
    //         + '<option value="1">First element</option>'
    //         + '<option value="2">Second element</option>'
    //         + '</select>'
    //         );

    //     expect(element.children('option:first').text()).toBe('First element');
    // });

});
