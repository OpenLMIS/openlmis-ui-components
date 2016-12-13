/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe('RequisitionStorage', function() {

    var RequisitionStorage,
        requisition1 = {
            id: '1',
            name: 'requisition1',
            status: 'AUTHORIZED'
        },
        requisition2 = {
            id: '2',
            name: 'requisition2',
            status: 'INITIATED'
        };

    beforeEach(module('openlmis.requisitions'));

    beforeEach(inject(function(_RequisitionStorage_) {
        RequisitionStorage = _RequisitionStorage_;;
    }));

    it('should get requisition by id', function() {
        RequisitionStorage.put(requisition1);

        expect(RequisitionStorage.get(requisition1.id)).toEqual(requisition1);
    });

    it('should get all requisitions', function() {
        RequisitionStorage.put(requisition1);
        RequisitionStorage.put(requisition2);

        expect(RequisitionStorage.getAll()).toEqual([requisition1, requisition2]);
    });

    it('should clear all requisitions', function() {
        expect(RequisitionStorage.getAll()).toEqual([]);

        RequisitionStorage.put(requisition1);
        RequisitionStorage.put(requisition2);

        expect(RequisitionStorage.getAll()).toEqual([requisition1, requisition2]);

        RequisitionStorage.clearAll();

        expect(RequisitionStorage.getAll()).toEqual([]);
    });

    it('should search requisitions by params', function() {
        var params = {
            statuses: ['AUTHORIZED']
        }

        RequisitionStorage.put(requisition1);
        RequisitionStorage.put(requisition2);

        expect(RequisitionStorage.search(params)).toEqual([requisition1]);
    });
});
