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

describe('proofOfDeliveryFactory', function() {

    var POD_ID = 'pod-id';

    var proofOfDeliveryFactory, proofOfDeliveryServiceMock, $q, $rootScope, pod, PODMock;

    beforeEach(function() {
        proofOfDeliveryServiceMock = jasmine.createSpyObj('proofOfDeliveryService', ['get']);
        PODMock = jasmine.createSpy('POD');

        module('proof-of-delivery-view', function($provide) {
            $provide.factory('orderFactory', function() {
                return orderFactoryMock;
            });

            $provide.factory('proofOfDeliveryService', function() {
                return proofOfDeliveryServiceMock;
            });

            $provide.factory('ProofOfDelivery', function() {
                return PODMock;
            });
        });

        inject(function($injector) {
            proofOfDeliveryFactory = $injector.get('proofOfDeliveryFactory');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
        });

        pod = {
            order: 'order'
        };

        proofOfDeliveryServiceMock.get.andReturn($q.when(pod));
    });

    describe('get', function() {

        var promise;

        beforeEach(function() {
            promise = proofOfDeliveryFactory.get(POD_ID);
        });

        it('should fetch pod from the service', function() {
            expect(proofOfDeliveryServiceMock.get).toHaveBeenCalledWith(POD_ID);
        });

        it('should create new POD object', function() {
            $rootScope.$apply();

            expect(PODMock).toHaveBeenCalledWith(pod);
        });

        it('should resolve to pod', function() {
            var resolved;

            promise.then(function(pod) {
                resolved = pod;
            });

            $rootScope.$apply();
            $rootScope.$apply();

            expect(resolved).not.toBeUndefined();
        });

    });

});
