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
     * @name openlmis.administration.TemplateController
     *
     * @description
     * Controller for template view page
     */

    angular.module('openlmis.administration').controller('TemplateController', TemplateController);

    TemplateController.$inject = ['$state', 'templateAndProgram', '$q', 'Notification', 'Source', 'messageService'];

    function TemplateController($state, templateAndProgram, $q, Notification, Source, messageService) {
        var vm = this;

        vm.template = templateAndProgram.template;
        vm.program = templateAndProgram.program;

        vm.goToTemplateList = goToTemplateList;
        vm.saveTemplate = saveTemplate;
        vm.dropCallback = dropCallback;
        vm.canChangeSource = canChangeSource;
        vm.sourceDisplayName = sourceDisplayName;
        vm.errorMessage = errorMessage;

        /**
         * @ngdoc function
         * @name goToTemplateList
         * @methodOf openlmis.administration.TemplateController
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
         * @methodOf openlmis.administration.TemplateController
         *
         * @description
         * Saves template from scope. After successful action displays
         * sucess notification on screen and redirects user to template
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
         * @methodOf openlmis.administration.TemplateController
         * @param {Event} event Drop event
         * @param {integer} index Indicates where column was dropped
         * @param {Object} item Dropped dolumn
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
        };

        /**
         * @ngdoc function
         * @name canChangeSource
         * @methodOf openlmis.administration.TemplateController
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
         * @methodOf openlmis.administration.TemplateController
         * @param {String} name Column source name
         * @returns {String} Column source display name
         *
         * @description
         * Gives diplay name of given source type.
         */
        function sourceDisplayName(name) {
            return Source[name].label;
        }

        /**
         * @ngdoc function
         * @name errorMessage
         * @methodOf openlmis.administration.TemplateController
         * @param {Object} column Column
         * @returns {String} Column valdation error message
         *
         * @description
         * Gives error message with all diplayed dependent column names
         * when column validation failed.
         */
        function errorMessage(column) {
            var dependentColumnsDisplayNameList = '';
            angular.forEach(column.$dependentOn, function(columnName) {
                if(vm.template.columnsMap[columnName].isDisplayed) dependentColumnsDisplayNameList = dependentColumnsDisplayNameList + ' ' + vm.template.columnsMap[columnName].label + ',';
            });
            dependentColumnsDisplayNameList = dependentColumnsDisplayNameList.substring(0, dependentColumnsDisplayNameList.length - 1); // remove last comma
            return messageService.get('msg.template.column.should.be.displayed') + dependentColumnsDisplayNameList;
        }
    }
})();
