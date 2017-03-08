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

describe('RequisitionTemplateAdminController', function() {

    //tested
    var vm;

    //mocks
    var template, program;

    //injects
    var q, state, notificationService, COLUMN_SOURCES, rootScope, MAX_COLUMN_DESCRIPTION_LENGTH;

    beforeEach(function() {
        module('admin-template');

        template = jasmine.createSpyObj('template', ['$save', '$moveColumn', '$findCircularCalculatedDependencies']);
        template.id = '1';
        template.programId = '1';
        template.columnsMap = {
            remarks: {
                displayOrder: 1,
                isDisplayed: true,
                label: 'Remarks'
            },
            total: {
                displayOrder: 2,
                isDisplayed: true,
                label: 'Total'
            },
            stockOnHand: {
                displayOrder: 3,
                isDisplayed: true,
                label: "Stock on Hand"
            },
            averageConsumption: {
                name: 'averageConsumption',
                displayOrder: 4,
                isDisplayed: true,
                label: "Average Consumption"
            }
        };
        template.numberOfPeriodsToAverage = 3;
        program = {
            id: '1',
            name: 'program1'
        };

        inject(function($controller, $q, $state, _notificationService_, _COLUMN_SOURCES_,
                        messageService, $rootScope, _MAX_COLUMN_DESCRIPTION_LENGTH_) {

            q = $q;
            state = $state;
            notificationService = _notificationService_;
            COLUMN_SOURCES = _COLUMN_SOURCES_;
            MAX_COLUMN_DESCRIPTION_LENGTH = _MAX_COLUMN_DESCRIPTION_LENGTH_;
            message = messageService;
            rootScope = $rootScope;

            vm = $controller('RequisitionTemplateAdminController', {
                program: program,
                template: template
            });
        });
    });

    it('should set template and program', function() {
        expect(vm.program).toEqual(program);
        expect(vm.template).toEqual(template);
    });

    it('should save template and then display success notification and change state', function() {
        var stateGoSpy = jasmine.createSpy(),
            notificationServiceSpy = jasmine.createSpy();

        template.$save.andReturn(q.when(true));

        spyOn(state, 'go').andCallFake(stateGoSpy);
        spyOn(notificationService, 'success').andCallFake(notificationServiceSpy);

        vm.saveTemplate();

        rootScope.$apply();

        expect(stateGoSpy).toHaveBeenCalled();
        expect(notificationServiceSpy).toHaveBeenCalled();
    });

    it('should call column drop method and display error notification when drop failed', function() {
        var notificationServiceSpy = jasmine.createSpy();

        template.$moveColumn.andReturn(false);

        spyOn(notificationService, 'error').andCallFake(notificationServiceSpy);

        vm.dropCallback(null, 1, template.columnsMap.total);

        expect(notificationServiceSpy).toHaveBeenCalled();
    });

    it('can change source works correctly', function() {
        expect(vm.canChangeSource({
            sources: [COLUMN_SOURCES.USER_INPUT, COLUMN_SOURCES.CALCULATED]
        })).toBe(true);
        expect(vm.canChangeSource({
            sources: [COLUMN_SOURCES.USER_INPUT]
        })).toBe(false);
    });

    it('should validate for circular dependencies', function() {
       var column = {
            $dependentOn: ['stockOnHand'],
            source: 'CALCULATED',
            label: 'column',
            columnDefinition: {
                sources: ['USER_INPUT', 'CALCULATED'],
                options: []
            }
        };
        spyOn(message, 'get').andReturn('Circular error');

        template.$findCircularCalculatedDependencies.andReturn(['stockOnHand']);

        expect(vm.errorMessage(column)).toBe('Circular error Stock on Hand');
    });

    it('should validate for circular dependencies and return error for multiple columns', function() {
       var column = {
            $dependentOn: ['stockOnHand'],
            source: 'CALCULATED',
            label: 'column',
            columnDefinition: {
                sources: ['USER_INPUT', 'CALCULATED'],
                options: []
            }
        };
        spyOn(message, 'get').andReturn('Circular error');

        template.$findCircularCalculatedDependencies.andReturn(['stockOnHand', 'total']);

        expect(vm.errorMessage(column)).toBe('Circular error Stock on Hand, Total');
    });

    it('should validate if option is not set and column definition has multiple options', function() {
       var column = {
            $dependentOn: ['stockOnHand'],
            source: 'CALCULATED',
            label: 'column',
            columnDefinition: {
                options: [
                    {
                        id: '1',
                        optionLabel: 'option1'
                    },
                    {
                        id: '2',
                        optionLabel: 'option2'
                    },
                ]
            }
        };
        spyOn(message, 'get').andReturn('Empty option field');

        template.$findCircularCalculatedDependencies.andReturn([]);

        expect(vm.errorMessage(column)).toBe('Empty option field');
    });

    it('should validate if number of periods to average is not greater than or equal to 2', function() {
        vm.template.numberOfPeriodsToAverage = 1;
        spyOn(message, 'get').andReturn('Number of periods to average must be greater than or equal to 2');

        var result = vm.errorMessage(vm.template.columnsMap.averageConsumption);

        expect(message.get).toHaveBeenCalledWith('msg.template.invalidNumberOfPeriods');
        expect(result).toBe('Number of periods to average must be greater than or equal to 2');
    });

    it('should validate if number of periods to average is empty', function() {
        vm.template.numberOfPeriodsToAverage = '';
        spyOn(message, 'get').andReturn('Number of periods cannot be empty!');

        var result = vm.errorMessage(vm.template.columnsMap.averageConsumption);

        expect(message.get).toHaveBeenCalledWith('msg.template.emptyNumberOfPeriods');
        expect(result).toBe('Number of periods cannot be empty!');
    });

    it('should validate if requestedQuantity and requestedQuantityExplanation have the same display', function() {
        var errorMessage = 'message',
            longString = 'd';

        for(var i = 0; i < MAX_COLUMN_DESCRIPTION_LENGTH; i++){
            longString = longString.concat('d');
        }

        vm.template.columnsMap.total.definition = longString;

        spyOn(message, 'get').andReturn(errorMessage);

        expect(vm.errorMessage(vm.template.columnsMap.total)).toEqual(errorMessage);
        expect(message.get).toHaveBeenCalledWith('error.columnDescriptionTooLong');
    });

    it('should validate if column label is not empty', function() {
        spyOn(message, 'get').andReturn('');

        vm.template.columnsMap.total.label = undefined;
        expect(vm.errorMessage(vm.template.columnsMap.total)).toEqual('');
        expect(message.get).toHaveBeenCalledWith('error.columnLabelEmpty');

        vm.template.columnsMap.total.label = null;
        expect(vm.errorMessage(vm.template.columnsMap.total)).toEqual('');
        expect(message.get).toHaveBeenCalledWith('error.columnLabelEmpty');

        vm.template.columnsMap.total.label = '';
        expect(vm.errorMessage(vm.template.columnsMap.total)).toEqual('');
        expect(message.get).toHaveBeenCalledWith('error.columnLabelEmpty');
    });

    it('should validate if column label has at least 2 characters', function() {
        spyOn(message, 'get').andReturn('');

        vm.template.columnsMap.total.label = '';
        expect(vm.errorMessage(vm.template.columnsMap.total)).toEqual('');
        expect(message.get).toHaveBeenCalledWith('error.columnLabelEmpty');

        vm.template.columnsMap.total.label = 'a';
        expect(vm.errorMessage(vm.template.columnsMap.total)).toEqual('');
        expect(message.get).toHaveBeenCalledWith('error.columnLabelToShort');
    });

    it('should validate if column label is aplha-numeric', function() {
        spyOn(message, 'get').andReturn('');

        vm.template.columnsMap.total.label = 'asd#!';
        expect(vm.errorMessage(vm.template.columnsMap.total)).toEqual('');
        expect(message.get).toHaveBeenCalledWith('error.columnLabelNotAllowedCharacters');

        vm.template.columnsMap.total.label = 'Asd%&';
        expect(vm.errorMessage(vm.template.columnsMap.total)).toEqual('');
        expect(message.get).toHaveBeenCalledWith('error.columnLabelNotAllowedCharacters');
    });

    it('should validate if requestedQuantity and requestedQuantityExplanation have the same display', function() {
        var errorMessage = 'This column should be displayed/not displayed together with: ';

        vm.template.columnsMap.requestedQuantity = {
            name: 'requestedQuantity',
            displayOrder: 5,
            isDisplayed: true,
            label: "Requested Quantity"
        };
        vm.template.columnsMap.requestedQuantityExplanation = {
            name: 'requestedQuantityExplanation',
            displayOrder: 7,
            isDisplayed: false,
            label: "Requested Quantity Explanation"
        };

        spyOn(message, 'get').andReturn(errorMessage);

        expect(vm.errorMessage(vm.template.columnsMap.requestedQuantity)).toEqual(errorMessage + vm.template.columnsMap.requestedQuantityExplanation.label);
        expect(message.get).toHaveBeenCalledWith('error.columnDisplayMismatch');

        expect(vm.errorMessage(vm.template.columnsMap.requestedQuantityExplanation)).toEqual(errorMessage + vm.template.columnsMap.requestedQuantity.label);
        expect(message.get).toHaveBeenCalledWith('error.columnDisplayMismatch');
    });

    it('should validate if column is not displayed when has USER_INPUT source', function() {
        var shouldBeDisplayedMessage = 'Should be displayed',
            isUserInputMessage = ' if source is USER INPUT';

        vm.template.columnsMap.stockOnHand = {
            name: 'stockOnHand',
            displayOrder: 5,
            isDisplayed: false,
            source: COLUMN_SOURCES.USER_INPUT,
            label: 'Stock on Hand',
            columnDefinition: {
                options: [],
                sources: [COLUMN_SOURCES.USER_INPUT, COLUMN_SOURCES.CALCULATED]
            }
        };

        spyOn(message, 'get').andCallFake(function(msg) {
            if(msg === 'msg.template.column.shouldBeDisplayed') return shouldBeDisplayedMessage;
            else if(msg === 'msg.template.column.isUserInput') return isUserInputMessage;
            else return '';
        });

        expect(vm.errorMessage(vm.template.columnsMap.stockOnHand)).toEqual(shouldBeDisplayedMessage + isUserInputMessage);
        expect(message.get).toHaveBeenCalledWith('msg.template.column.shouldBeDisplayed');
        expect(message.get).toHaveBeenCalledWith('msg.template.column.isUserInput');
    });
});
