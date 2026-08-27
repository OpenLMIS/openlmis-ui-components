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
     * - `suppressAfter` - the keystroke of a burst on which suppression starts. Timing is unknown on
     *   the first keystroke, so the ones before it reach a focused field and are undone afterwards.
     * - `terminators` - suffix keys a scanner may send.
     * - `idleTimeout` - milliseconds of quiet after which a burst with no terminator is given up on:
     *   its characters are written back if it looked like typing, or cleared from the field if it
     *   looked like a scan. Must be longer than any gap within one transmission.
     * - `separatorKeyCode`, `separatorCtrlCodes`, `separatorCtrlKeys` - how a scanner sends the group
     *   separator, which has no printable key of its own. The Ctrl combination varies by keyboard
     *   layout, hence the lists.
     * - `suffixWindow` - milliseconds after a scan during which further suffix keystrokes are still
     *   the scanner's, not the user's. Covers scanners configured to send both CR and LF. Measured
     *   between keystrokes, like the burst threshold.
     * - `restoreLeakedInput` - undo what a scan leaked into a focused input, on a confirmed scan and
     *   on one given up on. Turning it off keeps this service from writing to fields at all, except
     *   to write typing back, which it always does.
     * - `statusResetDelay` - milliseconds a success or failure indication stays on screen.
     */
    angular
        .module('openlmis-gs1')
        .constant('GS1_CAPTURE_CONFIG', {
            burstThreshold: 40,
            minPayloadLength: 8,
            suppressAfter: 3,
            terminators: ['Enter', 'Tab'],
            suffixWindow: 150,
            idleTimeout: 300,
            separatorKeyCode: 29,
            separatorCtrlCodes: ['BracketRight'],
            separatorCtrlKeys: [']'],
            restoreLeakedInput: true,
            statusResetDelay: 2500
        });

})();
