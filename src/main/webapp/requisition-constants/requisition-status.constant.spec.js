describe("REQUISITION_STATUS", function() {

    var RequisitionStatus;

    beforeEach(function() {

        module('requisition-constants');

        inject(function(_REQUISITION_STATUS_) {
            RequisitionStatus = _REQUISITION_STATUS_;
        });
    });

    describe('getDisplayName', function() {

        it('should get display name for INITIATED status', function() {
            var displayName = RequisitionStatus.$getDisplayName('INITIATED');

            expect(displayName).toBe('Initiated');
        });

        it('should get display name for SUBMITTED status', function() {
            var displayName = RequisitionStatus.$getDisplayName('SUBMITTED');

            expect(displayName).toBe('Submitted');
        });

        it('should get display name for AUTHORIZED status', function() {
            var displayName = RequisitionStatus.$getDisplayName('AUTHORIZED');

            expect(displayName).toBe('Authorized');
        });

        it('should get display name for IN_APPROVAL status', function() {
            var displayName = RequisitionStatus.$getDisplayName('IN_APPROVAL');

            expect(displayName).toBe('In approval');
        });

        it('should get display name for APPROVED status', function() {
            var displayName = RequisitionStatus.$getDisplayName('APPROVED');

            expect(displayName).toBe('Approved');
        });

        it('should get display name for RELEASED status', function() {
            var displayName = RequisitionStatus.$getDisplayName('RELEASED');

            expect(displayName).toBe('Released');
        });

        it('should get display name for SKIPPED status', function() {
            var displayName = RequisitionStatus.$getDisplayName('SKIPPED');

            expect(displayName).toBe('Skipped');
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
