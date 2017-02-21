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

describe("offlineService", function() {

    var offline, offlineService, timeout;

    beforeEach(function() {
        module('openlmis-offline');

        inject(function(_offlineService_, Offline, $timeout) {
            offlineService = _offlineService_;
            offline = Offline;
            timeout = $timeout;
        });
    });

    it('should return false when there is internet connection', function() {
        spyOn(offline, 'check').andCallFake(function() {
            offline.trigger('confirmed-up');
        });

        offlineService.checkConnection();
        timeout.flush(30001);

        var isOffline = offlineService.isOffline();

        expect(isOffline).toBe(false);
    });

    it('should return true when there is no internet connection', function() {
        spyOn(offline, 'check').andCallFake(function() {
            offline.trigger('confirmed-down');
        });

        offlineService.checkConnection();
        timeout.flush(30001);

        var isOffline = offlineService.isOffline();

        expect(isOffline).toBe(true);
    });

    it('should return false when the connection has gone from down to up', function() {
        spyOn(offline, 'check').andCallFake(function() {
            offline.trigger('up');
        });

        offlineService.checkConnection();
        timeout.flush(30001);

        var isOffline = offlineService.isOffline();

        expect(isOffline).toBe(false);
    });

    it('should return true when the connection has gone from up to down', function() {
        spyOn(offline, 'check').andCallFake(function() {
            offline.trigger('down');
        });

        offlineService.checkConnection();
        timeout.flush(30001);

        var isOffline = offlineService.isOffline();

        expect(isOffline).toBe(true);
    });
});
