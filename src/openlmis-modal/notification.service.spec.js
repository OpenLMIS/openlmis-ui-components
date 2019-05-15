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

    beforeEach(function() {
        module('openlmis-modal');

        inject(function($injector) {
            this.$timeout = $injector.get('$timeout');
            this.$rootScope = $injector.get('$rootScope');
            this.notificationService = $injector.get('notificationService');
            this.loadingModalService = $injector.get('loadingModalService');
        });

        this.findNotifications = function() {
            return angular.element(document.querySelector('.notification'));
        };
    });

    it('should hide error notification after clicking on it', function() {
        this.notificationService.error('some.message');
        this.$rootScope.$apply();

        expect(this.findNotifications().length).toBe(1);
        this.findNotifications().on('click', function(event) {
            angular.element(event.target).trigger('webkitAnimationEnd');
        });

        this.findNotifications().trigger('click');

        expect(this.findNotifications().length).toBe(0);
    });

    it('should close success notification after delay', function() {
        this.notificationService.success('some.message');
        this.$rootScope.$apply();

        expect(this.findNotifications().length).toBe(1);

        this.$timeout.flush();
        this.findNotifications().trigger('webkitAnimationEnd');

        expect(this.findNotifications().length).toBe(0);
    });

    it('should show notification after loading modal closes', function() {
        this.loadingModalService.open();

        this.notificationService.success('some.message');
        this.$rootScope.$apply();

        expect(this.findNotifications().length).toBe(0);

        this.loadingModalService.close();
        this.$rootScope.$apply();

        expect(this.findNotifications().length).toBe(1);
    });

});
