describe('NavigationStateService', function() {

    var service, states, state, authorizationService;

    beforeEach(function() {
        module('openlmis-navigation');

        state = jasmine.createSpyObj('$state', ['get']);
        authorizationService = jasmine.createSpyObj('authorizationService', ['hasRights']);

        module(function($provide) {
            $provide.factory('$state', function() {
                return state;
            });
            $provide.factory('authorizationService', function() {
                return authorizationService;
            });
        });

        states = [
            createState('', false),
            createState('state2.subState4', true, 5, false, 'rights'),
            createState('state4', true, 1),
            createState('state2', true, 2, true),
            createState('state2.subState3', true, 43, false, 'rights'),
            createState('state1', true, 0, true),
            createState('state3', false),
            createState('state3.subState16', true, 0),
            createState('state3.subState1', true, 1),
            createState('state2.subState0', false),
            createState('state1.subState13', false),
            createState('state1.subState65', false),
            createState('state2.subState4.subSubState1', true)
        ];

        state.get.andReturn(states);

        inject(function(NavigationStateService) {
            service = NavigationStateService;
        });
    });

    describe('initialization', function() {

        it('should group by invisible root states', function() {
            expect(service.roots['']).not.toBeUndefined();
            expect(service.roots[''].length).toBe(3);
            expect(service.roots['state3']).not.toBeUndefined();
            expect(service.roots['state3'].length).toBe(2);
        });

        it('should add only visible children to parent state', function() {
            expect(service.roots[''][0].children).not.toBeUndefined();
            expect(service.roots[''][0].children.length).toBe(2);
        });

        it('should sort children by priority', function() {
            expect(service.roots[''][0].children[0]).toBe(states[4]);
            expect(service.roots[''][0].children[1]).toBe(states[1]);
        });

        it('should sort states by priority', function() {
            expect(service.roots[''][0]).toBe(states[3]);
            expect(service.roots[''][1]).toBe(states[2]);
            expect(service.roots[''][2]).toBe(states[5]);
        });

    });

    describe('shouldDisplay', function() {

        it('should return false if state should not be shown in navigation', function() {
            expect(service.shouldDisplay(states[6])).toBe(false);
        });

        it('should return true if state does not require any rights', function() {
            expect(service.shouldDisplay(states[2])).toBe(true);
        });

        it('should return true if user has required rights', function() {
            authorizationService.hasRights.andReturn(true);
            expect(service.shouldDisplay(states[1])).toBe(true);
        });

        it('should return false if used does not have required rights', function() {
            authorizationService.hasRights.andReturn(false);
            expect(service.shouldDisplay(states[4])).not.toBe(true);
        });

        it('should return false if state is abstract and has no visible children', function() {
            expect(service.shouldDisplay(states[5])).toBe(false);
        });

        it('should return true if state is abstract but has visible children', function() {
            authorizationService.hasRights.andReturn(true);
            expect(service.shouldDisplay(states[3])).toBe(true);
        });

    });

    describe('hasChildren', function() {

        it('should return true if state has visible children', function() {
            authorizationService.hasRights.andReturn(true);
            expect(service.hasChildren(states[3])).toBe(true);
        });

        it('should return false if state is abstract and does not have visible children', function() {
            expect(service.hasChildren(states[5])).toBe(false);
        });

    });

    describe('isSubmenu', function() {

        it('should return false if state is child of root', function() {
            expect(service.isSubmenu(states[3])).toBe(false);
        });

        it('should return true if state is not child of root and has children', function() {
            expect(service.isSubmenu(states[1])).toBe(true);
        });

        it('should return false if state is not child of root and has no children', function() {
            expect(service.isSubmenu(states[4])).toBe(false);
        });

    });

    function createState(name, showInNavigation, priority, abstract, rights) {
        return {
            name: name,
            showInNavigation: showInNavigation,
            priority: priority,
            abstract: abstract,
            accessRights: rights
        };
    }

});
