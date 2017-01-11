describe("ConvertToOrderModal", function(){

    var convertToOrderModal, ngBootbox, rootScope, requisitionService, q, state;
    var type = {
        name: 'facilityType'
    },
    facility = {
        id: '1',
        name: 'facility',
        type: type
    },
    program = {
        id: '1',
        name: 'program'
    },
    requisition = {
        id: '1',
        name: 'requisition',
        status: 'INITIATED',
        supplyingFacility: supplyingDepotSpy(0),
        program: program,
        facility: facility
    },
    requisitions = [{
        requisition: requisition,
        supplyingDepots: [
        supplyingDepotSpy(0),
        supplyingDepotSpy(1),
        supplyingDepotSpy(2),
        supplyingDepotSpy(3)
    ]}];

    beforeEach(module('requisition-view'));

    beforeEach(inject(function(_ConvertToOrderModal_, _$ngBootbox_, _$rootScope_,
    _requisitionService_, _$q_){
        convertToOrderModal = _ConvertToOrderModal_;
        ngBootbox = _$ngBootbox_;
        rootScope = _$rootScope_;
        requisitionService = _requisitionService_;
        q = _$q_;
    }));

    it('should open modal for convert requisition to order', function(){
        var result;
        spyOn(requisitionService, 'forConvert').andReturn(q.when(requisitions));
        spyOn(ngBootbox, 'customDialog');

        convertToOrderModal.show(requisition).then(function(data) {
            result = data;
        });
        rootScope.$apply();

        expect(ngBootbox.customDialog).toHaveBeenCalled();
        expect(result).toEqual(requisitions[0]);
    });

    it('should close modal for convert requisition for order', function(){
        spyOn(requisitionService, 'forConvert').andReturn(q.when(requisitions));
        spyOn(ngBootbox, 'customDialog');
        spyOn(ngBootbox, 'hideAll');

        convertToOrderModal.show(requisition);
        convertToOrderModal.close();

        expect(ngBootbox.hideAll).toHaveBeenCalled();
    });

    function supplyingDepotSpy(id) {
        return {
            $id: id
        };
    }
});
