
describe('validationFactory', function() {

    var validationFactory, messageService;

    beforeEach(module('requisition-validation'));

    beforeEach(inject(function(_validationFactory_, _messageService_) {
        validationFactory = _validationFactory_;
        messageService = _messageService_;

        spyOn(messageService, 'get').andCallFake(function(str){
            return str;
        });
    }));

    it('should perform validation for negative values correctly', function() {

        expect(validationFactory.nonNegative(-1)).toBe('error.negative');
        expect(validationFactory.nonNegative(0)).toBeUndefined();
        expect(validationFactory.nonNegative(1)).toBeUndefined();

    });

    it('should perform validation for blank values correctly', function() {

        expect(validationFactory.nonEmpty("")).toBe('error.required');
        expect(validationFactory.nonEmpty(null)).toBe('error.required');
        expect(validationFactory.nonEmpty(2)).toBeUndefined();
        expect(validationFactory.nonEmpty("some string")).toBeUndefined();

    });

    it('validates if method set property is non-empty', function(){

        var checkPropertyFoo = validationFactory.nonEmptyIfPropertyIsSet('foo');

        expect(checkPropertyFoo("",{})).toBe(undefined);
        expect(checkPropertyFoo("bar",{foo:"something"})).toBe(undefined);
        expect(checkPropertyFoo("",{foo:"something"})).toBe('error.required');

        var checkPropertyBar = validationFactory.nonEmptyIfPropertyIsSet('bar');
        expect(checkPropertyBar("",{})).toBe(undefined);
        expect(checkPropertyBar("foo",{bar:"something"})).toBe(undefined);
        expect(checkPropertyBar("",{bar:"something"})).toBe('error.required');
    });

    it('validates a calculation was performed correctly', function(){
        // will take a calculation
        function addFooToBar(obj){
            return obj.foo + obj.bar;
        }

        var checkCalculationFooBar = validationFactory.validateCalculation(addFooToBar);

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
