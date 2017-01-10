describe('serverErrorHandler', function() {

    var handler, $q, serverErrorModalService;

    beforeEach(function() {
        module('openlmis-500');

        inject(function(_serverErrorHandler_, $injector, _$q_) {
            handler = _serverErrorHandler_;
            $q = _$q_;

            alertMock = jasmine.createSpyObj('alertService', ['error']);
            spyOn($injector, 'get').andCallFake(function(name) {
                if (name === 'alertService') return alertMock;
            })
        });
    });

    it('should show modal on 500 error', function() {
        var response = {
                status: 500,
                statusText: 'Server error!'
            };

        spyOn($q, 'reject').andCallThrough();

        handler.responseError(response);

        expect(alertMock.error).toHaveBeenCalledWith(response.statusText);
        expect($q.reject).toHaveBeenCalledWith(response);
    });
});
