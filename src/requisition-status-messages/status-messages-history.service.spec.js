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

describe("statusMessagesHistoryService", function() {

    var statusMessagesHistoryService, $ngBootbox, $compile, templateRequestSpy, q,
        scope, $rootScope, requisition, deferred;

    beforeEach(function() {

        module('requisition-status-messages');

        module(function($provide) {
            templateRequestSpy = jasmine.createSpy('$templateRequest');
            $provide.factory('$templateRequest', function() {
                return templateRequestSpy;
            });
        });

        inject(function(_statusMessagesHistoryService_, _$ngBootbox_, _$rootScope_, $templateRequest,
                        _$compile_, $q) {

            statusMessagesHistoryService = _statusMessagesHistoryService_;
            $ngBootbox = _$ngBootbox_;
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            q = $q;
        });

        deferred = q.defer();
        spyOn($ngBootbox, 'customDialog');

        scope = {};

        templateRequestSpy.andReturn(q.when());
        spyOn($rootScope, '$new').andReturn(scope);

        requisition = jasmine.createSpyObj('requisition', ['$statusMessages']);

    });

    describe('show', function() {

        it('should request template', function() {
            statusMessagesHistoryService.show(requisition);
            $rootScope.$apply();

            expect(templateRequestSpy)
                .toHaveBeenCalledWith('requisition-status-messages/status-messages-history.html');
        });

        it('should open modal', function() {
            statusMessagesHistoryService.show(requisition);
            $rootScope.$apply();

            expect($ngBootbox.customDialog).toHaveBeenCalled();
        });

    });
});
