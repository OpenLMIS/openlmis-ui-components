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
     * @name openlmis-requisitions.RequisitionTemplateAdminController
     *
     * @description
     * Controller for template view page
     */

    angular.module('openlmis-requisitions').controller('RequisitionTemplateAdminController', RequisitionTemplateAdminController);

    RequisitionTemplateAdminController.$inject = ['$state', 'template', 'program', '$q', 'Notification', 'Source', 'messageService'];

    function RequisitionTemplateAdminController($state, template, program, $q, Notification, Source, messageService) {
        var vm = this;

        vm.template = template;
        vm.program = program;

        vm.goToTemplateList = goToTemplateList;
        vm.saveTemplate = saveTemplate;
        vm.dropCallback = dropCallback;
        vm.canChangeSource = canChangeSource;
        vm.sourceDisplayName = sourceDisplayName;
        vm.errorMessage = errorMessage;

        /**
         * @ngdoc function
         * @name goToTemplateList
         * @methodOf openlmis-requisitions.RequisitionTemplateAdminController
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
         * @methodOf openlmis-requisitions.RequisitionTemplateAdminController
         *
         * @description
         * Saves template from scope. After successful action displays
         * success notification on screen and redirects user to template
         * list view page. If saving is unsuccessful error notification is displayed.
         */
        function saveTemplate() {
            vm.template.$save().then(function() {
                Notification.success('template.save.success');
                goToTemplateList();
            }, function() {
                Notification.error('template.save.failed');
            });
        }

        /**
         * @ngdoc function
         * @name dropCallback
         * @methodOf openlmis-requisitions.RequisitionTemplateAdminController
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
                Notification.error('msg.tempalte.column.drop.error');
            }
            return false; // disable default drop functionality
        }

        /**
         * @ngdoc function
         * @name canChangeSource
         * @methodOf openlmis-requisitions.RequisitionTemplateAdminController
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
         * @methodOf openlmis-requisitions.RequisitionTemplateAdminController
         * @param {String} name Column source name
         * @returns {String} Column source display name
         *
         * @description
         * Gives diplay name of given source type.
         */
        function sourceDisplayName(name) {
            return messageService.get(Source.getLabel(name));
        }

        /**
         * @ngdoc function
         * @name errorMessage
         * @methodOf openlmis-requisitions.RequisitionTemplateAdminController
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

            if(column.source === undefined || column.source === null  || column.source === '') return messageService.get('msg.template.column.source.empty');

            if(column.name == 'numberOfNewPatientsAdded' && (column.option === undefined || column.option === null  || column.option === '')) return messageService.get('msg.template.column.option.empty');

            if(column.source === Source.CALCULATED) {
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
            if(!column.isDisplayed && column.source === Source.USER_INPUT && column.columnDefinition.sources.length > 1) {
                message = message + messageService.get('msg.template.column.is.user.input');
            }
            return message;
        }
    }
})();
