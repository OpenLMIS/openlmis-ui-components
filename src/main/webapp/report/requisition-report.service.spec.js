describe('requisitionReportService', function() {

    var requisitionReportService, $rootScope, $httpBackend, openlmisUrlFactory,
        reports = [{
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
        }, {
            id: 'id-two',
            name: 'Report 2',
            templateParameters: []
        }];

    beforeEach(module('report'));

    beforeEach(inject(function(_$httpBackend_, _$rootScope_, _requisitionReportService_, openlmisUrlFactory) {
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        requisitionReportService = _requisitionReportService_;

        $httpBackend.when('GET', openlmisUrlFactory('/api/reports/templates/requisitions'))
            .respond(200, reports);
        $httpBackend.when('GET', openlmisUrlFactory('/api/reports/templates/requisitions/id-one'))
            .respond(200, reports[0]);
    }));

    it('getAll should return all reports', function() {
        var result;

        requisitionReportService.getAll()
        .then(function(reports) {
            result = reports;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result.length).toEqual(2);
        expect(result[0].id).toEqual('id-one');
        expect(result[0].name).toEqual('Report 1');
        expect(result[1].id).toEqual('id-two');
        expect(result[1].name).toEqual('Report 2');
    });

    it('get should return specified report', function() {
        var result;

        requisitionReportService.get('id-one')
        .then(function(report) {
            result = report;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result.id).toEqual('id-one');
        expect(result.templateParameters.length).toEqual(2);
        expect(result.templateParameters[0].name).toEqual('param1');
        expect(result.templateParameters[0].displayName).toEqual('Param 1');
        expect(result.templateParameters[0].selectValues.length).toEqual(2);
        expect(result.templateParameters[0].selectValues[0]).toEqual('Option 1');
        expect(result.templateParameters[0].selectValues[1]).toEqual('Option 2');
        expect(result.templateParameters[1].name).toEqual('param2');
        expect(result.templateParameters[1].displayName).toEqual('Param 2');
        expect(result.templateParameters[1].selectValues.length).toEqual(2);
        expect(result.templateParameters[1].selectValues[0]).toEqual('Value 1');
        expect(result.templateParameters[1].selectValues[1]).toEqual('Value 2');
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});
