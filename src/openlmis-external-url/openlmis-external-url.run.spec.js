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

describe('openlmis-external-url', function() {
    var $rootScope, loadingModalService, $window;

    describe('run block', function() {
        beforeEach(function() {
            module('openlmis-external-url', function($provide) {
                $provide.value('$rootScope', {
                    $on: jasmine.createSpy(),
                    $watch: jasmine.createSpy(),
                    $evalAsync: jasmine.createSpy()
                });
            });

            inject(function(_$rootScope_) {
                $rootScope =  _$rootScope_;
            });
        });

        it('should call rootScope $on method', function() {
            expect($rootScope.$on).toHaveBeenCalledWith('$stateChangeStart', jasmine.any(Function));
        });
    });

    describe('state change', function() {
        beforeEach(function() {
            module('openlmis-external-url', function($provide) {
                $provide.service('loadingModalService', function() {
                    return {
                        close: jasmine.createSpy(),
                        open: jasmine.createSpy()
                    };
                });

                $provide.value('$window', {
                    open: jasmine.createSpy()
                });
            });

            inject(function (_$rootScope_, _loadingModalService_, _$window_) {
                $rootScope = _$rootScope_;
                loadingModalService = _loadingModalService_;
                $window = _$window_;
            });
        });

        it('should close loading modal when external url provided', function() {
            $rootScope.$broadcast('$stateChangeStart', {name: 'myState', externalUrl: 'http://my.url'});
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
        });

        it('should open url when external url provided', function() {
            $rootScope.$broadcast('$stateChangeStart', {name: 'myState', externalUrl: 'http://my.url'});
            $rootScope.$apply();

            expect($window.open).toHaveBeenCalled();
        });

        it('should not close loading modal when external url not provided', function() {
            $rootScope.$broadcast('$stateChangeStart', {name: 'myState'});
            $rootScope.$apply();

            expect(loadingModalService.close).not.toHaveBeenCalled();
        });

        it('should not open url when external url not provided', function() {
            $rootScope.$broadcast('$stateChangeStart', {name: 'myState'});
            $rootScope.$apply();

            expect($window.open).not.toHaveBeenCalled();
        });
    });
});