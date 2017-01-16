/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name admin-template.RequisitionTemplateAdminController
     *
     * @description
     * Controller for template view page
     */

    angular.module('admin-template').controller('RequisitionTemplateAdminController', RequisitionTemplateAdminController);

    RequisitionTemplateAdminController.$inject = [
        '$state', 'template', 'program', '$q', 'notificationService', 'COLUMN_SOURCES',
        'messageService', 'TEMPLATE_COLUMNS'
    ];

    function RequisitionTemplateAdminController($state, template, program, $q, notificationService,
                                                COLUMN_SOURCES, messageService, TEMPLATE_COLUMNS) {

        var vm = this;

        vm.template = template;
        vm.program = program;

        vm.goToTemplateList = goToTemplateList;
        vm.saveTemplate = saveTemplate;
        vm.dropCallback = dropCallback;
        vm.canChangeSource = canChangeSource;
        vm.sourceDisplayName = sourceDisplayName;
        vm.errorMessage = errorMessage;
        vm.isAverageConsumption = isAverageConsumption;

        /**
         * @ngdoc function
         * @name goToTemplateList
         * @methodOf admin-template.RequisitionTemplateAdminController
         *
         * @description
         * Redirects user to template list view page.
         */
        function goToTemplateList() {
            $state.go('administration.configure.templateList');
        }

        /**
         * @ngdoc function
         * @name saveTemplate
         * @methodOf admin-template.RequisitionTemplateAdminController
         *
         * @description
         * Saves template from scope. After successful action displays
         * success notification on screen and redirects user to template
         * list view page. If saving is unsuccessful error notification is displayed.
         */
        function saveTemplate() {
            vm.template.$save().then(function() {
                notificationService.success('template.save.success');
                goToTemplateList();
            }, function() {
                notificationService.error('template.save.failed');
            });
        }

        /**
         * @ngdoc function
         * @name dropCallback
         * @methodOf admin-template.RequisitionTemplateAdminController
         * @param {Event} event Drop event
         * @param {integer} index Indicates where column was dropped
         * @param {Object} item Dropped column
         *
         * @description
         * Moves column using templateFactory method. If action is unsuccessful
         * it displays notification error on screen.
         */
        function dropCallback(event, index, item) {
            if(!vm.template.$moveColumn(item, index)) {
                notificationService.error('msg.tempalte.column.drop.error');
            }
            return false; // disable default drop functionality
        }

        /**
         * @ngdoc function
         * @name canChangeSource
         * @methodOf admin-template.RequisitionTemplateAdminController
         * @param {Object} columnDefinition Contains info about how column can be manipulated by user
         *
         * @description
         * Indicates if column source can be changed based on canBeChanged property
         * and if there is more then one possible source to choose from.
         */
        function canChangeSource(columnDefinition) {
            return columnDefinition.sources.length > 1;
        }

        /**
         * @ngdoc function
         * @name sourceDisplayName
         * @methodOf admin-template.RequisitionTemplateAdminController
         * @param {String} name Column source name
         * @returns {String} Column source display name
         *
         * @description
         * Gives diplay name of given source type.
         */
        function sourceDisplayName(name) {
            return messageService.get(COLUMN_SOURCES.getLabel(name));
        }

        /**
         * @ngdoc function
         * @name errorMessage
         * @methodOf admin-template.RequisitionTemplateAdminController
         * @param {Object} column Column
         * @returns {String} Column validation error message
         *
         * @description
         * Gives error message with all displayed dependent column names
         * when column validation failed.
         */
        function errorMessage(column) {
            var dependencies = '',
                message;

            if(isAverageConsumption(column)
                && (vm.template.numberOfPeriodsToAverage === '0' || vm.template.numberOfPeriodsToAverage === '1')) {
                return messageService.get('msg.template.invalid.number.of.periods');
            }

            if (isAverageConsumption(column)
                && (!vm.template.numberOfPeriodsToAverage.toString().trim() || !vm.template.numberOfPeriodsToAverage)) {
                return messageService.get('msg.template.empty.number.of.periods');
            }

            if(!column.source  || column.source === '') return messageService.get('msg.template.column.source.empty');

            if(column.columnDefinition.options.length > 0 && (!column.option || column.option === '')) return messageService.get('msg.template.column.option.empty');

            if(column.source === COLUMN_SOURCES.CALCULATED) {
                var circularDependencyArray = vm.template.$findCircularCalculatedDependencies(column.name);
                angular.forEach(circularDependencyArray, function(dependency) {
                    dependencies = dependencies + ' ' + vm.template.columnsMap[dependency].label + ',';
                });
            }

            if(dependencies.length > 0) {
                dependencies = dependencies.substring(0, dependencies.length - 1); // remove last comma
                return messageService.get('msg.template.column.calculated.error') + dependencies;
            }
            message = messageService.get('msg.template.column.should.be.displayed');
            if(!column.isDisplayed && column.source === COLUMN_SOURCES.USER_INPUT && column.columnDefinition.sources.length > 1) {
                message = message + messageService.get('msg.template.column.is.user.input');
            }
            return message;
        }

        /**
         * @ngdoc function
         * @name isAverageConsumption
         * @methodOf admin-template.RequisitionTemplateAdminController
         * @param {Object} column Column
         * @returns {Boolean} True if column name is 'averageConsumption'.
         *
         * @description
         * Determines whether displayed column is an average consumption.
         */
        function isAverageConsumption(column) {
            return column.name === TEMPLATE_COLUMNS.AVERAGE_CONSUMPTION;
        }
    }
})();
