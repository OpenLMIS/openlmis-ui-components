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
    });

    describe('displayAddComment', function() {

        it('should show button if requisition has no draft for status message', function() {
            vm.requisition.draftStatusMessage = null;
            vm.isTextAreaVisible = false;
            var result = vm.displayAddComment();
            expect(result).toBe(true);
        });

        it('should not show button if requisition has draft for status message', function() {
            vm.requisition.draftStatusMessage = 'Draft';
            vm.isTextAreaVisible = true;
            var result = vm.displayAddComment();
            expect(result).toBe(false);
        });

    });

    describe('draftStatusMessage', function() {

        it('should set draft to null when remove button was clicked', function() {
            vm.removeComment();
            expect(vm.requisition.draftStatusMessage).toBe(null);
        });
    });

    describe('isTextAreaVisible', function() {

        it('should set isTextAreaVisible as true when add button was clicked', function() {
            vm.addComment();
            expect(vm.isTextAreaVisible).toBe(true);
        });

        it('should set set isTextAreaVisible as false when remove button was clicked', function() {
            vm.removeComment();
            expect(vm.isTextAreaVisible).toBe(false);
        });
    });

});
