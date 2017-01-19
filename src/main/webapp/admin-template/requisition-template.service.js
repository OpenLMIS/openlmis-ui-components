(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name admin-template.requisitionTemplateService
     *
     * @description
     * Allows user to perform operations on requisition template resource.
     *
     */
    angular.module('admin-template').service('requisitionTemplateService', requisitionTemplateService);

    requisitionTemplateService.$inject = ['requisitionUrlFactory', '$resource'];

    function requisitionTemplateService(requisitionUrlFactory, $resource) {

        var resource = $resource(requisitionUrlFactory('/api/requisitionTemplates/:id'), {}, {
            'getAll': {
                url: requisitionUrlFactory('/api/requisitionTemplates'),
                method: 'GET',
                isArray: true
            },
            'search': {
                url: requisitionUrlFactory('/api/requisitionTemplates/search'),
                method: 'GET'
            },
            'save': {
                method: 'PUT'
            }
        });

        this.get = get;
        this.getAll = getAll;
        this.search = search;
        this.save = save;

        /**
         * @ngdoc function
         * @name  get
         * @methodOf admin-template.requisitionTemplateService
         * @param {String} id Requisition template UUID
         * @returns {Promise} Requisition template info
         *
         * @description
         * Gets requisition template by id.
         */
        function get(id) {
            return resource.get({id: id}).$promise;
        }

        /**
         * @ngdoc function
         * @name  getAll
         * @methodOf admin-template.requisitionTemplateService
         * @returns {Promise} Array of all requisition templates
         *
         * @description
         * Gets all requisition templates.
         */
        function getAll() {
            return resource.getAll().$promise;
        }

        /**
         * @ngdoc function
         * @name  search
         * @methodOf admin-template.requisitionTemplateService
         * @param {String} programId Program UUID
         * @return {Promise} Requisition template for given program
         *
         * @description
         * Gets requisition template for given program.
         */
        function search(programId) {
            return resource.search({program: programId}).$promise;
        }

        /**
         * @ngdoc function
         * @name  save
         * @methodOf admin-template.requisitionTemplateService
         * @return {Promise} Saved requisition template
         *
         * @description
         * Saves changes to requisition template.
         */
        function save(template) {
            return resource.save({id: template.id}, template).$promise;
        }
    }

})();
