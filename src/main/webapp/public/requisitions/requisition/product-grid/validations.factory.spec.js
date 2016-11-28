
ddescribe('validations', function() {

    var validations, messageService;

    beforeEach(module('openlmis.requisitions'));

    beforeEach(inject(function(_validations_, _messageService_) {
        validations = _validations_;
        messageService = _messageService_;

        spyOn(messageService, 'get').andCallFake(function(str){
            return str;
        });
    }));

    it('should return "negative" error message when value is negative', function() {

        validations.nonNegative(-1);
        expect(messageService.get).toHaveBeenCalledWith('error.negative');

    });

    it('should return "required" error message when value is blank', function() {

        validations.nonEmpty("");
        expect(messageService.get).toHaveBeenCalledWith('error.required');

    });

    it('should pass validation when value is non negative', function() {

        validations.nonNegative(0);
        expect(messageService.get).not.toHaveBeenCalled();

    });

    it('should pass validation when value is not empty', function() {

        validations.nonEmpty(2);
        expect(messageService.get).not.toHaveBeenCalled();

    });

    it('validates if method set property is non-empty', function(){

        var checkPropertyFoo = validations.nonEmptyIfPropertyIsSet('foo');

        expect(checkPropertyFoo("",{})).toBe(undefined);
        expect(checkPropertyFoo("bar",{foo:"something"})).toBe(undefined);
        expect(checkPropertyFoo("",{foo:"something"})).toBe('error.required');

        var checkPropertyBar = validations.nonEmptyIfPropertyIsSet('bar');
        expect(checkPropertyBar("",{})).toBe(undefined);
        expect(checkPropertyBar("foo",{bar:"something"})).toBe(undefined);
        expect(checkPropertyBar("",{bar:"something"})).toBe('error.required');
    });

    it('validates a calculation was performed correctly', function(){
        // will take a calculation
        function addFooToBar(obj){
            return obj.foo + obj.bar; 
        }

        var checkCalculationFooBar = validations.validateCalculation(addFooToBar);

        var item = {
            foo: 1,
            bar: 1
        };

        expect(checkCalculationFooBar(2, item)).toBe(undefined);
        expect(checkCalculationFooBar(7, item)).toBe('error.wrongCalculation');

        item.bar = 2;
        expect(checkCalculationFooBar(2, item)).toBe('error.wrongCalculation');        
        expect(checkCalculationFooBar(3, item)).toBe(undefined);
    });

});
