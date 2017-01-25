describe('PodViewController', function() {

    var vm, $rootScope, $state, $q, podSpy, notificationServiceMock, confirmServiceMock, confirmPromise, isValid;

    beforeEach(function() {
        notificationServiceMock = jasmine.createSpyObj('notificationService', ['success', 'error']);
        confirmServiceMock = jasmine.createSpyObj('confirmService', ['confirm']);
        proofOfDeliveryServiceMock = jasmine.createSpyObj('proofOfDeliveryService', ['save', 'submit']);
        podSpy = jasmine.createSpyObj('pod', ['isValid', 'isLineItemValid']);
        podSpy.proofOfDeliveryLineItems = [
            {
                id: '1',
                $program: {
                    productCategoryDisplayName: 'firstCategory'
                }
            },
            {
                id: '2',
                $program: {
                    productCategoryDisplayName: 'secondCategory'
                }
            },
            {
                id: '3',
                $program: {
                    productCategoryDisplayName: 'secondCategory'
                }
            }
        ];

        module('proof-of-delivery-view', function($provide) {
            $provide.service('notificationService', function() {
                return notificationServiceMock;
            });

            $provide.service('confirmService', function() {
                return confirmServiceMock;
            });

            $provide.service('proofOfDeliveryService', function() {
                return proofOfDeliveryServiceMock;
            });
        });

        inject(function(_$rootScope_, _$state_, _$q_, $controller) {
            $rootScope = _$rootScope_;
            $state = _$state_;
            $q = _$q_;

            vm = $controller('ProofOfDeliveryViewController', {
                pod: podSpy
            });
        });

        spyOn($state, 'reload').andReturn();

        confirmPromise = $q.when();
        confirmServiceMock.confirm.andReturn(confirmPromise);
    });

    it('initialization should expose pod', function() {
        expect(vm.pod).toEqual(podSpy);
    });

    it('initialization should expose product categories with attached programs', function() {
        var result = {
            firstCategory: [
                podSpy.proofOfDeliveryLineItems[0]
            ],
            secondCategory: [
                podSpy.proofOfDeliveryLineItems[1],
                podSpy.proofOfDeliveryLineItems[2]
            ]
        };
        expect(vm.categories).toEqual(result);
    });

    describe('savePod', function() {

        var deferred;

        beforeEach(function() {
            deferred = $q.defer();
            proofOfDeliveryServiceMock.save.andReturn(deferred.promise);
        });

        it('should show confirmation modal', function() {
            callSave(true);

            expect(confirmServiceMock.confirm).toHaveBeenCalledWith('msg.orders.savePodQuestion');
        });

        it('should save pod', function() {
            callSave(true);

            expect(proofOfDeliveryServiceMock.save).toHaveBeenCalledWith(podSpy);
        });

        it('should show error notification if validation was not successful', function() {
            callSave(false);

            expect(notificationServiceMock.error).toHaveBeenCalledWith('error.podInvalid');
        });

        it('should show success notification if save was successful', function() {
            callSave(true);
            deferred.resolve();
            $rootScope.$apply();

            expect(notificationServiceMock.success).toHaveBeenCalledWith('msg.podSaved');
        });

        it('should reload state if save was successful', function() {
            callSave(true);
            deferred.resolve();
            $rootScope.$apply();

            expect($state.reload).toHaveBeenCalled();
        });

        it('should show error notification if save failed', function() {
            callSave(true);
            deferred.reject();
            $rootScope.$apply();

            expect(notificationServiceMock.error).toHaveBeenCalledWith('msg.podSavedFailed');
        });

        it('should not reload state if save failed', function() {
            callSave(true);
            deferred.reject();
            $rootScope.$apply();

            expect($state.reload).not.toHaveBeenCalled();
        });

        function callSave(isValid) {
            podSpy.isValid.andReturn(isValid);
            vm.savePod();
            $rootScope.$apply();
        }
    });

    describe('submitPod', function() {

        var deferred;

        beforeEach(function() {
            deferred = $q.defer();
            proofOfDeliveryServiceMock.submit.andReturn(deferred.promise);
        });

        it('should show confirmation modal', function() {
            callSubmit(true);

            expect(confirmServiceMock.confirm).toHaveBeenCalledWith('msg.orders.submitPodQuestion');
        });

        it('should submit pod', function() {
            callSubmit(true);

            expect(proofOfDeliveryServiceMock.submit).toHaveBeenCalledWith(podSpy);
        });

        it('should show error notification if validation was not successful', function() {
            callSubmit(false);

            expect(notificationServiceMock.error).toHaveBeenCalledWith('error.podInvalid');
        });

        it('should show success notification if save was successful', function() {
            callSubmit(true);
            deferred.resolve();
            $rootScope.$apply();

            expect(notificationServiceMock.success).toHaveBeenCalledWith('msg.podSubmit');
        });

        it('should reload state if save was successful', function() {
            callSubmit(true);
            deferred.resolve();
            $rootScope.$apply();

            expect($state.reload).toHaveBeenCalled();
        });

        it('should show error notification if save failed', function() {
            callSubmit(true);
            deferred.reject();
            $rootScope.$apply();

            expect(notificationServiceMock.error).toHaveBeenCalledWith('msg.podSubmitFailed');
        });

        it('should not reload state if save failed', function() {
            callSubmit(true);
            deferred.reject();
            $rootScope.$apply();

            expect($state.reload).not.toHaveBeenCalled();
        });

        function callSubmit(isValid) {
            podSpy.isValid.andReturn(isValid);
            vm.submitPod();
            $rootScope.$apply();
        }
    });

    describe('periodDisplayName', function() {

        beforeEach(function() {
            podSpy.order = {
                processingPeriod: {
                    startDate: [2015, 5, 1],
                    endDate: [2015, 5, 31]
                }
            };
        });

        it('should parse period properly', function() {
            expect(vm.periodDisplayName()).toEqual('2015/5/1 - 2015/5/31');
        });

    });

    describe('typeMessage', function() {

        var order;

        beforeEach(function() {
            podSpy.order = {};
            order = podSpy.order;
        });

        it('should return emergency if pod order is emergency', function() {
            order.emergency = true;

            var result = vm.typeMessage();

            expect(result).toEqual('label.emergency');
        });

        it('should return regular if pod order is not emergency', function() {
            order.emergency = false;

            var result = vm.typeMessage();

            expect(result).toEqual('msg.regular');
        });

    });

});
