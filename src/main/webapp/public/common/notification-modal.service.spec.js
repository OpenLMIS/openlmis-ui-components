/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe("NotificationModal", function() {

    var timeout, notificationModal, rootScope, called;

    beforeEach(module('openlmis-core'));

    beforeEach(inject(function(_$rootScope_, _$timeout_, NotificationModal, $templateCache) {
        timeout = _$timeout_;
        notificationModal = NotificationModal;
        rootScope = _$rootScope_;

        $templateCache.put('common/notification-modal.html', "something");
    }));

    it('should close succes modal then call callback function after clicking on it', function() {
        var callback = jasmine.createSpy();
        notificationModal.showSuccess('some.message').then(callback);
        angular.element(document.querySelector('.notification-modal')).trigger('click');
        waitsFor(function() {
            rootScope.$digest();
            return callback.callCount > 0;
        }, "Callback has not been executed.", 1000);
         
        runs(function() {
            expect(callback).toHaveBeenCalled();
        });
    });

    it('should hide error modal after clicking on it', function() {
        notificationModal.showError('some.message');
        
        angular.element(document.querySelector('.notification-modal')).trigger('click');

        waitsFor(function() {
            return angular.element(document.querySelector('.notification-modal')).length < 1;
        }, "Modal has not been closed.", 1000);
         
        runs(function() {
            expect(angular.element(document.querySelector('.notification-modal')).length).toBe(0);
        });
    });

    it('should close succes modal then call callback function after delay', function() {
        var callback = jasmine.createSpy();
        notificationModal.showSuccess('some.message').then(callback);

        // callback hasn't happened yet
        expect(callback.callCount).toBe(0);
        
        timeout.flush();
        timeout.verifyNoPendingTasks();
        
        // callback was fired
        expect(callback).toHaveBeenCalled();
    });

});