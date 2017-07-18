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

describe('Input Control TD', function() {
	var $compile, scope;

	beforeEach(module('openlmis-form'));

	beforeEach(inject(function(_$compile_, $rootScope, $templateCache) {
		$compile = _$compile_;
		scope = $rootScope.$new();		
	}));

	it('adds an input-control directive to table cell elements with a single input', function(){
		var markup = '<table><tr><td><input /></td></tr></table>',
			element = $compile(markup)(scope);
		scope.$apply();

		var tableCell = element.find('td');

		expect(tableCell[0].hasAttribute('input-control')).toBe(true);
		expect(tableCell[0].hasAttribute('openlmis-invalid')).toBe(true);

		// make sure no child input-controls exist
		expect(tableCell.find('[input-control]').length).toBe(0);
	});

	it('will not add input control if any parent is an input-control', function(){
		var markup = '<div input-control><table><tr><td><input /></td></tr></table></div>',
			element = $compile(markup)(scope);
		scope.$apply();

		var tableCell = element.find('td');

		expect(tableCell[0].hasAttribute('input-control')).toBe(false);
	});

	it('will add input-control for a select element', function(){
		var markup = '<table><tr><td><select /></td></tr></table>',
			element = $compile(markup)(scope);
		scope.$apply();

		var tableCell = element.find('td');

		expect(tableCell[0].hasAttribute('input-control')).toBe(true);
	});

	it('will add input-control for a textarea element', function(){
		var markup = '<table><tr><td><textarea /></td></tr></table>',
			element = $compile(markup)(scope);
		scope.$apply();

		var tableCell = element.find('td');

		expect(tableCell[0].hasAttribute('input-control')).toBe(true);
	});

});