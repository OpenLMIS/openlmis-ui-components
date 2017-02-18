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