describe('ReportOptionsController', function() {

    //tested
    var vm;

    //mocks
    var report;

    //injects
    var state, rootScope, openlmisUrlFactoryMock;

    beforeEach(function() {
        module('report');

        module(function($provide) {

            openlmisUrlFactoryMock = jasmine.createSpy();

            $provide.factory('openlmisUrlFactory', function() {
                return openlmisUrlFactoryMock;
            });
        });

        report = {
            id: 'id-one',
            name: 'Report 1',
            templateParameters: [
                {
                    name: 'param1',
                    displayName: 'Param 1',
                    selectValues: [
                        'Option 1',
                        'Option 2'
                    ]
                },
                {
                    name: 'param2',
                    displayName: 'Param 2',
                    selectValues: [
                        'Value 1',
                        'Value 2'
                    ]
                },
            ]
        };

        inject(function($controller, $state, $rootScope) {

            state = $state;
            rootScope = $rootScope;

            vm = $controller('ReportOptionsController', {
                report: report
            });
        });

        openlmisUrlFactoryMock.andCallFake(function(url) {
            return 'http://some.url' + url;
        });
    });

    it('should set report and initialize selected values', function() {
        expect(vm.report).toEqual(report);
        expect(vm.selectedValues).toEqual({});
    });

    it('getReportUrl should prepare URLs correctly', function() {
        vm.selectedValues = {
            param1: 'Option 1',
            param2: 'Value 1'
        }
        expect(vm.getReportUrl('pdf')).toEqual('http://some.url/api/reports/templates/requisitions/id-one/pdf?param1=Option 1&&param2=Value 1&&');
        expect(vm.getReportUrl('csv')).toEqual('http://some.url/api/reports/templates/requisitions/id-one/csv?param1=Option 1&&param2=Value 1&&');
        expect(vm.getReportUrl('xls')).toEqual('http://some.url/api/reports/templates/requisitions/id-one/xls?param1=Option 1&&param2=Value 1&&');
        expect(vm.getReportUrl('html')).toEqual('http://some.url/api/reports/templates/requisitions/id-one/html?param1=Option 1&&param2=Value 1&&');
    });
});
