describe('LossesAndAdjustmentsController', function() {

    var vm;

    var rootScope, scope;

    var requisition, adjustments, reasons;

    beforeEach(function() {

        module('requisition-losses-and-adjustments');

        adjustments = jasmine.createSpyObj('stockAdjustments', ['push', 'indexOf', 'splice']);
        requisition = jasmine.createSpyObj('requisition', ['$stockAdjustmentReasons']);
        reasons = requisition.$stockAdjustmentReasons;

        inject(function($rootScope) {
            rootScope = $rootScope;
        });

        scope = rootScope.$new();
        scope.requisition = requisition;
        scope.lineItem = {
            stockAdjustments: adjustments
        };
    });

    describe('initialization', function() {

        beforeEach(inject(function($controller) {
            vm = $controller('LossesAndAdjustmentsController', {
                $scope: scope
            });

            rootScope.$apply();
        }));

        it('should expose requisition', function() {
            expect(vm.requisition).toBe(requisition);
        });

        it('should expose adjustments', function() {
            expect(vm.adjustments).toBe(adjustments);
        });

        it('should fetch stock adjustment reasons', function() {
            expect(vm.reasons).toBe(reasons);
        });
    });

    describe('addAdjustment', function() {

        var adjustment;

        beforeEach(function() {
            adjustment = {
                reason: {
                    id: 2
                },
                quantity: 10
            };

            inject(function($controller) {
                vm = $controller('LossesAndAdjustmentsController', {
                    $scope: scope
                });
            });

            rootScope.$apply();

            vm.adjustment = angular.merge({}, adjustment);

            spyOn(vm, 'getTotal').andReturn(10);
        })

        it('should add adjustment to stock adjustments', function() {
            vm.addAdjustment();

            expect(adjustments.push).toHaveBeenCalledWith({
                reasonId: adjustment.reason.id,
                quantity: adjustment.quantity
            });
        });

        it('should clear form after adding adjustment', function() {
            expect(vm.adjustment.quantity).not.toBeUndefined();
            expect(vm.adjustment.reason).not.toBeUndefined();

            vm.addAdjustment();

            expect(vm.adjustment.quantity).toBeUndefined();
            expect(vm.adjustment.reason).toBeUndefined();
        });

        it('should update total losses and adjustments', function() {
            vm.addAdjustment();

            expect(vm.lineItem.totalLossesAndAdjustments).toBe(10);
        });

    });

    describe('removeAdjustment', function() {

        var adjustment;

        beforeEach(function() {
            adjustments.indexOf.andReturn(123);
            adjustment = jasmine.createSpy();

            inject(function($controller) {
                vm = $controller('LossesAndAdjustmentsController', {
                    $scope: scope
                });
            });

            spyOn(vm, 'getTotal').andReturn(321);
        });

        it('should remove adjustment', function() {
            vm.removeAdjustment(adjustment);

            expect(vm.adjustments.indexOf).toHaveBeenCalledWith(adjustment);
            expect(vm.adjustments.splice).toHaveBeenCalledWith(123, 1);
        });

        it('should update total losses and adjustments', function() {
            vm.removeAdjustment(adjustment);

            expect(vm.lineItem.totalLossesAndAdjustments).toBe(321);
        });
    });

    describe('getReasonName', function() {

        var filter, filteredReasons;

        beforeEach(inject(function($controller) {
            filteredReasons = [
                {
                    name: 'reasonOne'
                }
            ];

            filter = jasmine.createSpy().andCallFake(function() {
                return arguments[1].id === 234 ? filteredReasons : [];
            });

            vm = $controller('LossesAndAdjustmentsController', {
                $scope: scope,
                $filter: jasmine.createSpy().andReturn(filter)
            });

            rootScope.$apply();
        }));

        it('should get reason name if reason with the given id exists', function() {
            var result = vm.getReasonName(234);

            expect(result).toBe('reasonOne');
            expect(filter).toHaveBeenCalledWith(reasons, {
                id: 234
            }, true);
        });

        it('should return undefined if no reason with the given id exists', function() {
            var result = vm.getReasonName(432);

            expect(result).toBe(undefined);
            expect(filter).toHaveBeenCalledWith(reasons, {
                id: 432
            }, true);
        });

    });

    describe('getTotal', function() {

        var calculationFactory;

        beforeEach(inject(function($controller) {
            calculationFactory = jasmine.createSpyObj('calculationFactory', ['totalLossesAndAdjustments']);
            calculationFactory.totalLossesAndAdjustments.andReturn(345);

            vm = $controller('LossesAndAdjustmentsController', {
                $scope: scope,
                calculationFactory: calculationFactory
            });

            rootScope.$apply();
        }));

        it('should calculate total losses and adjustments', function() {
            var result = vm.getTotal();

            expect(result).toBe(345);
            expect(calculationFactory.totalLossesAndAdjustments).toHaveBeenCalledWith(
                scope.lineItem,
                reasons
            );
        })

    });

});
