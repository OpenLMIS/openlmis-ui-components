describe('Button directives', function() {
    var $compile,
        $rootScope;

    beforeEach(function() {

        module('openlmis-analytics');

        inject(function(_$compile_, _$rootScope_, _analyticsService_, _$location_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            analyticsService = _analyticsService_;
            $location = _$location_;

            spyOn(analyticsService, 'track');
        });
    });

    it('will track click events on a button elements with the untranslated text', function() {
        var element = $compile("<button>{{'label.name' | message}}</button>")($rootScope.$new());

        $rootScope.$apply();
        angular.element(element[0]).click();

        expect(analyticsService.track.mostRecentCall.args[0]).toBe('send');
        expect(analyticsService.track.mostRecentCall.args[2]['eventCategory']).toBe('Button Click');
        expect(analyticsService.track.mostRecentCall.args[2]['eventAction']).toBe('label.name');
    });

});