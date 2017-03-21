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

describe('userService', function() {

    var $rootScope, $httpBackend, $q, openlmisUrlFactory, offlineService, programsStorage, user1, user2;

    beforeEach(function() {

        module('referencedata-user');

        inject(function(_$httpBackend_, _$rootScope_, _$q_, _openlmisUrlFactory_, _userService_) {
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            openlmisUrlFactory = _openlmisUrlFactory_;
            userService = _userService_;
        });

        user1 = {
            id: '1',
            name: 'user1'
        };
        user2 = {
            id: '2',
            name: 'user2'
        };
    });

    it('should get user by id', function() {
        var data;

        $httpBackend.when('GET', openlmisUrlFactory('/api/users/' + user1.id))
        .respond(200, user1);

        userService.get(user1.id).then(function(response) {
            data = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(data.id).toEqual(user1.id);
        expect(data.name).toEqual(user1.name);
    });

    it('should get all programs', function() {
        var data;

        $httpBackend.when('GET', openlmisUrlFactory('/api/users'))
        .respond(200, [user1, user2]);

        userService.getAll().then(function(response) {
            data = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(data[0].id).toEqual(user1.id);
        expect(data[1].id).toEqual(user2.id);
    });
});
