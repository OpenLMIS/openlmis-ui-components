describe('serverErrorHandler', function() {

    var handler, $q, serverErrorModalService;

    beforeEach(function() {
        module('openlmis-500', function($provide) {
            var serviceSpy = jasmine.createSpyObj('serverErrorModalService', ['displayAlert']);

            $provide.service('serverErrorModalService', function() {
                return serviceSpy;
            });
        });

        inject(function(serverErrorHandler, _$q_, _serverErrorModalService_) {
            handler = serverErrorHandler;
            $q = _$q_;
            serverErrorModalService = _serverErrorModalService_;
        });
    });

    it('should show modal on 500 error', function() {
        var response = {
                status: 500,
                statusText: 'Server error!'
            };

        handler.responseError(response);

        expect(serverErrorModalService.displayAlert).toHaveBeenCalledWith(response.statusText);
    });
});
