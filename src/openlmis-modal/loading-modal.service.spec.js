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
        loadingModalService.open(true);

        $timeout.flush();

        expect(bootbox.dialog).toHaveBeenCalled();
    });

    it("won't open a modal if it was closed before the timeout", function(){
        loadingModalService.open(true);
        loadingModalService.close();

        $timeout.flush(); // clear any timeouts (nothing should happen)

        // Expect there to be no calls to bootbox dialog
        expect(bootbox.dialog.calls.length).toEqual(0);
    });

    it("will close a modal only if one has already been opened", function(){
        loadingModalService.close();
        // Dialog didn't get loaded
        expect(dialog.modal.calls.length).toEqual(0);

        loadingModalService.open(true);
        $timeout.flush();
        loadingModalService.close();

        expect(dialog.modal).toHaveBeenCalled();
    });

});
