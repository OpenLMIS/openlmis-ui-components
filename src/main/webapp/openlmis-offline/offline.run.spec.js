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

describe("OfflineRun", function() {

    var offlineService, $timeout, $rootScope;

    beforeEach(function() {
        module('openlmis-offline', function($provide){
            var injector = angular.injector(['ng']);
            var $q = injector.get('$q');

            offlineService = {
                checkConnection: function(){
                    return $q.when(true);
                }
            };
            spyOn(offlineService, 'checkConnection').andCallThrough();
            
            $provide.service('offlineService', function(){
                return offlineService;
            });
        });

        inject(function(_$timeout_, _$rootScope_) {
            $timeout = _$timeout_;
            $rootScope = _$rootScope_;
        });
    });

    it('checks connection immedately', function() {
        expect(offlineService.checkConnection).toHaveBeenCalled();
    });

    it('checks connection on an interval', function(){
        var flag = false;
        runs(function(){
            $rootScope.$apply();
            setTimeout(function(){
                $timeout.flush();
                flag = true;
            }, 5);
        });

        waitsFor(function(){
            return flag;
        }, 'scope apply needs to run', 15);

        runs(function(){
            expect(offlineService.checkConnection.calls.length).toBe(2);
        });
    });
});