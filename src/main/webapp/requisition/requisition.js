(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name requisition.Requisition
     *
     * @description
     * Responsible for supplying requisition with additional methods.
     */
    angular
        .module('requisition')
        .factory('Requisition', requisitionFactory);

    requisitionFactory.$inject = [
        '$q', '$resource', 'openlmisUrlFactory', 'requisitionUrlFactory', 'RequisitionTemplate',
        'LineItem', 'categoryFactory', 'REQUISITION_STATUS', 'COLUMN_SOURCES',
        'localStorageFactory', 'offlineService'
    ];

    function requisitionFactory($q, $resource, openlmisUrlFactory, requisitionUrlFactory,
                                RequisitionTemplate, LineItem, categoryFactory, REQUISITION_STATUS,
                                COLUMN_SOURCES, localStorageFactory, offlineService) {

        var offlineRequitions = localStorageFactory('requisitions'),
            offlineStockAdjustmentReasons = localStorageFactory('stockAdjustmentReasons'),
            resource = $resource(requisitionUrlFactory('/api/requisitions/:id'), {}, {
            'authorize': {
                url: requisitionUrlFactory('/api/requisitions/:id/authorize'),
                method: 'POST'
            },
            'save': {
                method: 'PUT',
                transformRequest: transformRequisition
            },
            'submit': {
                url: requisitionUrlFactory('/api/requisitions/:id/submit'),
                method: 'POST'
            },
            'approve': {
                url: requisitionUrlFactory('/api/requisitions/:id/approve'),
                method: 'POST'
            },
            'reject': {
                url: requisitionUrlFactory('/api/requisitions/:id/reject'),
                method: 'PUT'
            },
            'skip': {
                url: requisitionUrlFactory('/api/requisitions/:id/skip'),
                method: 'PUT'
            }
        });

        Requisition.prototype.$authorize = authorize;
        Requisition.prototype.$save = save;
        Requisition.prototype.$submit = submit;
        Requisition.prototype.$remove = remove;
        Requisition.prototype.$approve = approve;
        Requisition.prototype.$reject = reject;
        Requisition.prototype.$skip = skip;
        Requisition.prototype.$isInitiated = isInitiated;
        Requisition.prototype.$isSubmitted = isSubmitted;
        Requisition.prototype.$isApproved = isApproved;
        Requisition.prototype.$isAuthorized = isAuthorized;

        return Requisition;

        /**
         * @ngdoc function
         * @name requisition
         * @methodOf requisition.Requisition
         * @param {Resource} requisition resource with requisition
         * @param {Resource} template resource with requisition template
         * @param {Resource} approvedProducts resource with approved products
         * @return {Object} requisition with methods
         *
         * @description
         * Adds all needed methods and information from template to given requisition.
         *
         */
        function Requisition(source, template, approvedProducts, reasons) {
            var programId = source.program.id,
                requisition = this;

            angular.copy(source, this);

            this.$stockAdjustmentReasons = reasons;
            this.$template = new RequisitionTemplate(template, source);

            this.requisitionLineItems = [];
            source.requisitionLineItems.forEach(function(lineItem) {
                requisition.requisitionLineItems.push(new LineItem(lineItem, requisition));
            });

            this.$fullSupplyCategories = categoryFactory.groupFullSupplyLineItems(this.requisitionLineItems, programId);
            this.$nonFullSupplyCategories = categoryFactory.groupNonFullSupplyLineItems(this.requisitionLineItems, programId);
            this.$approvedCategories = categoryFactory.groupProducts(this.requisitionLineItems, approvedProducts);
        }

        /**
         * @ngdoc function
         * @name authorize
         * @methodOf requisition.Requisition
         * @return {Promise} requisition promise
         *
         * @description
         * Authorizes requisition.
         *
         */
        function authorize() {
            var requisition = this;
            return handlePromise(resource.authorize({
                id: this.id
            }, {}).$promise, function(authorized) {
                saveToStorage(authorized, requisition.$availableOffline);
            });
        }

        /**
         * @ngdoc function
         * @name remove
         * @methodOf requisition.Requisition
         * @return {Promise} promise that resolves after requisition is deleted
         *
         * @description
         * Removes requisition.
         *
         */
        function remove() {
            var id = this.id;
            return handlePromise(resource.remove({
                id: this.id
            }).$promise, function() {
                offlineRequitions.removeBy('id', id);
            });
        }

        /**
         * @ngdoc function
         * @name save
         * @methodOf requisition.Requisition
         * @return {Promise} requisition promise
         *
         * @description
         * Saves requisition.
         *
         */
        function save() {
            var availableOffline = this.$availableOffline;
            return handlePromise(resource.save({
                id: this.id
            }, this).$promise, function(saved) {
                saveToStorage(saved, availableOffline);
            });
        }

        /**
         * @ngdoc function
         * @name submit
         * @methodOf requisition.Requisition
         * @return {Promise} requisition promise
         *
         * @description
         * Submits requisition.
         *
         */
        function submit() {
            var availableOffline = this.$availableOffline;
            return handlePromise(resource.submit({
                id: this.id
            }, {}).$promise, function(submitted) {
                saveToStorage(submitted, availableOffline);
            });
        }

        /**
         * @ngdoc function
         * @name approve
         * @methodOf requisition.Requisition
         * @return {Promise} promise that resolves when requisition is approved
         *
         * @description
         * Approves requisition.
         *
         */
        function approve() {
            var availableOffline = this.$availableOffline;
            return handlePromise(resource.approve({
                id: this.id
            }, {}).$promise, function(approved) {
                saveToStorage(approved, availableOffline);
            });
        }

        /**
         * @ngdoc function
         * @name reject
         * @methodOf requisition.Requisition
         * @return {Promise} promise that resolves when requisition is rejected
         *
         * @description
         * Rejects requisition.
         *
         */
        function reject() {
            var availableOffline = this.$availableOffline;
            return handlePromise(resource.reject({
                id: this.id
            }, {}).$promise, function(rejected) {
                saveToStorage(rejected, availableOffline);
            });
        }

        /**
         * @ngdoc function
         * @name skip
         * @methodOf requisition.Requisition
         * @return {Promise} promise that resolves when requisition is skipped
         *
         * @description
         * Skips requisition.
         *
         */
        function skip() {
            return handlePromise(resource.skip({
                id: this.id
            }, {}).$promise, function(requisition) {
                offlineRequitions.removeBy('id', requisition.id);
            });
        }

        /**
         * @ngdoc function
         * @name isInitiated
         * @methodOf requisition.Requisition
         *
         * @description
         * Responsible for checking if requisition is initiated.
         * Returns true only if requisition status equals initiated.
         *
         * @return {boolean} is requisition initiated
         */
        function isInitiated() {
            return this.status === REQUISITION_STATUS.INITIATED;
        }

        /**
         * @ngdoc function
         * @name isSubmitted
         * @methodOf requisition.Requisition
         *
         * @description
         * Responsible for checking if requisition is submitted.
         * Returns true only if requisition status equals submitted.
         *
         * @return {boolean} is requisition submitted
         */
        function isSubmitted() {
            return this.status === REQUISITION_STATUS.SUBMITTED;
        }

        /**
         * @ngdoc function
         * @name isAuthorized
         * @methodOf requisition.Requisition
         *
         * @description
         * Responsible for checking if requisition is authorized.
         * Returns true only if requisition status equals authorized.
         *
         * @return {boolean} is requisition authorized
         */
        function isAuthorized() {
            return this.status === REQUISITION_STATUS.AUTHORIZED;
        }

        /**
         * @ngdoc function
         * @name isApproved
         * @methodOf requisition.Requisition
         *
         * @description
         * Responsible for checking if requisition is approved.
         * Returns true only if requisition status equals approved.
         *
         * @return {boolean} is requisition approved
         */
        function isApproved() {
            return this.status === REQUISITION_STATUS.APPROVED;
        }

        function handlePromise(promise, success, failure) {
            var deferred = $q.defer();

            promise.then(function(response) {
                if (success) success(response);
                deferred.resolve(response);
            }, function() {
                if (failure) failure();
                deferred.reject();
            });

            return deferred.promise;
        }

        function saveToStorage(requisition, shouldSave) {
            if (shouldSave) {
                requisition.$modified = false;
                offlineRequitions.put(requisition);
            }
        }

        function transformRequisition(requisition) {
            var columns = requisition.$template.columns;
            angular.forEach(requisition.requisitionLineItems, function(lineItem) {
                transformLineItem(lineItem, columns);
            });
            requisition.$nonFullSupplyCategories.forEach(function(category) {
                category.lineItems.forEach(function(lineItem) {
                    if (requisition.requisitionLineItems.indexOf(lineItem) === -1) {
                        requisition.requisitionLineItems.push(lineItem);
                    }
                });
            });
            return angular.toJson(requisition);
        }


        function transformLineItem(lineItem, columns) {
            angular.forEach(columns, function(column) {
                if (!column.display || column.source === COLUMN_SOURCES.CALCULATED) {
                    lineItem[column.name] = null;
                }
            });
        }
    }

})();
