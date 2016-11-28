
describe('ValidationFactory', function() {

    var validationFactory, messageService;

    beforeEach(module('openlmis.requisitions'));

    beforeEach(inject(function(ValidationFactory, _messageService_) {
        validationFactory = ValidationFactory;
        messageService = _messageService_;
    }));

    it('should return "negative" error message when value is negative', function() {

        spyOn(messageService, 'get');
        validationFactory.nonNegative(-1);
        expect(messageService.get).toHaveBeenCalledWith('error.negative');

    });

    it('should return "required" error message when value is blank', function() {

        spyOn(messageService, 'get');
        validationFactory.nonEmpty("");
        expect(messageService.get).toHaveBeenCalledWith('error.required');

    });

    it('should pass validation when value is non negative', function() {

        spyOn(messageService, 'get');
        validationFactory.nonNegative(0);
        expect(messageService.get).not.toHaveBeenCalled();

    });

    it('should pass validation when value is not empty', function() {

        spyOn(messageService, 'get');
        validationFactory.nonEmpty(2);
        expect(messageService.get).not.toHaveBeenCalled();

    });

});