
describe('validations', function() {

    var validations, messageService;

    beforeEach(module('openlmis.requisitions'));

    beforeEach(inject(function(_validations_, _messageService_) {
        validations = _validations_;
        messageService = _messageService_;

        spyOn(messageService, 'get').andCallFake(function(str){
            return str;
        });
    }));

    it('should perform validation for negative values correctly', function() {

        expect(validations.nonNegative(-1)).toBe('error.negative');
        expect(validations.nonNegative(0)).toBeUndefined();
        expect(validations.nonNegative(1)).toBeUndefined();

    });

    it('should perform validation for blank values correctly', function() {

        expect(validations.nonEmpty("")).toBe('error.required');
        expect(validations.nonEmpty(null)).toBe('error.required');
        expect(validations.nonEmpty(2)).toBeUndefined();
        expect(validations.nonEmpty("some string")).toBeUndefined();

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
