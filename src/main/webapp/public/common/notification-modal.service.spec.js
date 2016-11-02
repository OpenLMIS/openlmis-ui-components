/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
ddescribe("NotificationModal", function() {

    var timeout, notificationModal, httpBackend, scope;

    beforeEach(module('openlmis-core'));

    beforeEach(inject(function(_$timeout_, NotificationModal, $templateCache) {
        timeout = _$timeout_;
        notificationModal = NotificationModal;

        $templateCache.put('common/notification-modal.html', "something");
    }));

    it('should hide succes modal then call callback function after delay', function() {
        var called = false;

        notificationModal.showSuccess('some.message', function() {
            called = true;
        });

        // callback hasn't happened yet
        expect(called).toBe(false);
        
        timeout.flush();
        timeout.verifyNoPendingTasks();
        
        // callback was fired
        expect(called).toBe(true);
    });

});