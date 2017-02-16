describe('Button directives', function() {
    var $compile,
        $rootScope;

    beforeEach(function() {

        module('openlmis-analytics');

        inject(function(_$compile_, _$rootScope_, _$window_, _$location_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $window = _$window_;
            $location = _$location_;
        });
    });

    // it('will add an event handler', function() {
    //   var element = $compile("<button>{{'label.name' | message}}</button>")($rootScope);

    //   expect(element.html()).toContain("lidless, wreathed in flame, 2 times");
    // });
});