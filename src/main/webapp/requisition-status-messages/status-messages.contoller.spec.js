describe('StatusMessagesController', function() {

    var vm;

    var rootScope, scope;

    var requisition, statusMessages;

    beforeEach(function() {

        module('requisition-status-messages');

        requisition = jasmine.createSpyObj('requisition', ['$statusMessages']);

        inject(function($rootScope) {
            rootScope = $rootScope;
        });

        scope = rootScope.$new();
        scope.requisition = requisition;
        scope.requisition.status = "INITIATED";
    });

    describe('initialization', function() {

        beforeEach(inject(function($controller) {
            vm = $controller('StatusMessagesController', {
                $scope: scope
            });

            rootScope.$apply();
        }));

        it('should expose requisition', function() {
            expect(vm.requisition).toBe(requisition);
        });

        it('should expose adjustments', function() {
            expect(vm.isAddClicked).toBe(false);
        });
    });

    describe('displayAddComment', function() {

        it('should show button if requisition has no status messages for current status', function() {
            vm.requisition.$statusMessages = [];
            expect(vm.displayAddComment()).toBe(true);
        });

        it('should not show button if requisition has status message for current status', function() {
            vm.requisition.$statusMessages = [{
                status: "INITIATED"
            }];
            expect(vm.displayAddComment()).toBe(false);
        });

    });

    describe('isAddClicked', function() {

        it('should set isAddClicked true when add button was clicked', function() {
            vm.showTextArea();
            expect(vm.isAddClicked).toBe(true);
        });

        it('should set isAddClicked false when remove button was clicked', function() {
            vm.hideTextArea();
            expect(vm.isAddClicked).toBe(false);
        });
    });

});
