/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe("NavigationController", function() {

  var scope, NavigationCtrl, $state;

  beforeEach(module('openlmis-dashboard'));

  beforeEach(inject(function($rootScope, $controller, _$state_) {
    scope = $rootScope.$new();
    $state = _$state_;

    NavigationCtrl = $controller('NavigationController', {
      $scope: scope
    });
    
  }));

  it("returns a state's label", function(){

    spyOn($state, 'get').andReturn({
      'name': 'test',
      'label': 'test.label'
    });

    expect(NavigationCtrl.getStateLabel('test')).toEqual('test.label'); 
  });

  it("returns a state's name if label is not set", function(){
    spyOn($state, 'get').andReturn({
      'name': 'test'
    });

    expect(NavigationCtrl.getStateLabel('test')).toEqual('test'); 

  });

});