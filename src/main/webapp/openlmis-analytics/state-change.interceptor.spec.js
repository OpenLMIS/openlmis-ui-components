describe('analyticsStateChangeInterceptor', function() {
    var analyticsService, $rootScope;

    beforeEach(function() {
        module('openlmis-analytics');

        inject(function(_analyticsService_, _$rootScope_) {
            analyticsService = _analyticsService_;
            spyOn(analyticsService, 'track');

            $rootScope = _$rootScope_;
        });
    });

    it('sends a page view event on $StateChangeSuccess', function() {
        $rootScope.$broadcast('$stateChangeSuccess');
        $rootScope.$apply();

        expect(analyticsService.track).toHaveBeenCalled();
        expect(analyticsService.track.mostRecentCall.args[0]).toBe('send');
        expect(analyticsService.track.mostRecentCall.args[1]).toBe('pageview');
    });

});
