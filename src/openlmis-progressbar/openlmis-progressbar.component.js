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

(function () {

  'use strict';

  /**
   * @ngdoc service
   * @name openlmis-progressbar.component:openlmisProgressbar
   *
   * @description
   * The OpenLMIS-Progressbar component is focused on providing feedback on the progress of a
   * workflow or action.
   *
   * @param {Number} value current value of progress has been completed.
   * @param {Number} max   (optional) default value is 100. The total value of progress to be completed.
   * @param {String} title (optional) the label of the progress bar.
   *
   * @example
   * ```
   * <openlmis-progressbar
   *     value="currentValue"
   *     max="totalValue"
   *     title="x of y completed">
   * <openlmis-progressbar/>
   * ```
   */
  angular
    .module('openlmis-progressbar')
    .component('openlmisProgressbar', {
      controller: 'ProgressbarController',
      controllerAs: 'vm',
      templateUrl: 'openlmis-progressbar/openlmis-progressbar.html',
      bindings: {
        value: '<',
        max: '<?',
        title: '@?'
      }
    });
})();
