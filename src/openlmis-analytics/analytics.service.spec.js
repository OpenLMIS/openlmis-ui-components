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

    beforeEach(function() {
        this.screenResolution = '200x200';
        this.viewportSize = '100x100';
        this.language = 'en-US';

        var context = this;
        module('openlmis-analytics', function($provide) {

            var ga = jasmine.createSpy();
            ga.P = [{
                model: {
                    data: {
                        ea: {
                            ':screenResolution': context.screenResolution,
                            ':viewportSize': context.viewportSize,
                            ':language': context.language
                        }
                    }
                }
            }];
            ga.apply = jasmine.createSpy();
            context.$window = {
                ga: ga
            };
            $provide.value('$window', context.$window);

            context.gaOfflineEvents = jasmine.createSpyObj('gaOfflineEvents', ['put', 'getAll', 'clearAll']);
            context.gaOfflineEvents.getAll.andReturn([]);
            context.localStorageFactorySpy = jasmine.createSpy('localStorageFactory').andCallFake(function() {
                return context.gaOfflineEvents;
            });

            $provide.service('localStorageFactory', function() {
                return context.localStorageFactorySpy;
            });
        });

        inject(function($injector) {
            this.offlineService = $injector.get('offlineService');
            this.analyticsService = $injector.get('analyticsService');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.offlineStatus = false;
        this.date = new Date();
        this.gaParameters = {
            screenResolution: this.screenResolution,
            viewportSize: this.viewportSize,
            language: this.language
        };

        spyOn(this.$rootScope, '$on').andCallThrough();
        spyOn(Date, 'now').andReturn(this.date);
        spyOn(this.offlineService, 'isOffline').andCallFake(function() {
            return context.offlineStatus;
        });
    });

    describe('on init', function() {

        it('registers google analytics with tracking number', function() {
            expect(this.$window.ga.calls[0].args[0]).toBe('create');
        });

        it('should create local storage object for ga events', function() {
            expect(this.localStorageFactorySpy).toHaveBeenCalledWith('googleAnalytics');
        });

        it('should provide tracking method', function() {
            expect(angular.isFunction(this.analyticsService.track)).toBe(true);
        });

        it('should check if there is no events stored', function() {
            expect(this.gaOfflineEvents.getAll).toHaveBeenCalled();
        });
    });

    describe('online tracking', function() {

        it('should track all calls in google analytics', function() {
            this.analyticsService.track('all', 'arguments', 'to', 'ga');

            expect(this.$window.ga.apply).toHaveBeenCalledWith(this.analyticsService, ['all', 'arguments', 'to', 'ga']);
        });

        it('should not track ga while offline', function() {

            this.analyticsService.track('foo');

            expect(this.$window.ga.apply).toHaveBeenCalled();

            this.offlineStatus = true;

            this.analyticsService.track('foo');

            expect(this.$window.ga.apply.callCount).toEqual(1);
        });
    });

    describe('offline tracking', function() {

        it('should store events while offline', function() {
            this.offlineStatus = true;

            this.analyticsService.track('bar');

            expect(this.gaOfflineEvents.put).toHaveBeenCalledWith({
                arguments: [
                    'bar'
                ],
                gaParameters: _.extend({}, this.gaParameters, {
                    time: this.date
                })
            });
        });

        it('should send all events stored offline when connection is restored', function() {
            var args = ['arg1', 'arg2', 'arg3', 'arg4'];
            var offsets = [0, 1000, 2000];

            var offlineEvents = [
                {
                    arguments: {
                        0: args[0],
                        1: args[1]
                    },
                    gaParameters: _.extend({}, this.gaParameters, {
                        time: this.date - 1000
                    })
                },
                {
                    arguments: {
                        0: args[2],
                        1: args[3]
                    },
                    gaParameters: _.extend({}, this.gaParameters, {
                        time: this.date - 2000
                    })
                }
            ];

            this.gaOfflineEvents.getAll.andReturn(offlineEvents);

            this.$rootScope.$broadcast('openlmis.online');
            this.$rootScope.$apply();

            expect(this.$window.ga.apply).toHaveBeenCalledWith(null, [args[0], args[1]]);
            expect(this.$window.ga.apply).toHaveBeenCalledWith(null, [args[2], args[3]]);

            expect(this.$window.ga).toHaveBeenCalledWith('set', 'viewportSize', this.viewportSize);
            expect(this.$window.ga).toHaveBeenCalledWith('set', 'screenResolution', this.screenResolution);
            expect(this.$window.ga).toHaveBeenCalledWith('set', 'language', this.language);

            expect(this.$window.ga).toHaveBeenCalledWith('set', 'queueTime', offsets[1]);
            expect(this.$window.ga).toHaveBeenCalledWith('set', 'queueTime', offsets[2]);
            expect(this.$window.ga).toHaveBeenCalledWith('set', 'queueTime', offsets[0]);
        });

    });
});
