/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name admin-template.controller:RequisitionTemplateAdminController
     *
     * @description
     * Controller for template view page.
     */
    angular.module('admin-template').controller('RequisitionTemplateAdminController', RequisitionTemplateAdminController);

    RequisitionTemplateAdminController.$inject = [
        '$state', 'template', 'program', '$q', 'notificationService', 'COLUMN_SOURCES',
        'messageService', 'TEMPLATE_COLUMNS', 'MAX_COLUMN_DESCRIPTION_LENGTH', 'ALPHA_NUMERIC_REGEX'
    ];

    function RequisitionTemplateAdminController($state, template, program, $q, notificationService,
                                                COLUMN_SOURCES, messageService, TEMPLATE_COLUMNS, MAX_COLUMN_DESCRIPTION_LENGTH, ALPHA_NUMERIC_REGEX) {

        var vm = this;

        /**
         * @ngdoc property
         * @propertyOf admin-template.controller:RequisitionTemplateAdminController
         * @name maxColumnDescriptionLength
         * @type {Number}
         *
         * @description
         * Holds max column description length.
         */
        vm.maxColumnDescriptionLength = MAX_COLUMN_DESCRIPTION_LENGTH;

        /**
         * @ngdoc property
         * @propertyOf admin-template.controller:RequisitionTemplateAdminController
         * @name template
         * @type {Object}
         *
         * @description
         * Holds template.
         */
        vm.template = template;

        /**
         * @ngdoc property
         * @propertyOf admin-template.controller:RequisitionTemplateAdminController
         * @name program
         * @type {Object}
         *
         * @description
         * Holds program.
         */
        vm.program = program;

        vm.goToTemplateList = goToTemplateList;
        vm.saveTemplate = saveTemplate;
        vm.dropCallback = dropCallback;
        vm.canChangeSource = canChangeSource;
        vm.sourceDisplayName = sourceDisplayName;
        vm.errorMessage = errorMessage;
        vm.isAverageConsumption = isAverageConsumption;

        /**
         * @ngdoc method
         * @methodOf admin-template.controller:RequisitionTemplateAdminController
         * @name goToTemplateList
         *
         * @description
         * Redirects user to template list view page.
         */
        function goToTemplateList() {
            $state.go('administration.configure.templateList');
        }

        /**
         * @ngdoc method
         * @methodOf admin-template.controller:RequisitionTemplateAdminController
         * @name saveTemplate
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
         * @ngdoc method
         * @methodOf admin-template.controller:RequisitionTemplateAdminController
         * @name dropCallback
         *
         * @description
         * Moves column using templateFactory method. If action is unsuccessful
         * it displays notification error on screen.
         *
         * @param {Event}   event Drop event
         * @param {Number}  index Indicates where column was dropped
         * @param {Object}  item  Dropped column
         */
        function dropCallback(event, index, item) {
            if(!vm.template.$moveColumn(item, index)) {
                notificationService.error('msg.template.column.dropError');
            }
            return false; // disable default drop functionality
        }

        /**
         * @ngdoc method
         * @methodOf admin-template.controller:RequisitionTemplateAdminController
         * @name canChangeSource
         *
         * @description
         * Indicates if column source can be changed based on canBeChanged property
         * and if there is more then one possible source to choose from.
         *
         * @param {Object} columnDefinition Contains info about how column can be manipulated by user
         */
        function canChangeSource(columnDefinition) {
            return columnDefinition.sources.length > 1;
        }

        /**
         * @ngdoc method
         * @methodOf admin-template.controller:RequisitionTemplateAdminController
         * @name sourceDisplayName
         *
         * @description
         * Gives display name of given source type.
         *
         * @param  {String} name Column source name
         * @return {String}      Column source display name
         */
        function sourceDisplayName(name) {
            return messageService.get(COLUMN_SOURCES.getLabel(name));
        }

        /**
         * @ngdoc method
         * @methodOf admin-template.controller:RequisitionTemplateAdminController
         * @name errorMessage
         *
         * @description
         * Gives error message with all displayed dependent column names
         * when column validation failed.
         *
         * @param  {Object} column Column
         * @return {String}        Column validation error message
         */
        function errorMessage(column) {
            var dependencies = '',
                message;

            if(!column.label || column.label === '') return messageService.get('error.columnLabelEmpty');

            if(column.label.length < 2) return messageService.get('error.columnLabelToShort');

            if(!ALPHA_NUMERIC_REGEX.test(column.label)) return messageService.get('error.columnLabelNotAllowedCharacters');

            if(column.definition && column.definition.length > MAX_COLUMN_DESCRIPTION_LENGTH) return messageService.get('error.columnDescriptionTooLong');

            if(isAverageConsumption(column) && (vm.template.numberOfPeriodsToAverage === 0 || vm.template.numberOfPeriodsToAverage === 1))
                return messageService.get('msg.template.invalidNumberOfPeriods');

            if (isAverageConsumption(column) && (!vm.template.numberOfPeriodsToAverage || !vm.template.numberOfPeriodsToAverage.toString().trim()))
                return messageService.get('msg.template.emptyNumberOfPeriods');

            if(column.name ===  TEMPLATE_COLUMNS.REQUESTED_QUANTITY && template.columnsMap[TEMPLATE_COLUMNS.REQUESTED_QUANTITY_EXPLANATION].isDisplayed != column.isDisplayed)
                return messageService.get('error.columnDisplayMismatch') + template.columnsMap[TEMPLATE_COLUMNS.REQUESTED_QUANTITY_EXPLANATION].label;
            if(column.name ===  TEMPLATE_COLUMNS.REQUESTED_QUANTITY_EXPLANATION && template.columnsMap[TEMPLATE_COLUMNS.REQUESTED_QUANTITY].isDisplayed != column.isDisplayed)
                return messageService.get('error.columnDisplayMismatch') + template.columnsMap[TEMPLATE_COLUMNS.REQUESTED_QUANTITY].label;

            if(!column.source  || column.source === '') return messageService.get('msg.template.column.sourceEmpty');

            if(column.columnDefinition.options.length > 0 && (!column.option || column.option === '')) return messageService.get('msg.template.column.optionEmpty');

            if(column.source === COLUMN_SOURCES.CALCULATED) {
                var circularDependencyArray = vm.template.$findCircularCalculatedDependencies(column.name);
                angular.forEach(circularDependencyArray, function(dependency) {
                    dependencies = dependencies + ' ' + vm.template.columnsMap[dependency].label + ',';
                });
            }

            if(dependencies.length > 0) {
                dependencies = dependencies.substring(0, dependencies.length - 1); // remove last comma
                return messageService.get('msg.template.column.calculatedError') + dependencies;
            }
            message = messageService.get('msg.template.column.shouldBeDisplayed');
            if(!column.isDisplayed && column.source === COLUMN_SOURCES.USER_INPUT && column.columnDefinition.sources.length > 1) {
                message = message + messageService.get('msg.template.column.isUserInput');
            }
            return message;
        }

        /**
         * @ngdoc method
         * @methodOf admin-template.controller:RequisitionTemplateAdminController
         * @name isAverageConsumption
         *
         * @description
         * Determines whether displayed column is an average consumption.
         *
         * @param  {Object}  column Column
         * @return {Boolean}        True if column name is averageConsumption.
         */
        function isAverageConsumption(column) {
            return column.name === TEMPLATE_COLUMNS.AVERAGE_CONSUMPTION;
        }
    }
})();
