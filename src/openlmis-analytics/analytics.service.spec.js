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

describe('analyticsService', function() {

    var analyticsService, $window, offlineStatus, gaOfflineEvents, localStorageFactorySpy, eventsStoredOffline, offlineService;

    beforeEach(function() {

        eventsStoredOffline = [];

        module('openlmis-analytics', function($provide) {
            $window = {
                ga: jasmine.createSpy()
            };
            $provide.value("$window", $window);

            gaOfflineEvents = jasmine.createSpyObj('gaOfflineEvents', ['put', 'getAll', 'clearAll']);
            gaOfflineEvents.getAll.andCallFake(function() {
                return eventsStoredOffline;
            });
            localStorageFactorySpy = jasmine.createSpy('localStorageFactory').andCallFake(function() {
                return gaOfflineEvents;
            });

            $provide.service('localStorageFactory', function() {
                return localStorageFactorySpy;
            });
        });

        inject(function(_offlineService_, _analyticsService_) {

            offlineStatus = false;

            analyticsService = _analyticsService_;
            offlineService = _offlineService_;

            spyOn(offlineService, 'isOffline').andCallFake(function() {
                return offlineStatus;
            });
        });
    });

    it('tracks all calls in google analytics', function() {
        analyticsService.track('all', 'arguments', 'to', 'ga');
        expect($window.ga.mostRecentCall.args.length).toBe(4);
        expect($window.ga.mostRecentCall.args[3]).toBe('ga');
    });

    it('will not track ga while offline', function() {
        analyticsService.track('foo');
        expect($window.ga.mostRecentCall.args[0]).toBe('foo');

        offlineStatus = true;

        analyticsService.track('bar');
        expect($window.ga.mostRecentCall.args[0]).not.toBe('bar');

        // last called value should still be foo....
        expect($window.ga.mostRecentCall.args[0]).toBe('foo');
    });

    describe('on init', function() {

        it('registers google analytics with tracking number', function() {
            expect($window.ga.calls.length).toBe(1);
            expect($window.ga.mostRecentCall.args[0]).toBe('create');
        });

        it('should create local storage object for ga events', function() {
            expect(localStorageFactorySpy).toHaveBeenCalledWith('googleAnalytics');
        });

        it('should check if there are offline events stored', function() {
            expect(gaOfflineEvents.getAll).toHaveBeenCalled();
        });
    });

    describe('online tracking', function() {

        it('should track all calls in google analytics', function() {
            analyticsService.track('all', 'arguments', 'to', 'ga');
            expect($window.ga.mostRecentCall.args.length).toBe(4);
            expect($window.ga.mostRecentCall.args[3]).toBe('ga');
        });

        it('should not track ga while offline', function() {
            analyticsService.track('foo');
            expect($window.ga.mostRecentCall.args[0]).toBe('foo');

            offlineStatus = true;

            analyticsService.track('bar');
            expect($window.ga.mostRecentCall.args[0]).not.toBe('bar');

            // last called value should still be foo....
            expect($window.ga.mostRecentCall.args[0]).toBe('foo');
        });
    });

    describe('offline tracking', function() {

        var passedListener;

        beforeEach(function() {
            spyOn(offlineService, 'addOnlineListener').andCallFake(function(listener) {
                passedListener = listener;
            });
        });

        it('should store events while offline', function() {
            offlineStatus = true;

            analyticsService.track('bar');

            expect(gaOfflineEvents.put).toHaveBeenCalledWith({
                id: 1,
                arguments: [
                    'bar'
                ]
            });
        });

        it('should send all events stored offline when connection is restored', function() {
            var offlineEvents = [
                {
                    id: 1,
                    arguments: {
                        0: 'arg1',
                        1: 'arg2'
                    }
                },
                {
                    id: 2,
                    arguments: {
                        0: 'arg3',
                        1: 'arg4'
                    }
                }
            ];

            offlineStatus = true;

            analyticsService.track('bar');

            gaOfflineEvents.getAll.andReturn(offlineEvents);

            passedListener();

            expect($window.ga.mostRecentCall.args[0]).toBe('arg3');
            expect($window.ga.mostRecentCall.args[1]).toBe('arg4');
        });

    });
});
