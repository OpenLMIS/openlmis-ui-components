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