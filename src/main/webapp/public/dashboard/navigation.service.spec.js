/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
 
describe("NavigationService", function() {

  var $rootScope, NavigationService, AuthorizationService;

  beforeEach(module('openlmis-dashboard'));

  beforeEach(inject(function($state){
      spyOn($state, 'get').andReturn([
        {
          'name': 'test',
          'showInNavigation': true
        },{
          'name': 'test.sub',
          'showInNavigation': true,
          'priority': 1
        },{
          'name': 'test.sub.sub',
          'showInNavigation': true
        },{
          'name': 'test.other',
          'showInNavigation': true
        },{
          'name': 'test.sample',
          'showInNavigation': true
        },{
          'name': 'dont.test',
        },{
          'name': 'alt',
        },{
          'name': 'alt.test',
          'showInNavigation': true
        }
        ]);
    }));

  var mockRights, mockAuth;

  beforeEach(inject(function(_$rootScope_, _NavigationService_, AuthorizationService){
    $rootScope = _$rootScope_;
    NavigationService = _NavigationService_;

    mockAuth = true;
    spyOn(AuthorizationService, 'isAuthenticated').andCallFake(function(){
      return mockAuth;
    });
  }))

  it('will return main navigation as first states with "showInNavigation"', function(){
    var topLevelStates = NavigationService.get();
    // Navigation elements alt and dont.test are ignored
    expect(topLevelStates).toEqual(['alt.test', 'test']);
  });

  it('can get a states child states', function(){
    var children = NavigationService.get('test');
    expect(children).toEqual(['test.sub', 'test.other', 'test.sample']);

  });

  it('will order navigation by "priority" and "name"', function(){
    var children = NavigationService.get('test');
    // Has priority 1
    expect(children[0]).toEqual('test.sub');
    // Has lowest name alphabetically
    expect(children[2]).toEqual('test.sample');
  });

  it('will not show any navigation if user is not authenticated', function(){
    mockAuth = false;
    expect(NavigationService.getMain()).toEqual([]);
  });

});