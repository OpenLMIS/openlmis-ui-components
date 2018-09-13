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

    var analyticsService, $window, offlineStatus, gaOfflineEvents, localStorageFactorySpy, offlineService, date,
        $rootScope;

    beforeEach(function() {
        module('openlmis-analytics', function($provide) {

            var ga = jasmine.createSpy();
            ga.P = [{
                b: {
                    data: {
                        values: {
                            ':screenResolution': '200x200',
                            ':viewportSize': '100x100',
                            ':language': 'en-US'
                        }
                    }
                }
            }];
            ga.apply = jasmine.createSpy();
            $window = {
                ga: ga
            };
            $provide.value('$window', $window);

            gaOfflineEvents = jasmine.createSpyObj('gaOfflineEvents', ['put', 'getAll', 'clearAll']);
            gaOfflineEvents.getAll.andReturn([]);
            localStorageFactorySpy = jasmine.createSpy('localStorageFactory').andCallFake(function() {
                return gaOfflineEvents;
            });

            $provide.service('localStorageFactory', function() {
                return localStorageFactorySpy;
            });
        });

        inject(function($injector) {
            offlineService = $injector.get('offlineService');
            analyticsService = $injector.get('analyticsService');
            $rootScope = $injector.get('$rootScope');
        });

        offlineStatus = false;

        spyOn(offlineService, 'isOffline').andCallFake(function() {
            return offlineStatus;
        });

        spyOn($rootScope, '$on').andCallThrough();

        date = new Date();
        spyOn(Date, 'now').andReturn(date);
    });

    describe('on init', function() {

        it('registers google analytics with tracking number', function() {
            expect($window.ga.calls[0].args[0]).toBe('create');
        });

        it('should create local storage object for ga events', function() {
            expect(localStorageFactorySpy).toHaveBeenCalledWith('googleAnalytics');
        });

        it('should provide tracking method', function() {
            expect(angular.isFunction(analyticsService.track)).toBe(true);
        });

        it('should check if there is no events stored', function() {
            expect(gaOfflineEvents.getAll).toHaveBeenCalled();
        });
    });

    describe('online tracking', function() {

        it('should track all calls in google analytics', function() {
            analyticsService.track('all', 'arguments', 'to', 'ga');

            expect($window.ga.apply).toHaveBeenCalledWith(analyticsService, ['all', 'arguments', 'to', 'ga']);
        });

        it('should not track ga while offline', function() {

            analyticsService.track('foo');

            expect($window.ga.apply).toHaveBeenCalled();

            offlineStatus = true;

            analyticsService.track('foo');

            expect($window.ga.apply.callCount).toEqual(1);
        });
    });

    describe('offline tracking', function() {

        it('should store events while offline', function() {
            offlineStatus = true;

            analyticsService.track('bar');

            expect(gaOfflineEvents.put).toHaveBeenCalledWith({
                arguments: [
                    'bar'
                ],
                gaParameters: {
                    screenResolution: '200x200',
                    viewportSize: '100x100',
                    language: 'en-US',
                    time: Date.now()
                }
            });
        });

        it('should send all events stored offline when connection is restored', function() {

            var offlineEvents = [
                {
                    arguments: {
                        0: 'arg1',
                        1: 'arg2'
                    },
                    gaParameters: {
                        screenResolution: '200x200',
                        viewportSize: '100x100',
                        language: 'en-US',
                        time: date - 1000
                    }
                },
                {
                    arguments: {
                        0: 'arg3',
                        1: 'arg4'
                    },
                    gaParameters: {
                        screenResolution: '200x200',
                        viewportSize: '100x100',
                        language: 'en-US',
                        time: date - 2000
                    }
                }
            ];

            gaOfflineEvents.getAll.andReturn(offlineEvents);

            $rootScope.$broadcast('openlmis.online');
            $rootScope.$apply();

            expect($window.ga.apply).toHaveBeenCalledWith(null, ['arg1', 'arg2']);
            expect($window.ga.apply).toHaveBeenCalledWith(null, ['arg3', 'arg4']);

            expect($window.ga).toHaveBeenCalledWith('set', 'viewportSize', '100x100');
            expect($window.ga).toHaveBeenCalledWith('set', 'screenResolution', '200x200');
            expect($window.ga).toHaveBeenCalledWith('set', 'language', 'en-US');

            expect($window.ga).toHaveBeenCalledWith('set', 'queueTime', 1000);
            expect($window.ga).toHaveBeenCalledWith('set', 'queueTime', 2000);
            expect($window.ga).toHaveBeenCalledWith('set', 'queueTime', 0);
        });

    });
});
