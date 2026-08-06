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
     * @ngdoc object
     * @name openlmis-gs1.GS1_CAPTURE_CONFIG
     *
     * @description
     * Deployment tunable keystroke capture behaviour.
     *
     * - `burstThreshold` - maximum milliseconds between keystrokes of one burst. This is what
     *   separates a scan from typing.
     * - `minPayloadLength` - shorter bursts count as typing even when fast.
     * - `suppressAfter` - characters seen before suppression starts. Timing is unknown on the first
     *   keystroke, so this many can reach a focused field; the restore below removes them.
     * - `terminators` - suffix keys a scanner may send.
     * - `restoreLeakedInput` - restore a focused input to its pre burst value on a confirmed scan.
     * - `statusResetDelay` - milliseconds a success or failure indication stays on screen.
     */
    angular
        .module('openlmis-gs1')
        .constant('GS1_CAPTURE_CONFIG', {
            burstThreshold: 40,
            minPayloadLength: 8,
            suppressAfter: 3,
            terminators: ['Enter', 'Tab'],
            restoreLeakedInput: true,
            statusResetDelay: 2500
        });

})();
