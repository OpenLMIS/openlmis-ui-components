
describe("LoadingModal", function(){

    var dialog, LoadingModalService, $timeout;

    beforeEach(module('openlmis-core'));

    beforeEach(inject(function(_$timeout_, _LoadingModalService_, bootbox){
        LoadingModalService = _LoadingModalService_;
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
        LoadingModalService.open();

        $timeout.flush();

        expect(bootbox.dialog).toHaveBeenCalled();
    });

    it("won't open a modal if it was closed before the timeout", function(){
        LoadingModalService.open();
        LoadingModalService.close();

        $timeout.flush(); // clear any timeouts (nothing should happen)
        
        // Expect there to be no calls to bootbox dialog
        expect(bootbox.dialog.calls.length).toEqual(0);
    });

    it("will close a modal only if one has already been opened", function(){
        LoadingModalService.close();
        // Dialog didn't get loaded
        expect(dialog.modal.calls.length).toEqual(0);

        LoadingModalService.open();
        $timeout.flush();
        LoadingModalService.close();
        
        expect(dialog.modal).toHaveBeenCalled();
    });

});