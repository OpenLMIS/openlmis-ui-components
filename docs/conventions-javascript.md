# UI Coding Conventions
This document describes the desired formatting to be used within the OpenLMIS-UI repositories. Many of the conventions are adapted from [John Papa's Angular V1 styleguide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md), [SMACSS by Jonathan Snook](https://smacss.com/), and [Jens Meiert's maintainability guide](https://meiert.com/en/blog/maintainability-guide/).

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

### Naming Convention
In general we follow the [John-Papa naming conventions](https://github.com/johnpapa/angular-styleguide/tree/master/a1#naming). Later sections go into specifics about how to name a specific file type, while this section focusses on general naming and file structure.

Generally, all file names should use the following format `specific-name.file-type.ext` where:
* `specific-name` is a dash-separated name for specific file-type
* `file-type` is the type of object that is being added (ie 'controller', 'service', or 'layout')
* `ext` is the extension of the file (ie '.js', '.scss')

Folder structure should aim to follow the [LIFT principal](https://github.com/johnpapa/angular-styleguide/tree/master/a1#application-structure-lift-principle) as closely as possible, with a couple extra notes:
* There should only be one *.module.js file per directory hiearchy
* Only consider creating a sub-directory if file names are long and repatitive, such that a sub-directory would improve meaning
*Each file type section below has specifics on their naming conventions*


## Javascript Guidelines
Almost everything in the OpenLMIS-UI is Javascript. These are general guidelines for how to write and test your code.

General conventions:
* All code should be within an [immedately invoked scope](https://github.com/johnpapa/angular-styleguide/tree/master/a1#iife)
* *ONLY ONE OBJECT PER FILE*
* Variable and function names should be written in camelCase
* All Angular object names should be written in CamelCase

### Documentation
To document the OpenLMIS-UI, we are using [ngDocs](https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation) built with [grunt-ngdocs.](https://www.npmjs.com/package/grunt-ngdocs) See individual object descriptions for specifics and examples of how to document that object type.

#### General rules
* any object's exposed methods or variables must be documented with ngDoc
* @ngdoc annotation specifies the type of thing being documented
* as 'Type' in documentation we should use:
 * Promise
 * Number
 * String
 * Boolean
 * Object
 * Event
 * Array
 * Scope
 * in some cases is allowed to use other types i.e. class names like Requisition
* all description blocks should be sentence based, all of sentences should start with uppercase letter and end with '.'
* before and after description block (if there is more content) there should be an empty line
* all docs should be right above the declaration of method/property/component
* when writing param/return section please keep all parts(type, parameter name, description) start at the same column as it is shown in method/property examples below
* please keep the order of all parameters as it is in examples below

#### General Object Documentation
Regardless of the actual component's type, it should have '@ngdoc service' annotation at the start, unless the specific object documentation says otherwise. There are three annotations that must be present:
* ngdoc definition
* component name
* and description
```
/**
 * @ngdoc service
 * @name module-name.componentName
 *
 * @description
 * Component description.
 */
```

#### Methods
Methods for all components should have parameters like in the following example:
```
/**
 * @ngdoc method
 * @methodOf module-name.componentName
 * @name methodName
 *
 * @description
 * Method description.
 *
 * @param  {Type} paramsName1 param1 description
 * @param  {Type} paramsName2 (optional) param2 description
 * @return {Type}             returned object description
 */
```

Parameters should only be present when method takes any. The same rule applies to return annotation.
If the parameter is not required by method, it should have "(optional)" prefix in the description.

#### Properties
Properties should be documented in components when they are exposed, i.e. controllers properties declared in 'vm'.
Properties should have parameters like in the following example:
```
/**
 * @ngdoc property
 * @propertyOf module-name.componentName
 * @name propertyName
 * @type {Type}
 *
 * @description
 * Property description.
 */
```


## Constants
Constants are Javascript variables that won't change but need to be resued between multiple objects within an Angular module. Using constants is important because it becomes possible to track an objects dependencies, rather than use variables set on the global scope.

It's also [useful to wrap 3rd party objects and libraries](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#vendor-globals) (like jQuery or bootbox) as an Angular constant. This is useful because the dependency is declared on the object. Another useful feature is that if the library or object isn't included, Angualr will throw a single verbose error message.

*Add rule about when its ok to add a group of constants -- if a grouping of values, use a plural name*

*Conventions:*
* All constant variable names should be upper case and use underscores instead of spaces (ie VARIABLE_NAME)
* If a constant is only relivant to a single Angular object, set it as a variable inside the scope, not as an Angular constant
* If the constant value needs to change depending on build variables, format the value like @@VARIABLE_VALUE, and which should be replaced by the grunt build process if there is a matching value
* Wrap 3rd party services as constants, if are not already registered with Angular

### Replaced Values
@@ should set own default values

## Factory
Factories should be the most used Angular object type in any application. [John Papa insists that factories serve a single purpose](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#factories) and should be extended by variabled they are called with.

This means that factories should generally return a function that will return an object or set of objects that can be manipulated. It is common for a factory to include methods for interacting with a server, but this isn't necessary.

_Should be used with UI-Router resolves, and get additional arguments_

### Naming Convention
_**specificName**Factory_

Factories should always be named lowercase camelCase. To avoid confussion between created objects and factories, all factories should have the word'Factory' appended to the end (this disagrees with John-Papa style).  

### Example

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
* Exercise the produced object, not just the callback function

## Interceptor
This section is about events and messages, and how to modify them.

HTTP Interceptors are technically factories that have been configured to 'intercept' certain types of requests in Angular and modify their behavior. This is recommended because other Angular objects can use consistent Angular objects, reducing the need to write code that is specialized for our own framework.

*Keep all objects in a single file - so its easier to understand the actions that are being taken*

The Angular guide to writting [HTTP Interceptors is here](https://docs.angularjs.org/api/ng/service/$http#interceptors)

### General Conventions
* Write interceptors so they only chanage a request on certain conditions, so other unit tests don't have to be modified for the interceptors conditions
* Don't include HTTP Interceptors in openlmis-core, as the interceptor might be injected into all other unit tests — which could break everything

### Unit Testing Conventions
The goal when unit testing an interceptor is to not only test input and output transformation functions, but to also make sure the interceptor is called at an appropriate time.

## Javascript Class
Put all direct business logic in a pure javascript class.

Pure javascript classes should only be used to ease the manipulation of data, but unlike factories, these object shouldn't create HTTP connections, and only focus on a single object.

Javascript classes should be injected and used within factories and _some services_ services that have complex logic. Modules should be able to extend javascript classes by prototypical inheritance.

Helps with code reusability

Requisition/LineItem is good example

### Naming Conventions
_SampleName_

Classes should be uppercase CamelCased, which represents that they are a class and need to be instantiated like an object (ie `new SampleName()`).

## Routes
Routing logic is defined by [UI-Router,](https://ui-router.github.io/ng1/) where a URL path is typically paired with an HTML View and Controller.

*Use a factory where possible to keep resolve statements small and testable*

### General Conventions
* The [UI-Router resolve properties](https://github.com/angular-ui/ui-router/wiki#resolve) are used to ease loading on router
* [Routes should define their own views,](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#style-y271) if their layout is more complicated than a single section

## Service
[John Papa refers to services as Singletons](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#services), which means they should only be used for application information that has a single instance. Examples of this would include the current user, the application's connection state, or the current library of localization messages.

### Conventions
* Services should always return an object
* Services shouldn't have their state changed through properties, only method calls

### Naming Convention

_**nameOfService**Service_

Always lowercase camelCase the name of the object. Append 'Service' to the end of the service name so developers will know the object is a service, and changes will be persisted to other controllers.

### Unit Testing Conventions
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
