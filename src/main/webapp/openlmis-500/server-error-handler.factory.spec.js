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

describe('serverErrorHandler', function() {

    var handler, $q, serverErrorModalService;

    beforeEach(function() {
        module('openlmis-500');

        inject(function(_serverErrorHandler_, $injector, _$q_) {
            handler = _serverErrorHandler_;
            $q = _$q_;

            alertMock = jasmine.createSpyObj('alertService', ['error']);
            spyOn($injector, 'get').andCallFake(function(name) {
                if (name === 'alertService') return alertMock;
            });
            alertMock.error.andCallFake(function() {
                return $q.when(true);
            });
        });
    });

    it('should show modal on 500 error', function() {
        var response = {
                status: 500,
                statusText: 'Server error!'
            };

        spyOn($q, 'reject').andCallThrough();

        handler.responseError(response);

        expect(alertMock.error).toHaveBeenCalled();
        expect($q.reject).toHaveBeenCalledWith(response);
    });

    it('should not show alert modal when other is shown', function() {
        var response = {
                status: 500,
                statusText: 'Server error!'
            };

        spyOn($q, 'reject').andCallThrough();

        handler.responseError(response);
        handler.responseError(response);

        expect(alertMock.error.callCount).toEqual(1);
        expect($q.reject).toHaveBeenCalledWith(response);
    })
});
