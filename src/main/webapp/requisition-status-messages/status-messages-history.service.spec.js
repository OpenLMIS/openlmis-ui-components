describe("statusMessagesHistoryService", function() {

    var statusMessagesHistoryService, $ngBootbox, $compile, templateRequestSpy, q,
        scope, $rootScope, requisition, deferred;

    beforeEach(function() {

        module('requisition-status-messages');

        module(function($provide) {
            templateRequestSpy = jasmine.createSpy('$templateRequest');
            $provide.factory('$templateRequest', function() {
                return templateRequestSpy;
            });
        });

        inject(function(_statusMessagesHistoryService_, _$ngBootbox_, _$rootScope_, $templateRequest,
                        _$compile_, $q) {

            statusMessagesHistoryService = _statusMessagesHistoryService_;
            $ngBootbox = _$ngBootbox_;
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            q = $q;
        });

        deferred = q.defer();
        spyOn($ngBootbox, 'customDialog');

        scope = {};

        templateRequestSpy.andReturn(q.when());
        spyOn($rootScope, '$new').andReturn(scope);

        requisition = jasmine.createSpyObj('requisition', ['$statusMessages']);

    });

    describe('show', function() {

        it('should request template', function() {
            statusMessagesHistoryService.show(requisition);
            $rootScope.$apply();

            expect(templateRequestSpy)
                .toHaveBeenCalledWith('requisition-status-messages/status-messages-history.html');
        });

        it('should open modal', function() {
            statusMessagesHistoryService.show(requisition);
            $rootScope.$apply();

            expect($ngBootbox.customDialog).toHaveBeenCalled();
        });

    });
});
