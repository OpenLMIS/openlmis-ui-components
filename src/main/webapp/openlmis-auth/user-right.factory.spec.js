describe('userRightFactory', function() {

    var $rootScope, $q, userRightServiceMock, authorizationServiceMock, userRightFactory;

    beforeEach(function() {

        module('openlmis-auth', function($provide) {
            authorizationServiceMock = jasmine.createSpyObj('authorizationService', ['getRightByName', 'getUser', 'isAuthenticated']);
            $provide.service('authorizationService', function() {
                return authorizationServiceMock;
            });
            authorizationServiceMock.isAuthenticated.andReturn(true);

            userRightServiceMock = jasmine.createSpyObj('userRightService', ['hasRight']);
            $provide.service('userRightService', function() {
                return userRightServiceMock;
            });
        });

        inject(function(_$rootScope_,  _$q_, _userRightFactory_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            userRightFactory = _userRightFactory_;
        });
    });

    describe('checkRightForUser', function() {

        var data,
            userId = '1',
            rightName = 'someRight',
            programId = '2',
            facilityId = '3',
            warehouseId = '4',
            right = {
                name: rightName,
                id: 5
            },
            promise;

        beforeEach(function() {
            userRightServiceMock.hasRight.andCallFake(function() {
                return $q.when(true);
            });
            authorizationServiceMock.getRightByName.andReturn(right);

            promise = userRightFactory.checkRightForUser(userId, rightName, programId, facilityId, warehouseId);
        });

        it('should call authorizationService getRightByName method', function() {
            expect(authorizationServiceMock.getRightByName).toHaveBeenCalledWith(rightName);
        });

        it('should call userRightService hasRight method with all parameters', function() {
            expect(userRightServiceMock.hasRight).toHaveBeenCalledWith(userId, right.id, programId, facilityId, warehouseId);
        });

        it('should call userRightService hasRight method with required parameters', function() {
            userRightFactory.checkRightForUser(userId, rightName);
            $rootScope.$apply();

            expect(userRightServiceMock.hasRight).toHaveBeenCalledWith(userId, right.id, undefined, undefined, undefined);
        });

        it('should resolve promise after calling hasRight method', function() {
            promise.then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data).toBe(true);
        });

        it('should reject promise if user has not got specific right in local storage', function() {
            authorizationServiceMock.getRightByName.andReturn(undefined);

            userRightFactory.checkRightForUser(userId, rightName).then(function(response) {
                data = response;
            }, function() {
                data = 'rejected';
            });

            $rootScope.$apply();

            expect(data).toBe('rejected');
        });
    });

    describe('checkRightForCurrentUser', function() {

        var data,
            user = {
                user_id: '1'
            },
            rightName = 'someRight',
            right = {
                name: rightName,
                id: 5
            },
            programId = '2',
            facilityId = '3',
            warehouseId = '4',
            promise;

        beforeEach(function() {
            userRightServiceMock.hasRight.andCallFake(function() {
                return $q.when(true);
            });
            authorizationServiceMock.getRightByName.andReturn(right);
            authorizationServiceMock.getUser.andReturn(user);
            spyOn(userRightFactory, 'checkRightForUser').andReturn(true);

            promise = userRightFactory.checkRightForCurrentUser(rightName, programId, facilityId, warehouseId);
        });

        it('should call authorizationService getUser method', function() {
            expect(authorizationServiceMock.getUser).toHaveBeenCalled();
        });

        it('should call userRightService hasRight method with all parameters', function() {
            expect(userRightServiceMock.hasRight).toHaveBeenCalledWith(user.user_id, right.id, programId, facilityId, warehouseId);
        });

        it('should call userRightService hasRight method with required parameters', function() {
            userRightFactory.checkRightForCurrentUser(rightName);
            $rootScope.$apply();

            expect(userRightServiceMock.hasRight).toHaveBeenCalledWith(user.user_id, right.id, undefined, undefined, undefined);
        });

        it('should resolve promise after calling hasRight method', function() {
            promise.then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data).toBe(true);
        });

        it('should reject promise if user is not logged in', function() {
            authorizationServiceMock.getUser.andReturn(undefined);

            userRightFactory.checkRightForCurrentUser(rightName).then(function(response) {
                data = response;
            }, function() {
                data = 'rejected';
            });

            $rootScope.$apply();

            expect(data).toBe('rejected');
        });
    });
});
