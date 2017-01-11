describe('RequisitionTemplateAdminController', function() {

    //tested
    var vm;

    //mocks
    var template, program;

    //injects
    var q, state, notificationService, COLUMN_SOURCES, rootScope;

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
            }
        };
        program = {
            id: '1',
            mame: 'program1'
        };

        inject(function($controller, $q, $state, _notificationService_, _COLUMN_SOURCES_,
                        messageService, $rootScope) {

            q = $q;
            state = $state;
            notificationService = _notificationService_;
            COLUMN_SOURCES = _COLUMN_SOURCES_;
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
});
