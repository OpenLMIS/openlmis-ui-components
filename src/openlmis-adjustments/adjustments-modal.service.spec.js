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

describe('adjustmentsModalService', function() {

    var adjustmentsModalService, adjustments, reasons, title, message, isDisabled, summaries,
        preSave, preCancel;

    beforeEach(function() {
        module('openlmis-adjustments');

        inject(function($injector) {
            adjustmentsModalService = $injector.get('adjustmentsModalService');
            openlmisModalService = $injector.get('openlmisModalService');
        });

        spyOn(openlmisModalService, 'createDialog').andCallThrough();

        reasons = [{
            name: 'Reason One'
        }, {
            name: 'Reason Two'
        }, {
            name: 'Reason Three'
        }];

        adjustments = [{
            reason: reasons[0],
            quantity: 10
        }, {
            reason: reasons[1],
            quantity: 11
        }];

        title = 'some title';

        isDisabled = true;

        summaries = {
            'keyOne': function() {},
            'keyTwo': function() {}
        };

        preSave = function() {};
        preCancel = function() {};
    });

    describe('open', function() {

        it('should throw exception if adjustments are missing', function() {
            expect(function() {
                adjustmentsModalService.open(undefined);
            }).toThrow('adjustments must be defined');

            expect(function() {
                adjustmentsModalService.open(null);
            }).toThrow('adjustments must be defined');
        });

        it('should throw exception if reasons are missing', function() {
            expect(function() {
                adjustmentsModalService.open(adjustments, undefined);
            }).toThrow('reasons must be defined');

            expect(function() {
                adjustmentsModalService.open(adjustments, null);
            }).toThrow('reasons must be defined');
        });

        it('should copy the list of adjustments', function() {
            adjustmentsModalService.open(adjustments, reasons);

            expect(getResolvedValue('adjustments')).toEqual(adjustments);
            expect(getResolvedValue('adjustments')).not.toBe(adjustments);
        });

        it('should default to \'openlmisAdjustments.adjustments\' if title is undefined', function() {
            adjustmentsModalService.open(adjustments, reasons, undefined);

            expect(getResolvedValue('title')).toEqual('openlmisAdjustments.adjustments');
        });

        it('should pass title if it is defined', function() {
            adjustmentsModalService.open(adjustments, reasons, title);

            var passed = getResolvedValue('title');
            expect(getResolvedValue('title')).toBe(title);
        });

        it('should pass message if it is defined', function() {
            adjustmentsModalService.open(adjustments, reasons, undefined, message);

            expect(getResolvedValue('message')).toBe(message);
        });

        it('should pass isDisabled', function() {
            adjustmentsModalService.open(adjustments, reasons, undefined, undefined, isDisabled);

            expect(getResolvedValue('isDisabled')).toBe(isDisabled);
        });

        it('should pass summaries if it is defined', function() {
            adjustmentsModalService.open(
                adjustments, reasons, undefined, undefined, undefined, summaries
            );

            expect(getResolvedValue('summaries')).toBe(summaries);
        });

        it('should throw exception if any of the summaries is not a function', function() {
            summaries.keyOne = 'definitely not a function';

            expect(function() {
                adjustmentsModalService.open(
                    adjustments, reasons, undefined, undefined, undefined, summaries
                );
            }).toThrow('summaries must be a key-function map');
        });

        it('should pass preSave it is defined', function() {
            adjustmentsModalService.open(
                adjustments, reasons, undefined, undefined, undefined, undefined, preSave
            );

            expect(getResolvedValue('preSave')).toBe(preSave);
        });

        it('should throw exception if preSave if given but not a function', function() {
            preSave = 'definitely not a function';

            expect(function() {
                adjustmentsModalService.open(
                    adjustments, reasons, undefined, undefined, undefined, undefined, preSave
                );
            }).toThrow('preSave must be a function');
        });

        it('should pass preCancel if it defined', function() {
            adjustmentsModalService.open(
                adjustments, reasons, undefined, undefined, undefined, undefined, undefined,
                preCancel
            );

            expect(getResolvedValue('preCancel')).toBe(preCancel);
        });

        it('should throw exception if preCancel if given but not a function', function() {
            preCancel = 'definitely not a function';

            expect(function() {
                adjustmentsModalService.open(
                    adjustments, reasons, undefined, undefined, undefined, undefined, undefined,
                    preCancel
                );
            }).toThrow('preCancel must be a function');
        });

    });

    function getResolvedValue(key) {
        return openlmisModalService.createDialog.calls[0].args[0].resolve[key];
    }

});
