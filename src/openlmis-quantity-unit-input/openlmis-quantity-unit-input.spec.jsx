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

import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import QuantityUnitInput from './openlmis-quantity-unit-input';

describe('QuantityUnitInput', function() {

    var container, item, recalculated, onChangeQuantity, messageService, quantityUnitCalculateService;

    var WILL_BE_ORDERED_AS = 'openlmisInputDosesPacks.willBeOrderedAsPacks';

    beforeEach(function() {
        item = {
            orderedQuantity: 25,
            quantityInPacks: 2,
            quantityRemainderInDoses: 5,
            orderable: {
                id: 'orderable-id',
                netContent: 10,
                packRoundingThreshold: 5,
                roundToZero: false
            }
        };

        recalculated = {
            orderedQuantity: 42,
            quantityInPacks: 4,
            quantityRemainderInDoses: 2
        };

        onChangeQuantity = jasmine.createSpy('onChangeQuantity');

        messageService = jasmine.createSpyObj('messageService', ['get']);
        messageService.get.andCallFake(function(key, params) {
            return params ? key + '(' + params.packs + ',' + params.doses + ')' : key;
        });

        quantityUnitCalculateService = jasmine.createSpyObj('quantityUnitCalculateService', [
            'recalculateInputQuantity',
            'packsToOrder'
        ]);
        quantityUnitCalculateService.recalculateInputQuantity.andReturn(recalculated);
        quantityUnitCalculateService.packsToOrder.andReturn(3);

        /*
         * The component pulls its services through react-components' getService, which reads the
         * injector off document.body. Hanging one there is all it needs - bootstrapping angular
         * over the karma page would compile DOM that other specs share.
         */
        angular.element(document.body).data('$injector', angular.injector([
            'ng',
            function($provide) {
                $provide.value('messageService', messageService);
                $provide.value('quantityUnitCalculateService', quantityUnitCalculateService);
            }
        ]));

        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(function() {
        act(function() {
            ReactDOM.unmountComponentAtNode(container);
        });

        document.body.removeChild(container);
        angular.element(document.body).removeData('$injector');
    });

    describe('showing quantities in doses', function() {

        it('should render a single input holding the ordered quantity', function() {
            render({
                showInDoses: true
            });

            expect(inputs().length).toBe(1);
            expect(inputs()[0].value).toBe('25');
        });

        it('should hint that the input is in doses', function() {
            render({
                showInDoses: true
            });

            expect(inputs()[0].getAttribute('placeholder')).toBe('openlmisInputDosesPacks.DosesHint');
        });
    });

    describe('showing quantities in packs', function() {

        it('should render the pack quantity and the remainder in doses', function() {
            render();

            expect(inputs().length).toBe(2);
            expect(packsInput().value).toBe('2');
            expect(remainderInput().value).toBe('5');
        });

        it('should hint that the first input is in packs', function() {
            render();

            expect(packsInput().getAttribute('placeholder')).toBe('openlmisInputDosesPacks.Packs');
        });

        it('should disable the remainder when a pack holds a single dose', function() {
            item.orderable.netContent = 1;

            render();

            expect(remainderInput().disabled).toBe(true);
            expect(packsInput().disabled).toBe(false);
        });

        it('should disable both inputs when the consumer disables them', function() {
            render({
                disabled: true
            });

            expect(packsInput().disabled).toBe(true);
            expect(remainderInput().disabled).toBe(true);
        });
    });

    describe('while the user is typing', function() {

        it('should keep the typed value without emitting a change', function() {
            render();

            setValue(packsInput(), '4');

            expect(packsInput().value).toBe('4');
            expect(onChangeQuantity).not.toHaveBeenCalled();
            expect(quantityUnitCalculateService.recalculateInputQuantity).not.toHaveBeenCalled();
        });
    });

    describe('on blur', function() {

        it('should recalculate the item with the values held in the inputs', function() {
            var args;

            runs(function() {
                render({
                    showInDoses: true
                });

                setValue(inputs()[0], '42');
                blur(inputs()[0]);
            });

            waitsFor(function() {
                return onChangeQuantity.callCount > 0;
            }, 'onChangeQuantity to be called', 500);

            runs(function() {
                args = quantityUnitCalculateService.recalculateInputQuantity.mostRecentCall.args;

                expect(args[0].orderedQuantity).toBe('42');
                expect(args[0].orderable).toBe(item.orderable);
                expect(args[1]).toBe(10);
                expect(args[2]).toBe(true);
                expect(args[3]).toBe('orderedQuantity');

                expect(onChangeQuantity).toHaveBeenCalledWith(recalculated);
            });
        });

        it('should combine both inputs when showing quantities in packs', function() {
            var args;

            runs(function() {
                render();

                setValue(packsInput(), '4');
                setValue(remainderInput(), '7');
                blur(remainderInput());
            });

            waitsFor(function() {
                return onChangeQuantity.callCount > 0;
            }, 'onChangeQuantity to be called', 500);

            runs(function() {
                args = quantityUnitCalculateService.recalculateInputQuantity.mostRecentCall.args;

                expect(args[0].quantityInPacks).toBe('4');
                expect(args[0].quantityRemainderInDoses).toBe('7');
                expect(args[2]).toBe(false);
            });
        });

        it('should treat a pack as holding one dose when the orderable has no net content', function() {
            var args;

            item.orderable = {
                id: 'orderable-id'
            };

            runs(function() {
                render({
                    showInDoses: true
                });

                blur(inputs()[0]);
            });

            waitsFor(function() {
                return onChangeQuantity.callCount > 0;
            }, 'onChangeQuantity to be called', 500);

            runs(function() {
                args = quantityUnitCalculateService.recalculateInputQuantity.mostRecentCall.args;

                expect(args[1]).toBe(1);
            });
        });
    });

    describe('when the item changes', function() {

        it('should show the quantities the item now holds', function() {
            render();

            render({
                item: extend({}, item, {
                    quantityInPacks: 7,
                    quantityRemainderInDoses: 1
                })
            });

            expect(packsInput().value).toBe('7');
            expect(remainderInput().value).toBe('1');
        });

        it('should leave the inputs empty for an item without quantities', function() {
            render({
                item: {
                    orderable: item.orderable
                }
            });

            expect(packsInput().value).toBe('');
            expect(remainderInput().value).toBe('');
        });

        it('should fall back to a single dose per pack for an item without an orderable', function() {
            render({
                item: {
                    orderedQuantity: 4,
                    quantityInPacks: 4,
                    quantityRemainderInDoses: 0
                },
                showPacksToOrderHint: true
            });

            expect(packsInput().value).toBe('4');
            expect(remainderInput().disabled).toBe(true);
            expect(hint()).toBeNull();
        });

        it('should render empty inputs when there is no item at all', function() {
            render({
                item: undefined
            });

            expect(packsInput().value).toBe('');
            expect(remainderInput().value).toBe('');
            /* Without an orderable there is no net content, so a pack holds a single dose. */
            expect(remainderInput().disabled).toBe(true);
            expect(onChangeQuantity).not.toHaveBeenCalled();
        });
    });

    describe('breaking a total in doses down into packs', function() {

        beforeEach(function() {
            item = {
                orderedQuantity: 25,
                orderable: item.orderable
            };
        });

        it('should emit a breakdown for an item that only has a total', function() {
            render();

            expect(quantityUnitCalculateService.recalculateInputQuantity)
                .toHaveBeenCalledWith(item, 10, true, 'orderedQuantity');
            expect(onChangeQuantity).toHaveBeenCalledWith(recalculated);
        });

        it('should not emit a breakdown while showing quantities in doses', function() {
            render({
                showInDoses: true
            });

            expect(quantityUnitCalculateService.recalculateInputQuantity).not.toHaveBeenCalled();
            expect(onChangeQuantity).not.toHaveBeenCalled();
        });

        it('should not emit a breakdown when the item already has one', function() {
            item.quantityInPacks = 0;

            render();

            expect(quantityUnitCalculateService.recalculateInputQuantity).not.toHaveBeenCalled();
            expect(onChangeQuantity).not.toHaveBeenCalled();
        });

        it('should emit a breakdown when the item holds nulls instead of a breakdown', function() {
            item.quantityInPacks = null;
            item.quantityRemainderInDoses = null;

            render();

            expect(quantityUnitCalculateService.recalculateInputQuantity)
                .toHaveBeenCalledWith(item, 10, true, 'orderedQuantity');
        });

        it('should not emit a breakdown for an item without a total', function() {
            item = {
                orderable: item.orderable
            };

            render();

            expect(quantityUnitCalculateService.recalculateInputQuantity).not.toHaveBeenCalled();
            expect(onChangeQuantity).not.toHaveBeenCalled();
        });
    });

    describe('packs to order hint', function() {

        it('should stay hidden unless the consumer asks for it', function() {
            render();

            expect(hint()).toBeNull();
            expect(quantityUnitCalculateService.packsToOrder).not.toHaveBeenCalled();
        });

        it('should stay hidden when a pack holds a single dose', function() {
            item.orderable.netContent = 1;

            render({
                showPacksToOrderHint: true
            });

            expect(hint()).toBeNull();
        });

        it('should stay hidden when nothing has been entered', function() {
            render({
                item: {
                    orderable: item.orderable
                },
                showPacksToOrderHint: true
            });

            expect(hint()).toBeNull();
        });

        it('should preview the whole packs a total in doses will be ordered as', function() {
            render({
                showInDoses: true,
                showPacksToOrderHint: true
            });

            expect(quantityUnitCalculateService.packsToOrder)
                .toHaveBeenCalledWith(25, 10, 5, false);
            expect(messageService.get).toHaveBeenCalledWith(WILL_BE_ORDERED_AS, {
                packs: 3,
                doses: 30
            });
            expect(hint().textContent).toBe(WILL_BE_ORDERED_AS + '(3,30)');
        });

        it('should add the packs and the remainder up when showing quantities in packs', function() {
            render({
                showPacksToOrderHint: true
            });

            expect(quantityUnitCalculateService.packsToOrder)
                .toHaveBeenCalledWith(25, 10, 5, false);
            expect(hint().textContent).toBe(WILL_BE_ORDERED_AS + '(3,30)');
        });

        it('should count a blank pack quantity as no packs', function() {
            item.quantityInPacks = '';
            item.quantityRemainderInDoses = 4;

            render({
                showPacksToOrderHint: true
            });

            expect(quantityUnitCalculateService.packsToOrder)
                .toHaveBeenCalledWith(4, 10, 5, false);
        });

        it('should count a blank remainder as no doses', function() {
            item.quantityRemainderInDoses = '';

            render({
                showPacksToOrderHint: true
            });

            expect(quantityUnitCalculateService.packsToOrder)
                .toHaveBeenCalledWith(20, 10, 5, false);
        });

        it('should stay hidden when the total is not a positive number', function() {
            item.orderedQuantity = -5;

            render({
                showInDoses: true,
                showPacksToOrderHint: true
            });

            expect(hint()).toBeNull();
            expect(quantityUnitCalculateService.packsToOrder).not.toHaveBeenCalled();
        });

        it('should follow the typed quantity as it changes', function() {
            render({
                showInDoses: true,
                showPacksToOrderHint: true
            });

            setValue(inputs()[0], '80');

            expect(quantityUnitCalculateService.packsToOrder)
                .toHaveBeenCalledWith(80, 10, 5, false);
        });
    });

    function render(props) {
        var allProps = extend({
            showInDoses: false,
            item: item,
            onChangeQuantity: onChangeQuantity,
            /*
             * InputCell is written for react-table cells and destructures these, so every consumer
             * of the component passes them straight through.
             */
            row: {
                index: 0,
                values: {}
            },
            column: {
                id: 'orderedQuantity'
            },
            updateTableData: function() {}
        }, props);

        act(function() {
            ReactDOM.render(<QuantityUnitInput {...allProps} />, container);
        });
    }

    function inputs() {
        return container.querySelectorAll('input');
    }

    function packsInput() {
        return container.querySelector('#quantityInPacks');
    }

    function remainderInput() {
        return container.querySelector('#quantityRemainderInDoses');
    }

    function hint() {
        return container.querySelector('.packs-to-order-hint');
    }

    /*
     * React remembers the value it last wrote to the node, so going through the native setter is
     * what makes it accept the event as a real change.
     */
    function setValue(input, value) {
        var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

        act(function() {
            setter.call(input, value);
            input.dispatchEvent(new Event('input', {
                bubbles: true
            }));
        });
    }

    /* React 17 listens for focusout rather than blur. */
    function blur(input) {
        act(function() {
            input.dispatchEvent(new FocusEvent('focusout', {
                bubbles: true
            }));
        });
    }

    function extend(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    }
});
