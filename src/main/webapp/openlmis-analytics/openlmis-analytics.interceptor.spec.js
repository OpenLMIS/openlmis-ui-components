describe('analyticsInterceptor', function() {

    var provider;

    describe('responseError', function() {

        var interceptors, response, $q, $injector, $window, $location;

        beforeEach(function() {
            inject(function(_$window_) {
                $window = _$window_;
                spyOn($window, 'ga').onCallFake(function () {

                });
            });

            module('openlmis-analytics', function($provide, $httpProvider) {
                interceptors = $httpProvider.interceptors;
            });

            inject(function(analyticsInterceptor, _$q_, _$injector_, _$location_) {
                provider = analyticsInterceptor;
                $q = _$q_;
                $injector = _$injector_;
                $location = _$location_;
            });

            response = {};
        });

        // it('should be registered', function() {
        //     expect(interceptors.indexOf('analyticsInterceptor') > -1).toBe(true);
        // });

        // it('should send event to Google Analytics on 5xx status', function() {
        //     response.status = 500;

        //     provider.responseError(response);

        //     // expect(foo.setBar.calls[0].args[0]).toEqual(123);
        //     // expect($window.ga).toHaveBeenCalled();
        //     // expect(alertMock.error).toHaveBeenCalledWith('error.authorization');
        // });

        // it('should reject response', function() {
        //     spyOn($q, 'reject').andCallThrough();

        //     provider.responseError(response);

        //     expect($q.reject).toHaveBeenCalledWith(response);
        // });

    });

});
