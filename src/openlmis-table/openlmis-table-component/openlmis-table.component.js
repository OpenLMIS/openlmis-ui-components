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
     * @ngdoc component
     * @name openlmis-table.component:openlmisTable
     *
     * @description
     * Component responsible for displaying a table
     *
     * @param {TableConfig} tableConfig Specifies what columns, actions, header, etc. will the table have
     * @typedef {Object} TableConfig
     * @property {string} caption - Text which will be displayed if data is not present.
     * @prope   rty {boolean} displayCaption - Whether to display the caption or not.
     * @property {ColumnConfig[]} columns - Array of column configurations.
     * @property {ActionsConfig} actions - Configuration for table actions.
     * @property {Object[]} data - Array of data to be displayed in the table.
     * @property {boolean} isSelectable - (optional) Defines should it be possible to set $selected property of
     *  table item. If set to true, the additional column with checkboxes will be rendered. By default false
     * @property {funciton} onSelectElementChange -  (optional) Function that should be triggered when table
     *  item is selected
     * @property {funciton} onSelectAll - (optional) Function that should be triggered when allItems are
     *  selected
     * @property {boolean} initialSelectAll - (optional) Initial value of selectAll param which specifies if
     *  all table items should be selected or not.
     *
     * Configuration for a single column in the table.
     * @typedef {Object} ColumnConfig
     * @property {string} header - Header text for the column.
     * @property {string} propertyPath - Property path to extract data for the column object. It also specifies by which
     *  property the table will be sorted after clicking on header.
     * @property {boolean} sortable - (optional) Decides if it should be possible to sort by this column,
     *  by default true
     * @property {string} headerClasses - (optional) Additional CSS classes which should be applied to the column header
     * @property {string} cellClasses - (optional) Additional CSS classes which should be applied to the table cell
     * @property {funciton} displayColumn - (optional) Function which returns whether the column
     * should be displayed or not. If not passed column will be visible
     * @property {Popover} popover - (optional) If passed attaches the popover after hovering on the column.
     * @property {string|function} [template] - (optional) template to customize the display of data in the column.
     * It can be either string like this:
     * @example
     * 'item.name - item.code'
     * IMPORTANT: for string template we have to always
     * write item.{property}. Anything else will be displayed as string. So for example 'facility.name' won't work!
     *
     * If we decide to use function which is more flexible solution we have to declare it like that:
     * @example
     * template: function(item) {
     *  return item.name + '-' + item.code
     * }
     * NOTE: For any complex templates use function
     * NOTE: If you want to use pipe in a template, for example: '{{item.name | openlmisDate}}',
     *  then you have to declare it using $filter service. Cause the pipe syntax won't work.
     *  Instead do this:
     *   template: function(item) {
     *                   return item.processingPeriod ?
     *                       filter('openlmisDate')(item.processingPeriod.startDate) : '';
     *               }
     *
     * Popover configuration
     * @typedef {Object} Popover
     * @property {string} title - Translation key of the popover title
     * @property {string} template - Path to the html file where the template is located
     *
     * Configuration for table actions.
     * @typedef {Object} ActionsConfig
     * @property {string} header - Header text for the actions column.
     * @property {Action[]} data - Array of action data objects.
     *
     * Data object defining an action for the table.
     * @typedef {Object} Action
     * @property {string} type - Type of action. Possible values:
     * REDIRECT -> action is created with the ui-sref property
     * CLICK -> action is created with the ng-click property
     * DOWNLOAD -> action is created with the openlmis-download property
     * @property {function} redirectLink - Function which will be passed to ui-serf property. Needed only for
     *  'REDIRECT' action
     * @property {string} text - Text to be displayed for the action.
     * @property {function} displayAction - based on some item property decides should the action be displayed.
     *  If not passed action will be displayed
     * @property {string} classes - CSS classes which should be applied to the button
     * @property {function} onClick - Function which will be executed if user clicks the button. Passed only
     * for the 'DOWNLOAD' and 'CLICK' actions
     *
     * @example
     * for action config like this:
     * {
            type: TABLE_CONSTANTS.actionTypes.CLICK,
            displayAction: function(item) {
                return item.status === ORDER_STATUSES.CREATING;
            },
            classes: 'order-edit primary',
            onClick: function(item) {
                vm.redirectToOrderEdit(item.id);
            },
            text: 'orderView.edit'
        }
        we will get the following result:
        <button class='order-edit primary'
            ng-if='$ctrl.actionConfig.displayAction($ctrl.item)'
            ng-click='$ctrl.actionConfig.onClick($ctrl.item)></button>

     * @example of whole TableConfig param:
        {
                caption: 'orderView.noOrdersFound',
                displayCaption: !vm.orders.length,
                columns: [
                    {
                        header: 'orderView.orderNumber',
                        propertyPath: 'orderCode'
                    },
                    {
                        header: 'orderView.facility',
                        propertyPath: 'facility.code',
                        template: function(item) {
                            return item.facility.code + ' - ' + item.facility.name;
                        }
                    },
                    {
                        header: 'orderView.district',
                        propertyPath: 'facility.geographicZone.name'
                    },
                    {
                        header: 'orderView.program',
                        propertyPath: 'program.name'
                    },
                    {
                        header: 'orderView.period',
                        propertyPath: 'processingPeriod.name'
                    },
                    {
                        header: 'orderView.startDate',
                        propertyPath: 'processingPeriod.startDate',
                        template: function(item) {
                            return item.processingPeriod ?
                                $filter('openlmisDate')(item.processingPeriod.startDate) : '';
                        }
                    },
                    {
                        header: 'orderView.endDate',
                        propertyPath: 'processingPeriod.endDate',
                        template: function(item) {
                            return item.processingPeriod ?
                                $filter('openlmisDate')(item.processingPeriod.endDate) : '';
                        }
                    },
                    {
                        header: 'orderView.status',
                        propertyPath: 'status',
                        template: function(item) {
                            return vm.getOrderStatus(item.status);
                        }
                    },
                    {
                        header: 'orderView.emergency',
                        propertyPath: 'emergency',
                        classes: 'col-emergency',
                        template: function(item) {
                            return '<i ng-class="{\'icon-ok\':' + item.emergency + '}"></i>';
                        }
                    },
                    {
                        header: 'orderView.createdDate',
                        propertyPath: 'createdDate',
                        template: function(item) {
                            return item.createdDate ?
                                $filter('openlmisDate')(item.createdDate) : '';
                        }
                    },
                    {
                        header: 'orderView.lastUpdated',
                        propertyPath: 'lastUpdatedDate',
                        template: function(item) {
                            return item.lastUpdatedDate ?
                                $filter('openlmisDate')(item.lastUpdatedDate) : '';
                        }
                    }
                ],
                actions: {
                    header: 'orderView.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.DOWNLOAD,
                            displayAction: function(item) {
                                return item.status !== ORDER_STATUSES.CREATING;
                            },
                            classes: 'print',
                            onClick: function(item) {
                                vm.getPrintUrl(item);
                            },
                            text: 'orderView.print'
                        },
                        {
                            type: TABLE_CONSTANTS.actionTypes.DOWNLOAD,
                            displayAction: function(item) {
                                return item.status !== ORDER_STATUSES.CREATING;
                            },
                            classes: 'download',
                            onClick: function(item) {
                                vm.getDownloadUrl(item);
                            },
                            text: 'orderView.download'
                        },
                        {
                            type: TABLE_CONSTANTS.actionTypes.CLICK,
                            displayAction: function(item) {
                                return item.status !== ORDER_STATUSES.CREATING &&
                                    vm.canRetryTransfer &&
                                    item.transferFailed();
                            },
                            classes: 'retry',
                            onClick: function(item) {
                                vm.retryTransfer(item);
                            },
                            text: 'orderView.retry'
                        },
                        {
                            type: TABLE_CONSTANTS.actionTypes.CLICK,
                            displayAction: function(item) {
                                return item.status === ORDER_STATUSES.CREATING;
                            },
                            classes: 'order-edit',
                            onClick: function(item) {
                                vm.redirectToOrderEdit(item.id);
                            },
                            text: 'orderView.edit'
                        }
                    ]
                },
                data: vm.orders
            };
    */
    angular
        .module('openlmis-table')
        .component('openlmisTable', {
            templateUrl: 'openlmis-table/openlmis-table-component/openlmis-table.html',
            bindings: {
                tableConfig: '<?'
            },
            controller: 'OpenlmisTableController',
            controllerAs: '$ctrl'
        });
})();
