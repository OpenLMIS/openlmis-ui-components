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

    var $timeout, $rootScope, notificationService, loadingModalService;

    beforeEach(function() {
        module('openlmis-modal');

        inject(function($injector) {
            $timeout = $injector.get('$timeout');
            $rootScope = $injector.get('$rootScope');
            notificationService = $injector.get('notificationService');
            loadingModalService = $injector.get('loadingModalService');
        });
    });

    it('should hide error notification after clicking on it', function() {
        notificationService.error('some.message');

        expect(findNotifications().length).toBe(1);
        findNotifications().on('click', function(event) {
            angular.element(event.target).trigger('webkitAnimationEnd');
        });

        findNotifications().trigger('click');

        expect(findNotifications().length).toBe(0);
    });

    it('should close success notification after delay', function() {
        notificationService.success('some.message');

        expect(findNotifications().length).toBe(1);

        $timeout.flush();
        findNotifications().trigger('webkitAnimationEnd');

        expect(findNotifications().length).toBe(0);
    });

    it('should show notification after loading modal closes', function() {
        loadingModalService.open();

        notificationService.success('some.message');
        $rootScope.$apply();

        expect(findNotifications().length).toBe(0);

        loadingModalService.close();
        $rootScope.$apply();

        expect(findNotifications().length).toBe(1);
    });

    function findNotifications() {
        return angular.element(document.querySelector('.notification'));
    }

});
