/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe('FacilityStorage', function() {

    var FacilityStorage,
        facility1 = {
            id: '1',
            name: 'facility1'
        },
        facility2 = {
            id: '2',
            name: 'facility2'
        };

    beforeEach(module('openlmis.requisitions'));

    beforeEach(inject(function(_FacilityStorage_) {
        FacilityStorage = _FacilityStorage_;
    }));

    it('should get facility by id', function() {
        FacilityStorage.put(facility1);

        expect(FacilityStorage.get(facility1.id)).toEqual(facility1);
    });

    it('should get all facilies', function() {
        FacilityStorage.put(facility1);
        FacilityStorage.put(facility2);

        expect(FacilityStorage.getAll()).toEqual([facility1, facility2]);
    });

    it('should clear all facilies', function() {
        expect(FacilityStorage.getAll()).toEqual([]);

        FacilityStorage.put(facility1);
        FacilityStorage.put(facility2);

        expect(FacilityStorage.getAll()).toEqual([facility1, facility2]);

        FacilityStorage.clearAll();

        expect(FacilityStorage.getAll()).toEqual([]);
    });
});
