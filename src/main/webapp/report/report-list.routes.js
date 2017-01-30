(function() {

    'use strict';

    angular
        .module('report')
        .config(config);

    config.$inject = ['$stateProvider', 'REPORT_RIGHTS'];

    function config($stateProvider, REPORT_RIGHTS) {

        $stateProvider.state('reports.list', {
            controller: 'ReportListController',
            controllerAs: 'vm',
            label: 'link.viewReports',
            showInNavigation: true,
            templateUrl: 'report/report-list.html',
            url: '/list',
            accessRights: [
                REPORT_RIGHTS.REPORTS_VIEW
            ],
            resolve: {
                reports: function (requisitionReportService) {
                    return requisitionReportService.getAll();
                }
            }
        });

    }

})();
