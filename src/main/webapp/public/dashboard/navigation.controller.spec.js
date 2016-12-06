ddescribe('NavigationController', function() {

    var vm, scope, NavigationService, $controller, mainRoot, subRoot, states;

    beforeEach(function() {
        module('openlmis-dashboard');

        inject(function(_$controller_) {
            $controller = _$controller_;
        });

        scope = jasmine.createSpy();

        NavigationService = jasmine.createSpyObj('NavigationService', [
            'getRoot',
            'hasChildren',
            'isSubmenu',
            'shouldDisplay'
        ]);
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

            NavigationService.getRoot.andCallFake(function(root) {
                if (root === '') return mainRoot;
                if (root === 'subRoot') return subRoot;
            });
        })

        it('should expose NavigationService.isSubmenu method', function() {
            initController();

            expect(vm.isSubmenu).toBe(NavigationService.isSubmenu);
        });

        it('should expose NavigationService.shouldDisplay method', function() {
            initController();

            expect(vm.shouldDisplay).toBe(NavigationService.shouldDisplay);
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
            NavigationService.hasChildren.andCallFake(function(state, visibleOnly) {
                return state === 'state' && visibleOnly;
            })

            initController();
        });

        it('should return visible children', function() {
            var result = vm.hasChildren('state');

            expect(result).toBe(true);
        });

        it('should call NavigationService.hasChildren', function() {
            vm.hasChildren('state');

            expect(NavigationService.hasChildren).toHaveBeenCalledWith('state', true);
        });

    });

    function initController() {
        vm = $controller('NavigationController', {
            $scope: scope,
            NavigationService: NavigationService
        });
    }

});
