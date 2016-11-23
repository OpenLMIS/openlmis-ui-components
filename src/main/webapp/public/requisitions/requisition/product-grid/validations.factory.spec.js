
describe('validations', function() {

    var validations, messageService;

    beforeEach(module('openlmis.requisitions'));

    beforeEach(inject(function(_validations_, _messageService_) {
        validations = _validations_;
        messageService = _messageService_;
    }));

    it('should return "negative" error message when value is negative', function() {

        spyOn(messageService, 'get');
        validations.nonNegative(-1);
        expect(messageService.get).toHaveBeenCalledWith('error.negative');

    });

    it('should return "required" error message when value is blank', function() {

        spyOn(messageService, 'get');
        validations.nonEmpty("");
        expect(messageService.get).toHaveBeenCalledWith('error.required');

    });

    it('should pass validation when value is non negative', function() {

        spyOn(messageService, 'get');
        validations.nonNegative(0);
        expect(messageService.get).not.toHaveBeenCalled();

    });

    it('should pass validation when value is not empty', function() {

        spyOn(messageService, 'get');
        validations.nonEmpty(2);
        expect(messageService.get).not.toHaveBeenCalled();

    });

});
