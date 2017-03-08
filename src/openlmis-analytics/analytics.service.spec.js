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

    var analyticsService, $window, offlineStatus;

    beforeEach(module(function($provide){
        $window = {ga: jasmine.createSpy() };
        $provide.value("$window", $window);
    }));
    
    beforeEach(module('openlmis-analytics'));

    beforeEach(inject(function(offlineService){
        offlineStatus = false;
        spyOn(offlineService, 'isOffline').andCallFake(function(){
            return offlineStatus;
        });
    }));

    beforeEach(inject(function(_analyticsService_){
        analyticsService = _analyticsService_;
    }))

    it('registers google analytics with tracking number', function(){
        expect($window.ga.calls.length).toBe(1);
        expect($window.ga.mostRecentCall.args[0]).toBe('create');
    });

    it('tracks all calls in google analytics', function(){
        analyticsService.track('all', 'arguments', 'to', 'ga');
        expect($window.ga.mostRecentCall.args.length).toBe(4);
        expect($window.ga.mostRecentCall.args[3]).toBe('ga');
    });

    it('will not track ga while offline', function(){
        analyticsService.track('foo');
        expect($window.ga.mostRecentCall.args[0]).toBe('foo');

        offlineStatus = true;

        analyticsService.track('bar');
        expect($window.ga.mostRecentCall.args[0]).not.toBe('bar');

        // last called value should still be foo....
        expect($window.ga.mostRecentCall.args[0]).toBe('foo');
    });

});