(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis.requisitions.RequisitionService
     *
     * @description
     * Responsible for retriving all information from server.
     */
    angular
        .module('openlmis.requisitions')
        .service('RequisitionService', requisitionService);

    requisitionService.$inject = ['$q', '$resource', 'messageService', 'OpenlmisURL',
                                  'RequisitionURL', 'RequisitionFactory', 'Confirm',
                                  'Notification', 'DateUtils', 'localStorageFactory', '$filter'];

    function requisitionService($q, $resource, messageService, OpenlmisURL, RequisitionURL,
                                RequisitionFactory, Confirm, Notification, DateUtils, localStorageFactory, $filter) {

        var resource = $resource(RequisitionURL('/api/requisitions/:id'), {}, {
            'initiate': {
                url: RequisitionURL('/api/requisitions/initiate'),
                method: 'POST'
            },
            'search': {
                url: RequisitionURL('/api/requisitions/search'),
                method: 'GET',
                isArray: true,
                transformResponse: transformRequisitionListResponse
            },
            'forApproval': {
                url: RequisitionURL('/api/requisitions/requisitionsForApproval'),
                method: 'GET',
                isArray: true,
                transformResponse: transformRequisitionListResponse
            },
            'getTemplate': {
                url: RequisitionURL('/api/requisitionTemplates/:id'),
                method: 'GET'
            },
            'forConvert': {
                url: RequisitionURL('/api/requisitions/requisitionsForConvert'),
                method: 'GET',
                isArray: true,
                transformResponse: transformResponseForConvert
            },
            'convertToOrder': {
                url: RequisitionURL('/api/requisitions/convertToOrder'),
                method: 'POST',
                transformRequest: transformRequest
            },
            'getApprovedProducts': {
                url: OpenlmisURL('/api/facilities/:id/approvedProducts'),
                method: 'GET',
                isArray: true
            }
        });

        var service = {
            get: get,
            initiate: initiate,
            search: search,
            forApproval: forApproval,
            forConvert: forConvert,
            convertToOrder: convertToOrder
        },
        requisitionsOffline = localStorageFactory('requisitions');

        return service;

        /**
         * @ngdoc function
         * @name get
         * @methodOf openlmis.requisitions.RequisitionService
         * @param {String} id Requisition UUID
         * @return {Promise} requisition promise
         *
         * @description
         * Retrieves requisition by id.
         *
         */
        function get(id) {
            var deferred = $q.defer();

            resource.get({
                id: id
            }).$promise.then(function(requisition) {
                $q.all([
                    resource.getTemplate({
                        id: requisition.template
                    }).$promise,
                    resource.getApprovedProducts({
                        id: requisition.facility.id,
                        fullSupply: false,
                        programId: requisition.program.id
                    }).$promise
                ]).then(function(responses) {
                    resolve(requisition, responses[0], responses[1]);
                }, function() {
                    resolve(requisition);
                });
            }, error);

            return deferred.promise;

            function resolve(requisition, template, approvedProducts) {
                deferred.resolve(RequisitionFactory(requisition, template, approvedProducts));
            }

            function error() {
                deferred.reject();
            }
        }

        /**
         * @ngdoc function
         * @name initiate
         * @methodOf openlmis.requisitions.RequisitionService
         * @param {String} facility Facility UUID
         * @param {String} program Program UUID
         * @param {String} suggestedPeriod Period UUID
         * @param {boolean} emergency Indicates if requisition is emergency or not
         * @return {Promise} requisition promise
         *
         * @description
         * Initates new requisition for program in facility with given period.
         *
         */
        function initiate(facility, program, suggestedPeriod, emergency) {
            return resource.initiate({
                facility: facility,
                program: program,
                suggestedPeriod: suggestedPeriod,
                emergency: emergency
            }, {}).$promise;
        }

        /**
         * @ngdoc function
         * @name search
         * @methodOf openlmis.requisitions.RequisitionService
         * @param {boolean} offline Indicates if searching in offline requisitions
         * @param {Object} searchParams Contains parameters for searching requisitions, i.e.
         * {
         *      program: 'programID',
         *      facility: 'facilityID',
         *      createdDateFrom: 'startDate',
         *      createdDateTo: 'endDate',
         *      requisitionStatus: ['status1', 'status2'],
         *      emergency: false
         * }
         *
         * @return {Array} Array of requisitions for given criteria (optional)
         *
         * @description
         * Search requisitons by criteria from parameters.
         *
         */
        function search(offline, searchParams) {
            var deferred = $q.defer();

            if(offline) {
                var allRequisitions = requisitionsOffline.getAll(),
                    filteredRequisitions = $filter('requisitionFilter')(allRequisitions, searchParams);

                deferred.resolve(filteredRequisitions);
            } else {
                resource.search(searchParams).$promise.then(function(requisitions) {
                    deferred.resolve(requisitions);
                }, function() {
                    deferred.reject();
                });
            }

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name forApproval
         * @methodOf openlmis.requisitions.RequisitionService
         * @return {Array} Array of requisitions for approval
         *
         * @description
         * Retrieves all requisitions with authorized status for approve.
         *
         */
        function forApproval() {
            return resource.forApproval().$promise;
        }

        /**
         * @ngdoc function
         * @name forConvert
         * @methodOf openlmis.requisitions.RequisitionService
         * @param {Object} params Request params, contains i.e.: filertBy, filterValue, sortBy, descending
         * @return {Array} Array of requisitions for convert
         *
         * @description
         * Search requisitons for convert to order by given criteria.
         *
         */
        function forConvert(params) {
            return resource.forConvert(params).$promise;
        }

        /**
         * @ngdoc function
         * @name convertToOrder
         * @methodOf openlmis.requisitions.RequisitionService
         * @param {Array} requisitions Array of requisitions to convert
         *
         * @description
         * Converts given requisitions into orders.
         *
         */
        function convertToOrder(requisitions) {
            var deferred = $q.defer();

            Confirm('msg.question.confirmation').then(function() {
                resource.convertToOrder(requisitions).$promise.then(function() {
                    deferred.resolve();
                    Notification.success('msg.rnr.converted.to.order');
                }, function() {
                    deferred.reject();
                    Notification.error('msg.error.occurred');
                });
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        }

        function transformRequest(requisitionsWithDepots) {
            var body = [];
            angular.forEach(requisitionsWithDepots, function(requisitionWithDepots) {
                body.push({
                    requisitionId: requisitionWithDepots.requisition.id,
                    supplyingDepotId: requisitionWithDepots.requisition.supplyingFacility
                });
            });
            return angular.toJson(body);
        }

        function transformRequisitionListResponse(data, headers, status) {
            return transformResponse(data, status, function(requisitions) {
                angular.forEach(requisitions, transformRequisition);
                return requisitions;
            });
        }

        function transformResponseForConvert(data, headers, status) {
            return transformResponse(data, status, function(items) {
                angular.forEach(items, function(item) {
                    transformRequisition(item.requisition);
                });
                return items;
            });
        }

        function transformResponse(data, status, transformer) {
            if (status === 200) {
                return transformer(angular.fromJson(data));
            }
            return data;
        }

        function transformRequisition(requisition) {
            requisition.createdDate = DateUtils.toDate(requisition.createdDate);
            requisition.processingPeriod.startDate = DateUtils.toDate(requisition.processingPeriod.startDate);
            requisition.processingPeriod.endDate = DateUtils.toDate(requisition.processingPeriod.endDate);
            requisition.processingPeriod.processingSchedule.modifiedDate = DateUtils.toDate(requisition.processingPeriod.processingSchedule.modifiedDate);
        }
    }

})();
