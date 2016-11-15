/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

describe('UserProfileController', function() {

    var scope, ctrl, httpBackend, controller, notificationModal, user, q;
    beforeEach(module('openlmis-dashboard'));

    beforeEach(inject(function ($httpBackend, $rootScope, $controller, NotificationModal, $q) {
        scope = $rootScope.$new();
        controller = $controller;
        httpBackend = $httpBackend;
        notificationModal = NotificationModal;
        q = $q;

        user = {
            firstName: 'Name',
            lastName: 'Surname',
            email: 'email@olmis.com',
            roleAssignments: [
                {
                    programCode: 'prog-code1',
                    supervisoryNodeCode: 'sn-code1'
                },
                {
                    programCode: 'prog-code2',
                    supervisory: 'sn-code2'
                }
            ]
        }

        ctrl = controller('UserProfileController', {$scope:scope, user:user});
    }));

    it('should set user profile', function() {
        expect(user).toEqual(scope.userProfile);
    });

    it('should set error message if there is no user info', function() {
        scope.userProfile = null;
        expect(scope.errorMessage()).toEqual('msg.rnr.get.user.info.error');
    });

    function callback() {
        var deferred = q.defer();
        deferred.resolve();
        return deferred.promise;
    }

});

