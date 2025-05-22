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

    beforeEach(function() {
        module('openlmis-adjustments');

        inject(function($injector) {
            this.adjustmentsModalService = $injector.get('adjustmentsModalService');
            this.openlmisModalService = $injector.get('openlmisModalService');
        });

        spyOn(this.openlmisModalService, 'createDialog').andCallThrough();

        this.reasons = [{
            name: 'Reason One'
        }, {
            name: 'Reason Two'
        }, {
            name: 'Reason Three'
        }];

        this.adjustments = [{
            reason: this.reasons[0],
            quantity: 10
        }, {
            reason: this.reasons[1],
            quantity: 11
        }];

        this.title = 'some title';

        this.isDisabled = true;

        this.showInDoses = true;

        this.lineItem = {
            orderable: {
                netContent: 88
            }
        };

        this.summaries = {
            keyOne: function() {},
            keyTwo: function() {}
        };

        this.preSave = function() {};
        this.preCancel = function() {};
        this.filterReasons = function() {};

        this.getResolvedValue = getResolvedValue;
    });

    describe('open', function() {

        it('should throw exception if adjustments are missing', function() {
            var adjustmentsModalService = this.adjustmentsModalService;

            expect(function() {
                adjustmentsModalService.open(undefined);
            }).toThrow('adjustments must be defined');

            expect(function() {
                adjustmentsModalService.open(null);
            }).toThrow('adjustments must be defined');
        });

        it('should throw exception if reasons are missing', function() {
            var adjustmentsModalService = this.adjustmentsModalService,
                adjustments = this.adjustments;

            expect(function() {
                adjustmentsModalService.open(adjustments, undefined);
            }).toThrow('reasons must be defined');

            expect(function() {
                adjustmentsModalService.open(adjustments, null);
            }).toThrow('reasons must be defined');
        });

        it('should copy the list of adjustments', function() {
            this.adjustmentsModalService.open(this.adjustments, this.reasons, this.lineItem, this.showInDoses);

            expect(this.getResolvedValue('adjustments')).toEqual(this.adjustments);
            expect(this.getResolvedValue('adjustments')).not.toBe(this.adjustments);
        });

        it('should default to \'openlmisAdjustments.adjustments\' if title is undefined', function() {
            this.adjustmentsModalService.open(this.adjustments, this.reasons, this.lineItem, this.showInDoses,
                undefined);

            expect(this.getResolvedValue('title')).toEqual('openlmisAdjustments.adjustments');
        });

        it('should pass title if it is defined', function() {
            this.adjustmentsModalService.open(this.adjustments, this.reasons, this.lineItem, this.showInDoses,
                this.title);

            expect(this.getResolvedValue('title')).toBe(this.title);
        });

        it('should pass message if it is defined', function() {
            this.adjustmentsModalService.open(this.adjustments, this.reasons, this.lineItem, this.showInDoses,
                undefined, this.message);

            expect(this.getResolvedValue('message')).toBe(this.message);
        });

        it('should pass isDisabled', function() {
            this.adjustmentsModalService.open(this.adjustments, this.reasons, this.lineItem, this.showInDoses,
                undefined, undefined, this.isDisabled);

            expect(this.getResolvedValue('isDisabled')).toBe(this.isDisabled);
        });

        it('should pass summaries if it is defined', function() {
            this.adjustmentsModalService.open(
                this.adjustments, this.reasons, this.lineItem, this.showInDoses, undefined, undefined, undefined,
                this.summaries
            );

            expect(this.getResolvedValue('summaries')).toBe(this.summaries);
        });

        it('should throw exception if any of the summaries is not a function', function() {
            this.summaries.keyOne = 'definitely not a function';

            var context = this;

            expect(function() {
                context.adjustmentsModalService.open(
                    context.adjustments, context.reasons, context.lineItem, context.showInDoses, undefined, undefined,
                    undefined, context.summaries
                );
            }).toThrow('summaries must be a key-function map');
        });

        it('should pass preSave if it is defined', function() {
            this.adjustmentsModalService.open(
                this.adjustments, this.reasons, this.lineItem, this.showInDoses, undefined, undefined, undefined,
                undefined, this.preSave
            );

            expect(this.getResolvedValue('preSave')).toBe(this.preSave);
        });

        it('should throw exception if preSave is given but not a function', function() {
            this.preSave = 'definitely not a function';

            var context = this;

            expect(function() {
                context.adjustmentsModalService.open(
                    context.adjustments, context.reasons, context.lineItem, context.showInDoses, undefined, undefined,
                    undefined, undefined, context.preSave
                );
            }).toThrow('preSave must be a function');
        });

        it('should pass preCancel if it is defined', function() {
            this.adjustmentsModalService.open(
                this.adjustments, this.reasons, this.lineItem, this.showInDoses, undefined, undefined, undefined,
                undefined, undefined, this.preCancel
            );

            expect(this.getResolvedValue('preCancel')).toBe(this.preCancel);
        });

        it('should throw exception if preCancel is given but not a function', function() {
            this.preCancel = 'definitely not a function';

            var context = this;

            expect(function() {
                context.adjustmentsModalService.open(
                    context.adjustments, context.reasons, context.lineItem, context.showInDoses, undefined, undefined,
                    undefined, undefined, undefined, context.preCancel
                );
            }).toThrow('preCancel must be a function');
        });

        it('should pass filterReasons if it is defined', function() {
            this.adjustmentsModalService.open(
                this.adjustments, this.reasons, this.lineItem, this.showInDoses, undefined, undefined, undefined,
                undefined, undefined, undefined, this.filterReasons
            );

            expect(this.getResolvedValue('filterReasons')).toBe(this.filterReasons);
        });

        it('should throw exception if filterReasons is given but not a function', function() {
            this.filterReasons = 'definitely not a function';

            var context = this;

            expect(function() {
                context.adjustmentsModalService.open(
                    context.adjustments, context.reasons, context.lineItem, context.showInDoses, undefined, undefined,
                    undefined, undefined, undefined, undefined, context.filterReasons
                );
            }).toThrow('filterReasons must be a function');
        });

    });

    function getResolvedValue(key) {
        return this.openlmisModalService.createDialog.calls[0].args[0].resolve[key];
    }

});
