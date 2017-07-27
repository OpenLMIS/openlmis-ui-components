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
     * @ngdoc directive
     * @restrict E
     * @name openlmis-upload.directive:openlmisFileUpload
     *
     * @description
     * Wraps file input with buttons to select/clear file.
     *
     * @example
     * ```
     * <input id="file" type="file" ng-model="vm.file" accept=".csv">
     * ```
     */
    angular
        .module('openlmis-file-upload')
        .directive('input', directive);

    directive.$inject = ['$templateRequest', '$compile'];

    function directive($templateRequest, $compile) {

        var directive = {
            require: '?ngModel',
            link: link,
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, ngModelController) {
            if (element.attr('type') != 'file') {
                return;
            }

            var fileExtension = element.attr('accept');

            scope.select = select;
            scope.clear = clear;
            scope.getFileName = getFileName;

            $templateRequest('openlmis-file-upload/file-upload.html').then(function(html) {
                var template = $compile(html)(scope);
                element.before(template);
            });

            element.parent().addClass('openlmis-file-upload');
            element.parent().addClass('empty');

            element.on('change', function(event) {
                scope.$apply(function() {
                    var file = event.target.files[0];

                    if (file) {
                        element.parent().removeClass('empty');

                        ngModelController.$setViewValue(file);

                        ngModelController.$setValidity('openlmisFileUpload.wrongFileExtension', true);
                        if (fileExtension && !file.name.endsWith(fileExtension)) {
                            ngModelController.$setValidity('openlmisFileUpload.wrongFileExtension', false);
                        }
                    }
                });
            });

            function select() {
                element.trigger('click');
            }

            function clear() {
                ngModelController.$setViewValue(undefined);
                ngModelController.$setValidity('openlmisFileUpload.wrongFileExtension', true);
                scope.filename = undefined;
                element.val(undefined);
                element.parent().addClass('empty');
            }

            function getFileName() {
                return ngModelController.$viewValue ? ngModelController.$viewValue.name : undefined;
            }
        }
    }

})();
