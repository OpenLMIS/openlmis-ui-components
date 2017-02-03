describe("REQUISITION_STATUS", function() {

    var RequisitionStatus;

    beforeEach(function() {

        module('requisition-constants');

        inject(function(_REQUISITION_STATUS_) {
            RequisitionStatus = _REQUISITION_STATUS_;
        });
    });

    describe('getDisplayName', function() {

        it('should get display name for provided status', function() {
            var displayName = RequisitionStatus.$getDisplayName('INITIATED');

            expect(displayName).toBe('Initiated');
        });
    });

    describe('toList', function() {

        it('should return list of all requisition statuses', function() {
            var returnedList = RequisitionStatus.$toList();

            expect(returnedList[0].label).toBe('INITIATED');
            expect(returnedList[1].label).toBe('SUBMITTED');
            expect(returnedList[2].label).toBe('AUTHORIZED');
            expect(returnedList[3].label).toBe('IN_APPROVAL');
            expect(returnedList[4].label).toBe('APPROVED');
            expect(returnedList[5].label).toBe('RELEASED');
            expect(returnedList[6].label).toBe('SKIPPED');
        });
    });
});
