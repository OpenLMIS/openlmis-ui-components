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

    angular
        .module('openlmis-modal')
        .service('openlmisModalService', service);

    service.$inject = ['$q', '$modal'];

    function service($q, $modal) {
        var modals = [];

        this.createDialog = createDialog;

        function createDialog(options) {
            var dialog,
                deferred = $q.defer();

            decorateOnBeforeShow(options);
            decorateResolve(options, deferred);
            options.animation = 'am-fade';

            dialog = $modal(options);
            dialog.promise = deferred.promise;
            dialog.$$deferred = deferred;

            decorateShow(dialog);
            decorateHide(dialog);
            decorateToggle(dialog);

            dialog.promise.finally(function() {
                dialog.hide();
                dialog = undefined;
            });

            return dialog;
        }

        function decorateOnBeforeShow(options) {
            options.$$onBeforeShow = options.onBeforeShow;
            options.onBeforeShow = function ($modal) {
        		// Angular 1.5 $onInit and $onDestroy life cycle event support
        		if ($modal.$options.controllerAs) {
        			var modalElementData = $modal.$element.data();
        			var modalScope = modalElementData && modalElementData.$scope;
        			if (modalScope) {
        				var controller = modalScope[$modal.$options.controllerAs];
        				if (controller) {
        					// Manually trigger $onInit callback
        					if (angular.isFunction(controller.$onInit)) {
        						controller.$onInit();
        					}
        					// Manually trigger $onDestroy callback on scope destroy
        					if (angular.isFunction(controller.$onDestroy)) {
        						modalScope.$on('$destroy', controller.$onDestroy);
        					}
        				}
        			}
        		}
                if (options.$$onBeforeShow) {
                    options.$$onBeforeShow($modal);
                }
        	};
        }

        function decorateResolve(options, deferred) {
            if (!options.resolve) {
                options.resolve = {};
            }
            options.resolve.modalDeferred = function() {
                return deferred;
            };
        }

        function decorateShow(dialog) {
            dialog.$$show = dialog.show;
            dialog.show = function() {
                hideTopModal(dialog);
                dialog.$$show();
            };
        }

        function decorateHide(dialog) {
            dialog.$$hide = dialog.hide;
            dialog.hide = function() {
                restorePreviousModal(dialog);
                dialog.$$hide();
                if (dialog.$$deferred) {
                    dialog.$$deferred.reject();
                }
            };
        }

        function decorateToggle(dialog) {
            dialog.$$toggle = dialog.toggle;
            dialog.toggle = function() {
                if (modals.indexOf(dialog)) {
                    restorePreviousModal(dialog);
                } else {
                    hideTopModal(dialog);
                }
                dialog.$$toggle();
            };
        }

        function hideTopModal(dialog) {
            if (modals.length) {
                modals[modals.length - 1].$$hide();
            }
            modals.push(dialog);
        }

        function restorePreviousModal(dialog) {
            var index = modals.indexOf(dialog);
            if (index > -1) {
                modals.splice(index, 1);
            }
            if (modals.length) {
                modals[modals.length - 1].$$show();
            }
        }

    }

})();
