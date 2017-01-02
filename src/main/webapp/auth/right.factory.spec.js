describe('Right', function() {

    var Right;

    beforeEach(function() {
        module('openlmis-auth');

        inject(function(_Right_) {
            Right = _Right_;
        });
    });

    describe('constructor', function() {

        var right;

        beforeEach(function() {
            right = new Right('RightId', 'RightName', ['ProgramOne'], ['FacilityOne'], ['NodeOne']);
        });

        it('should set all properties', function() {
            expect(right.id).toBe('RightId');
            expect(right.name).toBe('RightName');
            expect(right.programs.length).toBe(1);
            expect(right.programs[0]).toBe('ProgramOne');
            expect(right.facilities.length).toBe(1);
            expect(right.facilities[0]).toBe('FacilityOne');
            expect(right.nodes.length).toBe(1);
            expect(right.nodes[0]).toBe('NodeOne');
        });

    });

    describe('buildRights', function() {

        var rights, assignments;

        beforeEach(function() {
            assignments = [
                createAssignment(['RightOne'], 'PRO1', 'WH1'),
                createAssignment(['RightTwo'], undefined, 'WH2'),
                createAssignment(['RightThree']),
                createAssignment(['RightFour'], undefined, undefined, 'SN1'),
                createAssignment(['RightOne'], 'PRO2'),
                createAssignment(['RightTwo'], undefined, 'WH3'),
                createAssignment(['RightFour'], undefined, undefined, 'SN2')
            ];

            rights = Right.buildRights(assignments);
        });

        it('should not duplicate rights', function() {
            expect(rights.length).toBe(4);
        });

        it('should group programs', function() {
            expect(rights[0].programs.length).toBe(2);
            expect(rights[0].programs[0]).toBe('PRO1');
            expect(rights[0].programs[1]).toBe('PRO2');
        });

        it('should group facilities', function() {
            expect(rights[1].facilities.length).toBe(2);
            expect(rights[1].facilities[0]).toBe('WH2');
            expect(rights[1].facilities[1]).toBe('WH3');
        });

        it('should group nodes', function() {
            expect(rights[3].nodes.length).toBe(2);
            expect(rights[3].nodes[0]).toBe('SN1');
            expect(rights[3].nodes[1]).toBe('SN2');
        });

        it('should mark right as direct if no program, facility or node code is given', function() {
            expect(rights[2].isDirect).toBe(true);
        });

    });

    function createAssignment(rights, program, facility, node) {
        return {
            role: createRole(rights),
            programCode: program,
            warehouseCode: facility,
            supervisoryNodeCode: node
        }
    }

    function createRole(rightNames) {
        var rights = [];
        rightNames.forEach(function(name) {
            rights.push(createRight(name));
        });
        return {
            rights: rights
        };
    }

    function createRight(name) {
        return {
            name: name
        };
    }

});
