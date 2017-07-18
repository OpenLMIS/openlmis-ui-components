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

describe('Characters left directive', function(){
	var element, input, scope, $timeout, charactersLeftCtrl;

	beforeEach(module('openlmis-form'));

	beforeEach(inject(function($compile, $rootScope, _$timeout_){
		$timeout = _$timeout_;

		var markup = '<div><input type="text" characters-left ng-maxlength="5" ng-model="example" /><span>{{example}}</span></div>';

		scope = $rootScope.$new();
		scope.example = "test";

		element = $compile(markup)(scope);
		angular.element('body').append(element);

		scope.$apply();
		$timeout.flush();

		input = element.find('input');

		charactersLeftCtrl = input.controller('charactersLeft');
		spyOn(charactersLeftCtrl, 'updateCharactersLeft').andCallThrough();
	}));

	it('displays the characters left element when element is focused', function(){
		expect(element.find('.characters-left').length).toBe(0);		

		input.focus();
		scope.$apply();

		expect(element.find('.characters-left').length).toBe(1);

		input.blur();
		scope.$apply();

		expect(element.find('.characters-left').length).toBe(0);		
	});

	it('will debounce changes to update characters left', function(){
		input.focus();

		scope.example = "text";
		input.keypress();
		scope.$apply();

		scope.example = "test";
		input.keypress();
		scope.$apply();

		$timeout.flush();

		// Has done multiple changes, but only one call to updateCharactersLeft
		expect(charactersLeftCtrl.updateCharactersLeft.calls.length).toBe(1);

		scope.example = "foo";
		input.keypress();
		scope.$apply();
		$timeout.flush();
		// Another change, just to make sure it works
		expect(charactersLeftCtrl.updateCharactersLeft.calls.length).toBe(2);
	});

	it('shows an error state when the model value is longer than the allowed length', function(){
		input.focus();
		scope.example = "Long text";
		input.keypress();
		scope.$apply();
		$timeout.flush();

		expect(element.find('.characters-left').hasClass('is-invalid')).toBe(true);

		scope.example = "four";
		input.keypress();
		scope.$apply();
		$timeout.flush();

		expect(element.find('.characters-left').hasClass('is-invalid')).toBe(false);
	});

	it('hides characters-left element when characters-left attribute is "false"', function(){
		input.attr('characters-left', "false");
		
		input.focus();
		scope.$apply();

		expect(element.find('.characters-left').length).toBe(0);
	});
});