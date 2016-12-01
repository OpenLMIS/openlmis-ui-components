describe('TemplateController', function() {

    //tested
    var vm;

    //mocks
    var template, program;

    //injects
    var q, state, notification, source, rootScope;

    beforeEach(module('openlmis.administration'));
    beforeEach(module('openlmis.requisitions'));

    beforeEach(inject(function($controller, $q, $state, Notification, Source, messageService, $rootScope) {
        q = $q;
        state = $state;
        notification = Notification;
        source = Source;
        message = messageService;
        rootScope = $rootScope;

        var mockFunction = function() {};
        template = jasmine.createSpyObj('template', ['$save', '$moveColumn']);
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
            }
        };
        program = {
            id: '1',
            mame: 'program1'
        };

        vm = $controller('TemplateController', {
            templateAndProgram: {
                program: program,
                template: template
            }
        });
    }));

    it('should set template and program', function() {
        expect(vm.program).toEqual(program);
        expect(vm.template).toEqual(template);
    });

    it('should save template and then display succes notification and change state', function() {
        var stateGoSpy = jasmine.createSpy(),
            notificationSpy = jasmine.createSpy();

        template.$save.andReturn(q.when(true));

        spyOn(state, 'go').andCallFake(stateGoSpy);
        spyOn(notification, 'success').andCallFake(notificationSpy);

        vm.saveTemplate();

        rootScope.$apply();

        expect(stateGoSpy).toHaveBeenCalled();
        expect(notificationSpy).toHaveBeenCalled();
    });

    it('should call column drop method and display error notification when drop failed', function() {
        var notificationSpy = jasmine.createSpy();

        template.$moveColumn.andReturn(false);

        spyOn(notification, 'error').andCallFake(notificationSpy);

        vm.dropCallback(null, 1, template.columnsMap.total);

        expect(notificationSpy).toHaveBeenCalled();
    });

    it('can change source works correctly', function() {
        expect(vm.canChangeSource({
            sources: [source.USER_INPUT.name, source.CALCULATED.name]
        })).toBe(true);
        expect(vm.canChangeSource({
            sources: [source.USER_INPUT.name]
        })).toBe(false);
    });

    it('should return proper error message', function() {
        var column = {
            $dependentOn: ['total', 'remarks']
        };

        spyOn(message, 'get').andReturn('');

        expect(vm.errorMessage(column)).toEqual(' ' + template.columnsMap.total.label + ', ' + template.columnsMap.remarks.label);
    });
});
