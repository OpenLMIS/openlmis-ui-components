describe('offline', function() {

    'use strict';

    var scope, directiveElem, offlineService, compile;

    beforeEach(function() {
        module('openlmis-core');

        inject(function($rootScope, OfflineService, $compile){
            scope = $rootScope.$new();
            offlineService = OfflineService;
            compile = $compile;
        });
    });

        it('should show offline label if user is offline', function () {
            spyOn(offlineService, 'isOffline').andReturn(true);

            var rootElement = angular.element('<a offline ng-show="isOffline">Offline</a>');
            directiveElem = compile(rootElement)(scope);
            scope.$digest();

            expect(directiveElem.hasClass('ng-hide')).toBe(false);
        });

        it('should not show offline label if user is online', function () {
            spyOn(offlineService, 'isOffline').andReturn(false);

            var rootElement = angular.element('<a offline ng-show="isOffline">Offline</a>');
            directiveElem = compile(rootElement)(scope);
            scope.$digest();

            expect(directiveElem.hasClass('ng-hide')).toBe(true);
        });

        it('should update scope.isOffline if offline status changes', function(){
            var offlineStatus = false;
            spyOn(offlineService, 'isOffline').andCallFake(function(){
                return offlineStatus;
            });

            var element = compile('<a offline ng-show="isOffline">Offline</a>')(scope);
            scope.$digest();

            expect(scope.isOffline).toBe(false);

            offlineStatus = true;
            scope.$apply();

            expect(scope.isOffline).toBe(true);            
        });

        it('should call connection check after clicking on offline label', function () {
            spyOn(offlineService, 'isOffline').andReturn(true);
            spyOn(offlineService, 'checkConnection');

            var rootElement = angular.element('<a offline ng-show="isOffline" ng-click="checkConnection()">Offline</a>');
            directiveElem = compile(rootElement)(scope);
            scope.$digest();

            directiveElem.click();

            expect(offlineService.checkConnection).toHaveBeenCalled();
            expect(directiveElem.hasClass('ng-hide')).toBe(false);
        });

        it('should change class if user is offline', function () {
            spyOn(offlineService, 'isOffline').andReturn(true);

            var rootElement = angular.element('<div offline ng-class="{\'isOffline\':isOffline}"></div>');
            directiveElem = compile(rootElement)(scope);
            scope.$digest();

            expect(directiveElem.hasClass('isOffline')).toBe(true);
        });

        it('should not change class if user is online', function () {
            spyOn(offlineService, 'isOffline').andReturn(false);

            var rootElement = angular.element('<div offline ng-class="{\'isOffline\':isOffline}"></div>');
            directiveElem = compile(rootElement)(scope);
            scope.$digest();

            expect(directiveElem.hasClass('isOffline')).toBe(false);
        });
    });
