describe('orderFactory', function() {

    var orderFactory, facilityServiceSpy, programServiceSpy, periodServiceSpy, OrderSpy, source,
        $rootScope;

    beforeEach(function() {
        facilityServiceSpy = jasmine.createSpyObj('facilityService', ['get']);
        programServiceSpy = jasmine.createSpyObj('programService', ['get']);
        periodServiceSpy = jasmine.createSpyObj('periodService', ['get']);
        OrderSpy = jasmine.createSpy('Order');

        source = {
            facilityId: 'facility',
            requestingFacilityId: 'requesting-facility',
            receivingFacilityId: 'receiving-facility',
            supplyingFacilityId: 'supplying-facility',
            programId: 'program',
            processingPeriodId: 'processing-period'
        };

        module('order', function($provide) {
            $provide.factory('facilityService', function() {
                return facilityServiceSpy;
            });

            $provide.factory('programService', function() {
                return programServiceSpy;
            });

            $provide.factory('periodService', function() {
                return periodServiceSpy;
            });

            $provide.factory('Order', function() {
                return OrderSpy;
            });
        });

        inject(function(_orderFactory_, _$rootScope_) {
            orderFactory = _orderFactory_;
            $rootScope = _$rootScope_;
        });
    });

    describe('get', function() {

        var result, facility, requestingFacility, receivingFacility, supplyingFacility, program,
            processingPeriod;

        beforeEach(function() {
            requestingFacility = jasmine.createSpy('requestingFacility');
            receivingFacility = jasmine.createSpy('receivingFacility');
            supplyingFacility = jasmine.createSpy('supplyingFacility');
            processingPeriod = jasmine.createSpy('processingPeriod');
            facility = jasmine.createSpy('facility');
            program = jasmine.createSpy('program');
            order = jasmine.createSpy('order');

            facilityServiceSpy.get.andCallFake(function(id) {
                if (id === 'requesting-facility') return requestingFacility;
                if (id === 'receiving-facility') return receivingFacility;
                if (id === 'supplying-facility') return supplyingFacility;
                if (id === 'facility') return facility;
            });

            programServiceSpy.get.andCallFake(function(id) {
                if (id === 'program') return program;
            });

            periodServiceSpy.get.andCallFake(function(id) {
                if (id === 'processing-period') return processingPeriod;
            });

            OrderSpy.andReturn(order);

            result = orderFactory.get(source);
            $rootScope.$apply();
        });

        it('should fetch facility', function() {
            expect(facilityServiceSpy.get).toHaveBeenCalledWith('facility');
        });

        it('should fetch requesting facility', function() {
            expect(facilityServiceSpy.get).toHaveBeenCalledWith('requesting-facility');
        });

        it('should fetch receiving facility', function() {
            expect(facilityServiceSpy.get).toHaveBeenCalledWith('receiving-facility');
        });

        it('should fetch supplying facility', function() {
            expect(facilityServiceSpy.get).toHaveBeenCalledWith('supplying-facility');
        });

        it('should fetch program', function() {
            expect(programServiceSpy.get).toHaveBeenCalledWith('program');
        });

        it('should fetch period', function() {
            expect(periodServiceSpy.get).toHaveBeenCalledWith('processing-period');
        });

        it('should return promise', function() {
            expect(result.then).not.toBeUndefined();
        });

        it('should create new Order', function() {
            expect(OrderSpy).toHaveBeenCalledWith(
                source,
                facility,
                requestingFacility,
                receivingFacility,
                supplyingFacility,
                program,
                processingPeriod
            );
        });

        it('should resolve return promise to order', function() {
            var resolvedOrder;

            result.then(function(order) {
                resolvedOrder = order;
            });

            $rootScope.$apply();

            expect(resolvedOrder).toEqual(order);
        });

    });

});
