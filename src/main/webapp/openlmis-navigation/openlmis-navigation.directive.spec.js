describe('openlmis-navigation directive', function(){    
    var element, scope;

    beforeEach(module('openlmis-navigation'));

    beforeEach(module(function($stateProvider){
        $stateProvider.state('test', {
            showInNavigation: true,
            label: 'test'
        });
        $stateProvider.state('offline', {
            showInNavigation: true,
            label: 'offline',
            isOffline: true
        });
        $stateProvider.state('foo', {
            showInNavigation: true,
            label: 'foo'
        });
        $stateProvider.state('foo.bar', {
            showInNavigation: true,
            label: 'bar'
        });
        $stateProvider.state('foo.bar.baz', {
            showInNavigation: true,
            label: 'baz'
        });
        $stateProvider.state('foo.test', {
            showInNavigation: true
        });
    }));


    describe('shows navigation', function(){
        beforeEach(inject(function($rootScope, $compile){
            var markup = '<openlmis-navigation></openlmis-navigation>';
            
            scope = $rootScope.$new();
            element = $compile(markup)(scope);

            scope.$apply();
        }));

        it('will display root states', function(){
            var firstLevel = element.children();

            expect(firstLevel.length).toBe(3);
        });

        it('will show child items in a drop down', function(){
            var dropdown = element.children('.dropdown:first');

            var childStates = dropdown.children('ul').children();

            expect(dropdown.children('a').text()).toBe('foo');
            expect(childStates.length).toBe(2);
        });

        it('will recurse through child item dropdowns', function(){
            var dropdown = element.children('.dropdown:first').children('ul').children('.dropdown:first');

            var childStates = dropdown.children('ul').children();

            expect(dropdown.children('a').text()).toBe('bar');
            expect(childStates.length).toBe(1);
            expect(childStates.children('a').text()).toBe('baz');
        });
    });

    describe('offline', function(){
        var offline = true;
        beforeEach(inject(function(offlineService){
            spyOn(offlineService, 'isOffline').andCallFake(function(){
                return offline;
            });
        }));

        beforeEach(inject(function($rootScope, $compile){
            var markup = '<openlmis-navigation></openlmis-navigation>';
            
            scope = $rootScope.$new();
            element = $compile(markup)(scope);

            scope.$apply();
        }));

        it('will disable states that dont support offline', function(){
            var testLink = element.children('li:last').children('a');

            expect(testLink.text()).toBe('test');
            expect(testLink.attr('disabled')).toBe('disabled');
            expect(testLink.hasClass('is-offline')).toBe(true);
        });
        it('states marked offline will not be disabled', function(){
            var testLink = angular.element(element.children('li')[1]).children('a');

            expect(testLink.text()).toBe('offline');
            expect(testLink.attr('disabled')).toBe(undefined);
            expect(testLink.hasClass('is-offline')).toBe(false);
        });
    });

});