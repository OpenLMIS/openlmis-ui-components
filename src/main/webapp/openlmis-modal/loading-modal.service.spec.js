
describe("LoadingModal", function(){

    var dialog, loadingModalService, $timeout;

    beforeEach(module('openlmis-modal'));

    beforeEach(inject(function(_$timeout_, _loadingModalService_, bootbox){
        loadingModalService = _loadingModalService_;
        $timeout = _$timeout_;

        dialog = {
            modal: 'stub this',
            on: 'stub that'
        };
        spyOn(dialog, 'modal');
        spyOn(dialog, 'on');

        spyOn(bootbox, 'dialog').andCallFake(function(){
            return dialog;
        });
    }));

    it('opens a modal after a timeout', function(){
        loadingModalService.open();

        $timeout.flush();

        expect(bootbox.dialog).toHaveBeenCalled();
    });

    it("won't open a modal if it was closed before the timeout", function(){
        loadingModalService.open();
        loadingModalService.close();

        $timeout.flush(); // clear any timeouts (nothing should happen)

        // Expect there to be no calls to bootbox dialog
        expect(bootbox.dialog.calls.length).toEqual(0);
    });

    it("will close a modal only if one has already been opened", function(){
        loadingModalService.close();
        // Dialog didn't get loaded
        expect(dialog.modal.calls.length).toEqual(0);

        loadingModalService.open();
        $timeout.flush();
        loadingModalService.close();

        expect(dialog.modal).toHaveBeenCalled();
    });

});
