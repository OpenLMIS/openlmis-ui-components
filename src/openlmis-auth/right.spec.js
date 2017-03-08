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
            right = new Right('RightId', 'RightName', ['ProgramOne'], ['program1'], ['FacilityOne'], ['facility1'], ['NodeOne'], ['node1']);
        });

        it('should set all properties', function() {
            expect(right.id).toBe('RightId');
            expect(right.name).toBe('RightName');
            expect(right.programCodes.length).toBe(1);
            expect(right.programCodes[0]).toBe('ProgramOne');
            expect(right.programIds.length).toBe(1);
            expect(right.programIds[0]).toBe('program1');
            expect(right.warehouseCodes.length).toBe(1);
            expect(right.warehouseCodes[0]).toBe('FacilityOne');
            expect(right.warehouseIds.length).toBe(1);
            expect(right.warehouseIds[0]).toBe('facility1');
            expect(right.supervisoryNodeCodes.length).toBe(1);
            expect(right.supervisoryNodeCodes[0]).toBe('NodeOne');
            expect(right.supervisoryNodeIds.length).toBe(1);
            expect(right.supervisoryNodeIds[0]).toBe('node1');
        });

    });

    describe('buildRights', function() {

        var rights, assignments;

        beforeEach(function() {
            assignments = [
                createAssignment(['RightOne'], 'PRO1', 'program1', 'WH1', 'warehouse1'),
                createAssignment(['RightTwo'], undefined, undefined, 'WH2', 'warehouse2'),
                createAssignment(['RightThree']),
                createAssignment(['RightFour'], undefined, undefined, undefined, undefined, 'SN1', 'node1'),
                createAssignment(['RightOne'], 'PRO2', 'program2'),
                createAssignment(['RightTwo'], undefined, undefined, 'WH3', 'warehouse3'),
                createAssignment(['RightFour'], undefined, undefined, undefined, undefined, 'SN2', 'node2')
            ];

            rights = Right.buildRights(assignments);
        });

        it('should not duplicate rights', function() {
            expect(rights.length).toBe(4);
        });

        it('should group programs', function() {
            expect(rights[0].programCodes.length).toBe(2);
            expect(rights[0].programCodes[0]).toBe('PRO1');
            expect(rights[0].programCodes[1]).toBe('PRO2');

            expect(rights[0].programIds.length).toBe(2);
            expect(rights[0].programIds[0]).toBe('program1');
            expect(rights[0].programIds[1]).toBe('program2');
        });

        it('should group warehouses', function() {
            expect(rights[1].warehouseCodes.length).toBe(2);
            expect(rights[1].warehouseCodes[0]).toBe('WH2');
            expect(rights[1].warehouseCodes[1]).toBe('WH3');

            expect(rights[1].warehouseIds.length).toBe(2);
            expect(rights[1].warehouseIds[0]).toBe('warehouse2');
            expect(rights[1].warehouseIds[1]).toBe('warehouse3');
        });

        it('should group supervisory nodes', function() {
            expect(rights[3].supervisoryNodeCodes.length).toBe(2);
            expect(rights[3].supervisoryNodeCodes[0]).toBe('SN1');
            expect(rights[3].supervisoryNodeCodes[1]).toBe('SN2');

            expect(rights[3].supervisoryNodeIds.length).toBe(2);
            expect(rights[3].supervisoryNodeIds[0]).toBe('node1');
            expect(rights[3].supervisoryNodeIds[1]).toBe('node2');
        });

        it('should mark right as direct if no program, facility or node code is given', function() {
            expect(rights[2].isDirect).toBe(true);
        });

    });

    function createAssignment(rights, programCode, programId, warehouseCode, warehouseId, supervisoryNodeCode, supervisoryNodeId) {
        return {
            role: createRole(rights),
            programCode: programCode,
            programId: programId,
            warehouseCode: warehouseCode,
            warehouseId: warehouseId,
            supervisoryNodeCode: supervisoryNodeCode,
            supervisoryNodeId: supervisoryNodeId
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
