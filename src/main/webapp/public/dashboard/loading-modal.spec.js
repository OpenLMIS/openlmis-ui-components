
ddescribe("LoadingModal", function(){

    var dialog, LoadingModal, $timeout;

    beforeEach(module('openlmis-core'));

    beforeEach(inject(function(_$timeout_, _LoadingModal_, bootbox){
        LoadingModal = _LoadingModal_;
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
        LoadingModal.open();

        $timeout.flush();

        expect(bootbox.dialog).toHaveBeenCalled();
    });

    it("won't open a modal if it was closed before the timeout", function(){
        LoadingModal.open();
        LoadingModal.close();

        // Expect there to be no timeouts to call (because it was canceled)
        expect(function() {$timeout.flush();}).toThrow();
        // Expect there to be no calls to bootbox dialog
        expect(bootbox.dialog.calls.length).toEqual(0);
    });

    it("will close a modal only if one has already been opened", function(){
        LoadingModal.close();
        // Dialog didn't get loaded
        expect(dialog.modal.calls.length).toEqual(0);

        LoadingModal.open();
        $timeout.flush();
        LoadingModal.close();
        
        expect(dialog.modal).toHaveBeenCalled();
    });

});