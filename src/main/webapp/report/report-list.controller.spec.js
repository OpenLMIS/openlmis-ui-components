describe('ReportListController', function() {

    //tested
    var vm;

    //mocks
    var reports;

    //injects
    var state, rootScope;

    beforeEach(function() {
        module('report');

        reports = [
            {
                id: 'id-one',
                name: 'Report 1'
            },
            {
                id: 'id-two',
                name: 'Report 2'
            }
        ];

        inject(function($controller, $state, $rootScope) {

            state = $state;
            rootScope = $rootScope;

            vm = $controller('ReportListController', {
                reports: reports
            });
        });
    });

    it('should set report list', function() {
        expect(vm.reports).toEqual(reports);
    });

    it('should go to report options page', function() {
        var stateGoSpy = jasmine.createSpy();

        spyOn(state, 'go').andCallFake(stateGoSpy);

        vm.goToReport(reports[0].id);

        rootScope.$apply();

        expect(stateGoSpy).toHaveBeenCalledWith('reports.options', { report: reports[0].id });
    });
});
