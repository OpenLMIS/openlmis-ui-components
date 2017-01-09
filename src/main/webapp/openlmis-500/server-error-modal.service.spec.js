describe('serverErrorModalService', function() {

    var serverErrorModalService, alertMock;

    beforeEach(function() {
        module('openlmis-500');

        inject(function(_serverErrorModalService_, $injector) {
            serverErrorModalService = _serverErrorModalService_;

            alertMock = jasmine.createSpyObj('alertService', ['error']);
            spyOn($injector, 'get').andCallFake(function(name) {
                if (name === 'alertService') return alertMock;
            })
        });
    });

    it('should display modal if no other is shown', function() {
        var message = 'message';

        serverErrorModalService.displayAlert(message);

        expect(alertMock.error).toHaveBeenCalled();
    });

    it('should not display modal if other is shown', function() {
        var message = 'message';

        serverErrorModalService.displayAlert(message);

        expect(alertMock.error).toHaveBeenCalled();

        serverErrorModalService.displayAlert(message);

        expect(alertMock.error.callCount).toEqual(1);
    });
});
