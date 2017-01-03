describe('NavigationController', function() {

    var vm, scope, NavigationStateService, $controller, mainRoot, subRoot, states;

    beforeEach(function() {
        module('openlmis-navigation');

        inject(function(_$controller_) {
            $controller = _$controller_;
        });

        scope = jasmine.createSpy();

        NavigationStateService = jasmine.createSpyObj('NavigationStateService', [
            'hasChildren',
            'isSubmenu',
            'shouldDisplay'
        ]);

        NavigationStateService.roots = {};
    });

    describe('initialization', function() {

        var mainRoot, subRoot, states;

        beforeEach(function() {
            mainRoot = [
                'subState1',
                'subState2'
            ];

            subRoot = [
                'subSubState1',
                'subSubState2'
            ];

            states = [
                'state1',
                'state2'
            ];

            NavigationStateService.roots = {
                '': mainRoot,
                subRoot: subRoot
            };
        })

        it('should expose NavigationStateService.isSubmenu method', function() {
            initController();

            expect(vm.isSubmenu).toBe(NavigationStateService.isSubmenu);
        });

        it('should expose NavigationStateService.shouldDisplay method', function() {
            initController();

            expect(vm.shouldDisplay).toBe(NavigationStateService.shouldDisplay);
        });

        it('should get root children if no root state or state list was given', function() {
            initController();

            expect(vm.states).toBe(mainRoot);
        });

        it('should get state children if root states was given', function() {
            scope.rootState = 'subRoot';

            initController();

            expect(vm.states).toBe(subRoot);
        });

        it('should expose states if the state list was given', function() {
            scope.states = states;

            initController();

            expect(vm.states).toBe(states);
        });

    });

    describe('hasChildren', function() {

        beforeEach(function() {
            NavigationStateService.hasChildren.andCallFake(function(state, visibleOnly) {
                return state === 'state' && visibleOnly;
            })

            initController();
        });

        it('should return visible children', function() {
            var result = vm.hasChildren('state');

            expect(result).toBe(true);
        });

        it('should call NavigationStateService.hasChildren', function() {
            vm.hasChildren('state');

            expect(NavigationStateService.hasChildren).toHaveBeenCalledWith('state', true);
        });

    });

    function initController() {
        vm = $controller('NavigationController', {
            $scope: scope,
            NavigationStateService: NavigationStateService
        });
    }

});
