# OpenLMIS-UI Coding Conventions

This document describes the desired formatting to be used withing the OpenLMIS-UI repositories, many of the conventions are adapted from [John Papa's Angular V1 styleguide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md) and [SMACSS by Jonathan Snook.](https://smacss.com/)

## General
The following conventions should be applied to all sections of UI development:
* All intentation should be 4 spaces
* Legacy code should be refactored to meet coding conventions
* No thrid party libraries should be included in a OpenLMIS-UI repository

## File Structure
All file types should be organized together within the `src` directory according to functionality, not file type — the goal is to keep related files together.

Use the following conventions:
* File names are lowercase and dash-seperated
* Files in a directory should be as flat as possible (avoid sub-directories)
* If there are more than 12 files in a directory, try to divide files into subdirectories based on functional area

*Each file type section below has specifics on their naming conventions*

## HTML Markup Guidelines

Less markup is better markup, and semantic markup is the best.

This means we want to avoid creating layout specific markup that defines elements such as columns or icons. Non-semantic markup can be replicated by using CSS to create columns or icons. In some cases a layout might not be possible without CSS styles that are not supported across all of our supported browsers, which is perfectly acceptiable.

Here is a common pattern for HTML that you will see used in frameworks like Twitter's Bootstrap (which we also use)
```
<li class="row">
	<div class="col-md-9">
		Item Name
	</div>
	<div class="col-md-3">
		<a href="#" class="btn btn-primary btn-block">
			<i class="icon icon-trash"></i>
			Delete
		</a>
	</div>
</li>
<div class="clearfix"></div>
```

The above markup should be simplified to:
```
<li>
	Item Name
	<button class="trash">Delete</button>
</li>
```
This gives us simpler markup, that could be restyled and reused depending on the context that the HTML section is inserted into. We can recreate the styles applied to the markup with CSS such as:
* A ::before pseudo class to display an icon in the button
* Using float and width properties to correctly display the button
* A ::after pseudo class can replace any 'clearfix' element (which shouldn't exist in our code)

See the UI-Styleguide for examples of how specific elements and components should should be constructed and used.

### Naming Convention
In general we follow the [John-Papa naming conventions,](https://github.com/johnpapa/angular-styleguide/tree/master/a1#naming) later sections go into specifics about how to name a specific file type, while this section focuses on general naming and file structure.

Generally, all file names should use the following format `specific-name.file-type.ext` where:
* `specific-name` is a dash-separated name for specific file-type
* `file-type` is the type of object that is being added (ie 'controller', 'service', or 'layout')
* `ext` is the extention of the file (ie '.js', '.scss')

Folder structure should aim to follow the [LIFT principal](https://github.com/johnpapa/angular-styleguide/tree/master/a1#application-structure-lift-principle) as closely as possible, with a couple extra notes:
* There should only be one *.module.js file per directory hiearchy
* Only consider creating a sub-directory if file names are long and repatitive, such that a sub-directory would improve meaning

## SASS & CSS Formatting Guidelines

General SASS and CSS conventions:
* Only enter color values in a variables file
* Only enter pixel or point values in a variables file
* Variable names should be lowercase and use dashes instead of spaces (ie: _$sample-variable_)
* Avoid class names in favor of child element selectors where ever possible
* Files should be less than 200 lines long
* CSS class names should be lowercase and use dashes instead of spaces

### SMACSS
The CSS styles should reflect the SMACSS CSS methodology, which has 3 main sections — base, layout, and module. SMACSS has other sections and tennants, which are useful, but are not reflected in the OpenLMIS-UI coding conventions.

#### Base
CSS styles applied directly to elements to create styles that are the same throughout the application.

#### Layout
CSS styles that are related primarly to layout in a page — think position and margin, not color and padding — these styles should never be mixed with base styles (responsive CSS should only be implemented in layout).

#### Module
This is a css class that will modify base and layout styles for an element and it's sub-elements.

### SASS File-Types
Since SASS pre-processes CSS, there are 3 SCSS file types to be aware of which are processed in a specific order to make sure the build process works correctly.

#### Variables
A variable file is either named 'variables.scss' or matches '*.variables.scss'

Varriables files are the first loaded file type and include any variables that will be used through out the application — *There should be as few of these files as possible*.

The contents of a varriables file should only include SASS variables, and output no CSS at anypoint.

There is no assumed order in which varriables files will be included, which means:
* Varriable files shouldn't have overlapping varriables
* Implement [SASS's variable default (!default)](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#variable_defaults_)

### Mixins
A mixin file matches the following pattern *.mixin.scss

Mixins in SASS are reusable functions, which are loaded second in our build process so they can use global variables and be used in any other SCSS file.

There should only be one mixin per file, and the file name should match the function's name, ie: 'simple-function.mixin.scss'

### All Other SCSS and CSS Files
All files that match '*.scss' or '*.css' are loaded at the same time in the build process. This means that no single file can easily overwrite another files CSS styles unless the style is more specific or uses `!imporant` — This creates the following conventions:
* Keep CSS selectors as general as possible (to allow others to be more specific)
* Avoid using !important

To keep file sizes small, consider breaking up files according to SMACSS guidelines by adding the type of classes in the file before .scss or .css (ie: `navigation.layout.scss`)

## Javascript Formatting Guidelines

General conventions:
* All code should be within an [immedately invoked scope](https://github.com/johnpapa/angular-styleguide/tree/master/a1#iife)
* *ONLY ONE OBJECT PER FILE*
* Variable and function names should be written in camelCase
* All Angular object names should be written in CamelCase

### Documentation
To document the OpenLMIS-UI, we are using [ngDocs](https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation) built with [grunt-ngdocs.](https://www.npmjs.com/package/grunt-ngdocs)

* Any object's exposed methods or variables must be documented with ngDoc

### Unit Testing Guidelines
A unit tests has 3 goals that it should accomplish to test a javascript object:
* Checks success, error, and edge cases
* Tests as few objects as possible
* Demonstrates how an object should be used

With those 3 goals in mind, its important to realize that the variety of AngularJS object types means that the same approact won't work for each and every object. Since the OpenLMIS-UI coding conventions layout patterns for different types of AngularJS objects, it's also possible to illustrate how to unit test objects that follow those conventions.

Check out [AngularJS's unit testing guide](https://docs.angularjs.org/guide/unit-testing), its well written and many of out tests follow their styles.

Here are some general rules to keep in mind while writing any unit tests:
* Keep beforeEach statements short and to the point, which will help other's read your statements
* Understand how to use [Spies in Jasmine,](https://jasmine.github.io/1.3/introduction.html#section-Spies) they can help isolate objects and provide test cases

### Angular V1 Object Guidelines
AngularJS has many different object types — here are the following types the OpenLMIS-UI primarily uses. If there is a need for object types not documented, please refer to the John Papa Angular V1 styleguide.

### Replaced Values
@@ should set own default values

#### Constants
Constants are Javascript variables that won't change but need to be resued between multiple objects within an Angular module. Using constants is important because it becomes possible to track an objects dependencies, rather than use variables set on the global scope.

It's also [useful to wrap 3rd party objects and libraries](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#vendor-globals) (like jQuery or bootbox) as an Angular constant. This is useful because the dependency is declared on the object. Another useful feature is that if the library or object isn't included, Angualr will throw a single verbose error message.

*Add rule about when its ok to add a group of constants -- if a grouping of values, use a plural name*

*Conventions:*
* All constant variable names should be upper case and use underscores instead of spaces (ie VARIABLE_NAME)
* If a constant is only relivant to a single Angular object, set it as a variable inside the scope, not as an Angular constant
* If the constant value needs to change depending on build variables, format the value like @@VARIABLE_VALUE, and which should be replaced by the grunt build process if there is a matching value
* Wrap 3rd party services as constants, if are not already registered with Angular

#### Service
[John Papa refers to services as Singletons,](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#services) which means they should only be used for application information that has a single instance. Examples of this would include the current user, the application's connection state, or the current library of localization messages.

##### Conventions
* Services should always return an object
* Services shouldn't have their state changed through properties, only method calls

###### Naming Convention

_**nameOfService**Service_

Always lowercase camelCase the name of the object. Append 'Service' to the end of the service name so developers will know the object is a service, and changes will be persisted to other controllers.

###### Unit Testing Conventions
* Keep $httpBackend mock statements close to the specific places they are used (unless the statement is reusable)
* Use Jasmine's spyOn method to mock the methods of other objects that are used
* In some cases mocking an entire AngularJS Service, or a constant, will be required. This is possible by using [AngularJS's $provide object](https://docs.angularjs.org/api/auto/service/$provide) within a beforeEach block. This would look like

```
beforeEach(module($provide){
	// mock out a tape recorder service, which is used else where
	tape = jasmine.createSpyObj('tape', ['play', 'pause', 'stop', 'rewind']);

	// overwrite an existing service
	$provide.service('TapeRecorderService', function(){
		return tape;
	});
});
```

#### Factory
Factories should be the most used Angualr object type in any application. [John Papa insists that factories serve a single purpose,](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#factories) and should be extended by variabled they are called with.

This means that factories should generally return a function that will return an object or set of objects that can be manipulated. It is common for a factory to include methods for interacting with a server, but this isn't nessicarry.

_Should be used with UI-Router resolves, and get additional arguments_

##### Naming Convention
_**specificName**Factory_

Factories should always be named lowercase camelCase. To avoid confussion between created objects and factories, all factories should have the word'Factory' appended to the end (this disagrees with John-Papa style).  

##### Example

```
angular.module('openlmis-sample')
    .factory('sampleFactory', sample);

sample.$inject = [];
function sample(){
	var savedContext;

	return {
		method: method,
		otherMethod: otherMethod
	}
}
```

*Unit Testing Conventions*
Test a factory much like you would test a service, except be sure to:
* Declare a new factory at the start of every test
* Exercise the producted object, not just the callback function

#### Javascript Class
Pure javascript classes should only be used to ease the manipulation of data, but unlike factories, these object shouldn't create HTTP connections, and only focus on a single object.

Javascript classes should be injected and used within factories and _some services_ services that have complex logic. Modules should be able to extend javascript classes by prototypical inheritance.

Helps with code reusability

Requisition/LineItem is good example

##### Naming Conventions
_SampleName_

Classes should be uppercase CamelCased, which represents that they are a class and need to be instantiated like an object (ie `new SampleName()`).

#### Controller
Controllers are all about connecting data and logic from Factories and Services to HTML Views. An ideal controller won't do much more than this, and will be as 'thin' as possible.

Controllers are typically specific in context, so as a rule controllers should never be reused. A controller can be linked to a HTML form, which might be reused in multiple contexts — but that controller most likely wouldn't be applicable in other places.

It is also worth noting that [John Papa insists that controllers don't directly manipulate properties](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#controllers) in $scope, but rather the [ControllerAs](https://docs.angularjs.org/api/ng/directive/ngController) syntax should be used which injects the controller into a HTML block's context. The main rationale is that it makes the $scope variables less cluttered, and makes the controller more testable as an object.

##### Conventions
* Should be only object changing application $state
* Is used in a single context
* Don't use the $scope variable EVER
* Use ControllerAs syntax
* Don't $watch variables, use on-change or refactor to use a directive to watch values

###### Unit Testing Conventions
* Set all items that would be required from a route when the Controller is instantiated
* Mock any services used by the controller

#### Routes
Routing logic is defined by [UI-Router,](https://ui-router.github.io/ng1/) where a URL path is typically paired with an HTML View and Controller.

*Use a factory where possible to keep resolve statements small and testable*

##### General Conventions
* The [UI-Router resolve properties](https://github.com/angular-ui/ui-router/wiki#resolve) are used to ease loading on router
* [Routes should define their own views,](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#style-y271) if their layout is more complicated than a single section

#### HTTP Interceptor
HTTP Interceptors are technically factories that have been configured to 'intercept' certain types of requests in Angular and modify their behavior. This is recommended because other Angular objects can use consistent Angular objects, reducing the need to write code that is specialized for our own framework.

*Keep all objects in a single file - so its easier to understand the actions that are being taken*

The Angular guide to writting [HTTP Interceptors is here](https://docs.angularjs.org/api/ng/service/$http#interceptors)

##### General Conventions
* Write interceptors so they only chanage a request on certain conditions, so other unit tests don't have to be modified for the interceptors conditions
* Don't include HTTP Interceptors in openlmis-core, as the interceptor might be injected into all other unit tests — which could break everything

###### Unit Testing Conventions
The goal when unit testing an interceptor is to not only test input and output transformation functions, but to also make sure the interceptor is called at an appropriate time.

#### Directive
Directives are pieces of HTML markup that have been extended to do a certain function. *This is the only place where it is reasonable to manipulate the DOM*.

*Make disticntion between directive and component -- components use E tag and isolate scope, directive use C and never isolate scope*

##### Conventions
* Restrict directives to only elements or attributes
* Don't use an isolated scope unless you absolutely have to
* If the directive needs extenal information, use a controller — don't manipulate data in a link function

##### Unit Testing
The bit secrect when unit testing a directive is to make sure to use the $compile function to return an element that is extended with jQuery. Once you have this object you will be able to interact with the directive by clicking, hovering, or triggering other DOM events.

```
describe('SampleDirective', function(){
	it('gets compiled and shows the selected item name', function($compile, $rootScope){
		var scope = $rootScope.$new();
		scope['item'] = {
			name: "Sample Title"
		};
		var element = $compile("<sample-directive selected='item'></sample-directive>")(scope);

		expect(element.text()).toBe("Sample Title");
	});
	it('responds to being clicked', function($compile, $rootScope){
		var element = $compile("<sample-directive selected='item'></sample-directive>")($rootScope.$new());

		// check before the action
		expect(element.text()).toBe("No Title");

		element.click();
		// check to see the results of the action
		// this could also be looking at a spy to see what the values are
		expect(element.text()).toBe("I was clicked");
	});
});
```

#### Modal
A modal object isn't a 'native Angular object' — it is a service or factory that displays a modal window. This is done for convience and because it allows modal windows to not be declared in html files — and be used more easily by controllers (or even services, if appropriate).

*Use Javascript class*

##### Conventions

##### Unit Tests
When creating a unit test for a modal service, the unit tests should focus on event driven logic and avoid testing functionality that is tied to the DOM. Since we are using Bootbox to manage the creation of modal elements, we can mock Bootbox and trust the Bootbox will successfully interact with the DOM.

```
// Imagine testing a modal that will show an alert, and when closed will resolve a promise.
describe('SampleModal', function(){

	// Instead of doing a beforeEach (recommended), this example directly injects dependencies
	it('when closed will resolve promise', function($rootScope, SampleModal, bootbox){

		// Pull out the callback that will be passed to bootbox when the window closes
		var closeCallback;
		spyOn(bootbox, 'alert').andCallFake(function(argumentObject){
			closeCallback = argumentObject.callback;

			// Bootbox is supposed to return a jQuery element, which we will mock with an object
			return {};
		});

		// make a spy to track if the promise works
		var promiseSpy = createSpy();

		// Make the modal, and save the promise...
		var promise = SampleModal().then(promiseSpy);

		// If we check the promiseSpy immedately, it shouldn't have been
		// called because the closeCallback wasn't called...
		expect(promiseSpy).not.toHaveBeenCalled();

		// Call closeCallback, which is out mocked version of clicking the
		// "ok" button on the alert modal
		closeCallback();
		expect(promiseSpy).toHaveBeenCalled();
	});
});

```  

#### HTML Views
Angular allows HTML files to have variables and simple logic evaluated within the markup.

*A controller that has the same name will be the reference to vm, if the controller is different, don't call it vm*

*General Conventions*
* If there is logic that is more complicated than a single if statement, move that logic to a controller
* Use filters to format variable output — don't format variables in a controller

### Memory Leaks
This one is a bit tricky. It's fairly hard to create a memory leak in AngularJS unless you're mixing
it with other external libraries that are not based on AngularJS(especially jQuery). Still, there
are some things you need to remember while working with it, this article provides some general
insight on how to find, fix and avoid memory leaks, for more detailed info I would suggest reading
[this article](http://www.dwmkerr.com/fixing-memory-leaks-in-angularjs-applications/)(it's awesome!).

### Finding memory leaks
I won't lie, finding out if your application has some memory leaks is annoying, and localizing those
leaks is even more annoying and can take a lot of time. Google Chrome devtools is incredible tool
for doing this. All you need to do is:

1. open you application
2. go to the section you want to check for memory leaks
3. execute the workflow you want to check for memory leaks so any service or cached data won't be
  shown on the heap snapshot
4. open devtools
5. go to the Profiles tab
6. select Take Heap Snapshot
7. take a snapshot
8. execute the workflow
9. take a snapshot again
10. go to a different state
11. take a snapshot again
12. select the last snapshot
13. now click on the All objects select and choose Objects allocated between Snapshot 1 and Snapshot
	2

This will show you the list of all objects, elements and so on, that were created during the workflow
and are still residing in the memory. That was the easy part. Now we need to analyze the data we
have and this might be quite tricky. We can click on object to see what dependency is retaining them.
There is some color coding here that can be useful to you - red for detached elements and yellow for
actual code references which you can inspect and see. It takes some time and experience to
understand what's going here but it gets easier and easier as you go.

### Anti-patterns
Here are some anti-pattern that you should avoid and how to fix them.

#### Event handlers using scope
Let's look at the following example. We have a simple directive that binds an on click action to the
element.
```
(function() {

	'use strict';

	angular
		.module('some-module')
		.directive('someDirective', someDirective);

	function someDirective() {
		var directive = {
			link: link
		};
		return directive;

        function link(scope, element) {

			element.on('click', onClick);

			function onClick() {
				scope.someFlag = true;
			}
        }
	}

})();
```
The problem with this link function is that we've created a closure with context which retains the
context, the scope and "then basically everything in the universe" until we unregister the handler
from the element. That's right, even after the element is removed from the DOM it will still reside
in the memory retained by the closure unless unregister the handler. To do this we need to add a
handler for '$destroy' event to the scope object and then unregister the handler from the element.
Here's an example how to do it.

```
(function() {

	'use strict';

	angular
		.module('some-module')
		.directive('someDirective', someDirective);

	function someDirective() {
		var directive = {
			link: link
		};
		return directive;

        function link(scope, element) {

			element.on('click', onClick);

			scope.$on('$destroy', function() {

				//this will unregister the this single handler
				element.off('click', onClick);

				//this will unregister all the handlers
				element.off();
			});


			function onClick() {
				scope.someFlag = true;
			}
        }
	}

})();
```

### Improper use of the $rootScope.$watch method
$rootScope.$watch can be a powerful tool, but it also requires some experience to use right. It
allows the developers to create watchers that live through the whole application life and are only
removed when they are explicitly said to unregister or when the application is closed, which may
result in a huge memory leaks. Here are some tips on how to use them.
* Use $scope.$watch when possible!
	If you're using a watcher in a directive, it will have access to the scope object, add the
	watcher to it! This way we take advantage of AngularJS automatic watcher unregistration when the
	scope is deleted.
* Avoid using $rootScope.$watch in factories.
	Don't use it in factories unless you're completely sure what you're doing. Remember to
	unregister it when it is no longer needed! This takes us to the next bullet point.
* Use them in Services.
	Watching for current locale can be great example of that. We're using it with service, which is
	a singleton - it is only created once during application lifetime - and we want to watch for the
	current locale all the time we rather won't want to stop at any point.
* Unregister it if it is no longer needed.
	If you're sure you won't be needing that watcher any longer simply unregister it! Here's an
	example
	```
	var unregisterWatcher = $rootScope.$watch('someVariable', someMethod);
	unregisterWatcher();
	```

### Using callback functions
Using callback isn't the safest idea either as it can cause some function retention. AngularJS gives
us awesome tool to bypass that - promises. They basically gives us the same behavior and are
retention-risk free!

## Patterns
See JS Documentation for more details

### List View Pattern

#### Pagination Patterns
STUB
#### Sorting Pattern
STUB

### Offline Pattern
