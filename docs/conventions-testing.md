## Unit Testing Guidelines
A unit tests has 3 goals that it should accomplish to test a javascript object:
* Checks success, error, and edge cases
* Tests as few objects as possible
* Demonstrates how an object should be used

With those 3 goals in mind, its important to realize that the variety of AngularJS object types means that the same approach won't work for each and every object. Since the OpenLMIS-UI coding conventions layout patterns for different types of AngularJS objects, it's also possible to illustrate how to unit test objects that follow those conventions.

Check out [AngularJS's unit testing guide](https://docs.angularjs.org/guide/unit-testing), its well written and many of out tests follow their styles.

Here are some general rules to keep in mind while writing any unit tests:
* Keep beforeEach statements short and to the point, which will help other's read your statements
* Understand how to use [Spies in Jasmine,](https://jasmine.github.io/1.3/introduction.html#section-Spies) they can help isolate objects and provide test cases

### Defining variables

The version of Jasmine we're using discourages using the define-block scoped variables as they might be causing memory leaks. In order to prevent that, it is suggested to use 'this' as a way of sharing variables between beforeEach, afterEach, inject and it blocks. Keep in mind that closures inside those block will have a different context and thus 'this' will refer to a different object. Below are two examples on how to and how to not write unit tests for OpenLMIS.

#### Do

```Javascript
describe('CustomResource', function() {

    beforeEach(function() {
        module('custom');

        inject(function($injector) {
            this.subjectUnderTest = $injector.get('subjectUnderTest');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.expected = 'expectedString';
    });

    describe('returnSomething', function() {

        beforeEach(function() {
            this.subjectUnderTest.prepareForTest();
        });

        it('should return something', function() {
            var result;
            this.subjectUnderTest.returnSomething()
                .then(function(something) {
                    result = something;
                    //this.subjectUnderTest won't be available as we have a different context here
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.expected)
        });

    });

    afterEach(function() {
        this.subjectUnderTest.clearAfterTest();
    });

});
```

#### Don't

```Javascript
describe('CustomResource', function() {

    var expected, subjectUnderTest, $rootScope;

    beforeEach(function() {
        module('custom');

        inject(function($injector) {
            subjectUnderTest = $injector.get('subjectUnderTest');
            $rootScope = $injector.get('$rootScope');
        });

        expected = 'expectedString';
    });

    describe('returnSomething', function() {

        beforeEach(function() {
            subjectUnderTest.prepareForTest();
        });

        it('should return something', function() {
            var result;
            subjectUnderTest.returnSomething()
                .then(function(something) {
                    result = something;
                });
            $rootScope.$apply();

            expect(result).toEqual(expected)
        });

    });

    afterEach(function() {
        this.subjectUnderTest.clearAfterTest();
    });

});
```