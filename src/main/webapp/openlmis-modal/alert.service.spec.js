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

describe("alertService", function() {

    var timeout, alert, rootScope, Bootbox;

    beforeEach(module('openlmis-modal'));

    beforeEach(inject(function(_$rootScope_, _$timeout_, alertService, $templateCache, bootbox) {
        timeout = _$timeout_;
        alert = alertService;
        rootScope = _$rootScope_;
        Bootbox = bootbox;

        $templateCache.put('openlmis-modal/alert.html', '<div class="alert-modal"></div>');
    }));

    it('should close error alert then call callback function after clicking on it', function() {
        var callback = jasmine.createSpy();

        alert.error('some.message').then(callback);
        angular.element(document.querySelector('.alert-modal')).trigger('click');
        waitsFor(function() {
            rootScope.$digest();
            return callback.callCount > 0;
        }, "Callback has not been executed.", 1000);

        runs(function() {
            expect(callback).toHaveBeenCalled();
        });
    });

});
