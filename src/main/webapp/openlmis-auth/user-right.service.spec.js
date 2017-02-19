describe('userRightService', function() {

    var $rootScope, $httpBackend, referencedataUrlFactoryMock, userRightService;

    beforeEach(function() {
        module('openlmis-auth', function($provide) {
            referencedataUrlFactoryMock = jasmine.createSpy();

            $provide.factory('referencedataUrlFactory', function() {
                return referencedataUrlFactoryMock;
            });

            referencedataUrlFactoryMock.andCallFake(function(parameter) {
                return parameter;
            });
        });

        inject(function(_$httpBackend_, _$rootScope_, _userRightService_) {
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            userRightService = _userRightService_;
        });
    });

    describe('hasRight', function() {
        it('should call hasRight endpoint with all params', function() {
            var data,
                hasRight = 'true',
                userId = '1',
                rightId = '2',
                programId = '3',
                facilityId = '4',
                warehouseId = '5';

            $httpBackend.when('GET', referencedataUrlFactoryMock('/api/users/' + userId +
                '/hasRight?facilityId=' + facilityId +
                '&programId=' + programId +
                '&rightId=' + rightId +
                '&warehouseId=' + warehouseId)).respond(200, hasRight);

            userRightService.hasRight(userId, rightId, programId, facilityId, warehouseId).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data).not.toBe(undefined);
        });

        it('should call hasRight endpoint with all params', function() {
            var data,
                hasRight = 'true',
                userId = '1',
                rightId = '2';

            $httpBackend.when('GET', referencedataUrlFactoryMock('/api/users/' + userId +
                '/hasRight?rightId=' + rightId)).respond(200, hasRight);

            userRightService.hasRight(userId, rightId).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data).not.toBe(undefined);
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
