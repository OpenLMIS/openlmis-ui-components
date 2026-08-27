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

describe('gs1ScanCaptureService', function() {

    var PAYLOAD = ']d20105890123456786',
        GS = '\u001d';

    beforeEach(function() {
        var gs1ScanCaptureService, $window, captureConfig, $timeout;

        module('openlmis-gs1');

        inject(function($injector) {
            gs1ScanCaptureService = $injector.get('gs1ScanCaptureService');
            $window = $injector.get('$window');
            captureConfig = $injector.get('GS1_CAPTURE_CONFIG');
            $timeout = $injector.get('$timeout');
        });

        this.service = gs1ScanCaptureService;
        this.config = captureConfig;
        this.$timeout = $timeout;
        this.onPayload = jasmine.createSpy('onPayload');

        this.now = 1000;
        this.wallOffset = 0;
        spyOn($window.Date, 'now').andCallFake(function() {
            return this.now + this.wallOffset;
        }.bind(this));

        this.input = document.createElement('input');
        document.body.appendChild(this.input);

        this.stamp = function(event) {
            Object.defineProperty(event, 'timeStamp', {
                value: this.now
            });

            return event;
        };

        /**
         * Dispatches one keydown, advancing the clock first so callers control whether the keystroke
         * belongs to the same burst as the previous one.
         */
        this.press = function(key, gapMs, target) {
            var event;

            this.now = this.now + gapMs;
            event = this.stamp(new KeyboardEvent('keydown', {
                key: key,
                bubbles: true,
                cancelable: true
            }));
            (target || document.body).dispatchEvent(event);

            return event;
        };

        /**
         * Stands in for the browser: a printable keystroke that was not prevented lands in the focused
         * field. Synthetic events insert no text of their own, so the specs have to do it, which is
         * also what makes it visible when a keystroke goes missing.
         */
        this.typeInto = function(text, gapMs) {
            var i, event;

            for (i = 0; i < text.length; i++) {
                event = this.press(text.charAt(i), gapMs, this.input);
                if (!event.defaultPrevented) {
                    this.input.value = this.input.value + text.charAt(i);
                }
            }
        };

        this.pressAll = function(text, gapMs, target) {
            var events = [],
                i;

            for (i = 0; i < text.length; i++) {
                events.push(this.press(text.charAt(i), gapMs, target));
            }

            return events;
        };

        this.release = function(key, gapMs, target) {
            var event;

            this.now = this.now + gapMs;
            event = this.stamp(new KeyboardEvent('keyup', {
                key: key,
                bubbles: true,
                cancelable: true
            }));
            (target || document.body).dispatchEvent(event);

            return event;
        };

        /**
         * Stands in for the widgets that handle Enter themselves - select2 on every select, and the
         * table filters on the document - none of which check whether the key was already handled.
         */
        this.observed = [];
        this.observer = function(event) {
            this.observed.push(event.type + ':' + event.key);
        }.bind(this);
        document.addEventListener('keydown', this.observer);
        document.addEventListener('keyup', this.observer);
    });

    afterEach(function() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        document.removeEventListener('keydown', this.observer);
        document.removeEventListener('keyup', this.observer);
        document.body.removeChild(this.input);
    });

    it('should report a fast burst terminated by Enter as a scan', function() {
        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll(PAYLOAD, 5);
        this.press('Enter', 5);

        expect(this.onPayload).toHaveBeenCalledWith(PAYLOAD);
    });

    it('should accept Tab as a terminator', function() {
        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll(PAYLOAD, 5);
        this.press('Tab', 5);

        expect(this.onPayload).toHaveBeenCalledWith(PAYLOAD);
    });

    it('should ignore keystrokes slower than the burst threshold', function() {
        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll(PAYLOAD, this.config.burstThreshold + 10);
        this.press('Enter', 5);

        expect(this.onPayload).not.toHaveBeenCalled();
    });

    it('should ignore a fast burst shorter than the minimum payload length', function() {
        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll('123', 5);
        this.press('Enter', 5);

        expect(this.onPayload).not.toHaveBeenCalled();
    });

    it('should suppress the terminator of a confirmed scan', function() {
        var terminator;

        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll(PAYLOAD, 5);
        terminator = this.press('Enter', 5);

        expect(terminator.defaultPrevented).toBe(true);
    });

    it('should keep the terminator of a confirmed scan from every other listener', function() {
        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll(PAYLOAD, 5);
        this.press('Enter', 5);
        this.release('Enter', 5);

        expect(this.observed.indexOf('keydown:Enter')).toEqual(-1);
        expect(this.observed.indexOf('keyup:Enter')).toEqual(-1);
    });

    it('should block a second terminator sent as part of the same suffix', function() {
        var lineFeed;

        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll(PAYLOAD, 5);
        this.press('Enter', 5);
        lineFeed = this.press('Enter', 5);

        expect(lineFeed.defaultPrevented).toBe(true);
        expect(this.observed.indexOf('keydown:Enter')).toEqual(-1);
        expect(this.onPayload.callCount).toEqual(1);
    });

    it('should block the suffix of a scan that took a while to apply', function() {
        var lineFeed;

        // The stock screens rebuild the line items and reload the state on a scan
        this.onPayload.andCallFake(function() {
            this.wallOffset = this.wallOffset + 20 * this.config.suffixWindow;
        }.bind(this));
        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll(PAYLOAD, 5);
        this.press('Enter', 5);
        lineFeed = this.press('Enter', 5);

        expect(lineFeed.defaultPrevented).toBe(true);
        expect(this.observed.indexOf('keydown:Enter')).toEqual(-1);
    });

    it('should let a terminator through once the suffix window has passed', function() {
        var terminator;

        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll(PAYLOAD, 5);
        this.press('Enter', 5);
        this.observed = [];
        terminator = this.press('Enter', this.config.suffixWindow + 10);

        expect(terminator.defaultPrevented).toBe(false);
        expect(this.observed).toEqual(['keydown:Enter']);
    });

    it('should read a scan that starts inside the suffix window of the one before', function() {
        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll(PAYLOAD, 5);
        this.press('Enter', 5);
        this.pressAll(PAYLOAD, 5);
        this.press('Enter', 5);

        expect(this.onPayload.callCount).toEqual(2);
        expect(this.onPayload.mostRecentCall.args[0]).toEqual(PAYLOAD);
    });

    it('should keep the characters of a recognised burst from every other listener', function() {
        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll(PAYLOAD, 5);

        expect(this.observed.length).toEqual(this.config.suppressAfter - 1);
    });

    it('should leave the keys of ordinary typing to the page', function() {
        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.press('1', this.config.burstThreshold + 10);
        this.release('1', 5);
        this.press('Enter', this.config.burstThreshold + 10);

        expect(this.observed).toEqual(['keydown:1', 'keyup:1', 'keydown:Enter']);
    });

    it('should leave the terminator of ordinary typing alone', function() {
        var terminator;

        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll('12', this.config.burstThreshold + 10);
        terminator = this.press('Enter', this.config.burstThreshold + 10);

        expect(terminator.defaultPrevented).toBe(false);
    });

    it('should suppress burst characters once the burst is recognised', function() {
        var events;

        this.unsubscribe = this.service.subscribe(this.onPayload);

        events = this.pressAll(PAYLOAD, 5);

        expect(events[this.config.suppressAfter - 1].defaultPrevented).toBe(true);
        expect(events[events.length - 1].defaultPrevented).toBe(true);
    });

    it('should not suppress the characters typed at a human pace', function() {
        var events;

        this.unsubscribe = this.service.subscribe(this.onPayload);

        events = this.pressAll(PAYLOAD, this.config.burstThreshold + 10);

        expect(events.every(function(event) {
            return !event.defaultPrevented;
        })).toBe(true);
    });

    it('should restore a focused input to its value from before the scan', function() {
        this.input.value = 'ABC';
        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll(PAYLOAD, 5, this.input);
        this.input.value = 'ABC]d';
        this.press('Enter', 5, this.input);

        expect(this.input.value).toEqual('ABC');
    });

    it('should notify ng-model of the restore by dispatching an input event', function() {
        var inputEvents = 0;

        this.input.value = '';
        this.input.addEventListener('input', function() {
            inputEvents = inputEvents + 1;
        });
        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll(PAYLOAD, 5, this.input);
        this.input.value = ']d';
        this.press('Enter', 5, this.input);

        expect(inputEvents).toEqual(1);
    });

    it('should treat ctrl and the bracket key as the group separator', function() {
        var event;

        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll(']d201' + '05890123456786' + '10ABC', 5);
        this.now = this.now + 5;
        event = this.stamp(new KeyboardEvent('keydown', {
            key: ']',
            code: 'BracketRight',
            ctrlKey: true,
            bubbles: true,
            cancelable: true
        }));
        document.body.dispatchEvent(event);
        this.pressAll('21S1', 5);
        this.press('Enter', 5);

        expect(this.onPayload)
            .toHaveBeenCalledWith(']d20105890123456786' + '10ABC' + GS + '21S1');
    });

    it('should suppress the separator keystroke so the browser does not act on it', function() {
        var event;

        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll(']d20105890123456786' + '10ABC', 5);
        this.now = this.now + 5;
        event = this.stamp(new KeyboardEvent('keydown', {
            key: ']',
            code: 'BracketRight',
            ctrlKey: true,
            bubbles: true,
            cancelable: true
        }));
        document.body.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
    });

    it('should ignore modified keystrokes', function() {
        var event;

        this.unsubscribe = this.service.subscribe(this.onPayload);

        event = this.stamp(new KeyboardEvent('keydown', {
            key: 'a',
            ctrlKey: true,
            bubbles: true,
            cancelable: true
        }));
        document.body.dispatchEvent(event);
        this.pressAll(PAYLOAD, 5);
        this.press('Enter', 5);

        expect(this.onPayload).toHaveBeenCalledWith(PAYLOAD);
    });

    it('should discard characters preceding a pause and keep only the latest burst', function() {
        this.input.value = 'PRE';
        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.typeInto('99999', 5);
        this.press(PAYLOAD.charAt(0), this.config.burstThreshold + 10, this.input);
        this.typeInto(PAYLOAD.substring(1), 5);
        this.press('Enter', 5, this.input);

        expect(this.onPayload).toHaveBeenCalledWith(PAYLOAD);
        expect(this.input.value).toEqual('PRE');
    });

    it('should write a fast burst too short to be a scan back into the field', function() {
        var terminator;

        this.input.value = 'PRE';
        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.typeInto('12345', 5);
        terminator = this.press('Enter', 5, this.input);

        expect(this.onPayload).not.toHaveBeenCalled();
        expect(this.input.value).toEqual('PRE12345');
        expect(terminator.defaultPrevented).toBe(false);
    });

    it('should write typing back when a burst stops without a terminator', function() {
        this.input.value = 'PRE';
        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.typeInto('12345', 5);
        this.$timeout.flush(this.config.idleTimeout);

        expect(this.input.value).toEqual('PRE12345');
        expect(this.onPayload).not.toHaveBeenCalled();
    });

    /**
     * A scanner with no suffix configured, which is the first thing that goes wrong on site.
     */
    it('should clear a scan that never terminated out of the field', function() {
        this.input.value = '120';
        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.typeInto(PAYLOAD, 5);
        this.$timeout.flush(this.config.idleTimeout);

        expect(this.input.value).toEqual('120');
        expect(this.onPayload).not.toHaveBeenCalled();
    });

    it('should not let repeated scans with no terminator build up in the field', function() {
        var i;

        this.input.value = '120';
        this.unsubscribe = this.service.subscribe(this.onPayload);

        for (i = 0; i < 4; i++) {
            this.typeInto(PAYLOAD, 5);
            this.now = this.now + 500;
        }
        this.$timeout.flush(this.config.idleTimeout);

        expect(this.input.value).toEqual('120');
        expect(this.onPayload).not.toHaveBeenCalled();
    });

    it('should ignore a key held down', function() {
        var event;

        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll(PAYLOAD, 5);
        this.now = this.now + 5;
        event = this.stamp(new KeyboardEvent('keydown', {
            key: 'X',
            repeat: true,
            bubbles: true,
            cancelable: true
        }));
        document.body.dispatchEvent(event);
        this.press('Enter', 5);

        expect(this.onPayload).toHaveBeenCalledWith(PAYLOAD);
    });

    it('should treat the group separator control code as the separator', function() {
        var event;

        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll(']d201' + '05890123456786' + '10ABC', 5);
        this.now = this.now + 5;
        event = this.stamp(new KeyboardEvent('keydown', {
            key: 'Unidentified',
            bubbles: true,
            cancelable: true
        }));
        Object.defineProperty(event, 'keyCode', {
            value: this.config.separatorKeyCode
        });
        document.body.dispatchEvent(event);
        this.pressAll('21S1', 5);
        this.press('Enter', 5);

        expect(this.onPayload)
            .toHaveBeenCalledWith(']d20105890123456786' + '10ABC' + GS + '21S1');
    });

    it('should report a scan made with nothing restorable focused', function() {
        var target = document.createElement('div');

        document.body.appendChild(target);
        this.unsubscribe = this.service.subscribe(this.onPayload);

        this.pressAll(PAYLOAD, 5, target);
        this.press('Enter', 5, target);

        expect(this.onPayload).toHaveBeenCalledWith(PAYLOAD);
        document.body.removeChild(target);
    });

    it('should tolerate unsubscribing twice', function() {
        var unsubscribe = this.service.subscribe(this.onPayload);

        unsubscribe();
        unsubscribe();
        this.pressAll(PAYLOAD, 5);
        this.press('Enter', 5);

        expect(this.onPayload).not.toHaveBeenCalled();
    });

    it('should stop listening once unsubscribed', function() {
        var unsubscribe = this.service.subscribe(this.onPayload);

        unsubscribe();
        this.pressAll(PAYLOAD, 5);
        this.press('Enter', 5);

        expect(this.onPayload).not.toHaveBeenCalled();
    });

});
