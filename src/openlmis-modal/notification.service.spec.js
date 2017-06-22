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

describe('notificationService', function() {

    var timeout, notificationService, rootScope;

    beforeEach(module('openlmis-modal'));

    beforeEach(inject(function($templateCache) {
        $templateCache.put('openlmis-modal/notification.html', '<div class="notification" ng-click="closeNotification()"></div>');
        $templateCache.put('openlmis-modal/notification-container.html', "something");
    }));

    beforeEach(inject(function(_$rootScope_, _$timeout_, _notificationService_) {
        timeout = _$timeout_;
        notificationService = _notificationService_;
        rootScope = _$rootScope_;
    }));

    it('should hide error notification after clicking on it', function() {
        notificationService.error('some.message');

        angular.element(document.querySelector('.notification')).trigger('click');

        waitsFor(function() {
            return angular.element(document.querySelector('.notification')).length < 1;
        }, "notification to close.", 1000);

        runs(function() {
            expect(angular.element(document.querySelector('.notification')).length).toBe(0);
        });
    });

    it('should close success notification after delay', function() {
        notificationService.success('some.message');

        timeout.flush();

        expect(angular.element(document.querySelector('.notification')).length).toBe(0);
    });

});
