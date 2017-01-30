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
            expect(vm.isTextAreaVisible).toBe(false);
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

    describe('isTextAreaVisible', function() {

        it('should set isTextAreaVisible true when add button was clicked', function() {
            vm.showTextArea();
            expect(vm.isTextAreaVisible).toBe(true);
        });

        it('should set isTextAreaVisible false when remove button was clicked', function() {
            vm.hideTextArea();
            expect(vm.isTextAreaVisible).toBe(false);
        });
    });

});
