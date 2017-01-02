/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe('UserFactory', function() {

    var $rootScope, httpBackend, userFactory,
        user = {
            id: '1',
            firstName: 'fname',
            lastName: 'lname',
            email: 'email@olmis.com'
        };

    beforeEach(module('openlmis-user'));

    beforeEach(module(function($provide){
        // Turn off AuthToken
        $provide.factory('HttpAuthAccessToken', function(){
          return {};
        });
    }));

    beforeEach(inject(function(_$httpBackend_, _$rootScope_, UserFactory, OpenlmisURL) {
        httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        userFactory = UserFactory;

        httpBackend.when('GET', OpenlmisURL('/api/users/' + user.id))
        .respond(200, user);
    }));

    it('should get user by id', function() {
        var data;
        userFactory.get(user.id).$promise.then(function(response) {
            data = response;
        });

        httpBackend.flush();
        $rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson(user));
    });
});
