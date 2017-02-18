describe('analytics500Interceptor', function() {

    var provider, analyticsService, interceptors, response;

    beforeEach(function() {
        module('openlmis-analytics', function($provide, $httpProvider) {
            interceptors = $httpProvider.interceptors;
        });

        inject(function(analytics500Interceptor, _analyticsService_) {
            provider = analytics500Interceptor;
            analyticsService = _analyticsService_;

            spyOn(analyticsService, 'track');
        });

        response = {};
    });

    it('should be registered', function() {
        expect(interceptors.indexOf('analytics500Interceptor') > -1).toBe(true);
    });

    it('should send event to Google Analytics on 5xx status', function() {
        response.status = 500;

        provider.responseError(response);
        expect(analyticsService.track).toHaveBeenCalled();
        expect(analyticsService.track.mostRecentCall.args[2]['eventCategory']).toBe('5xx Error');
    });

});
