# AngularJS Conventions
This document accompanies the UI Coding Conventions. It gives specific guidance for AngularJS modules, controllers, directives, and filters.

## Modules
Modules in angular should describe and bind together a small unit of functionality. The OpenLMIS-UI build process should construct larger module units from theses small units.

### Documentation
Docs for modules must contain the module name and description. This should be thought of as an overview for the other objects within the module, and where appropriate gives an overview of how the modules fit together.
```
/**
 * @module module-name
 *
 * @description
 * Some module description.
 */
```


## Controller
Controllers are all about connecting data and logic from Factories and Services to HTML Views. An ideal controller won't do much more than this, and will be as 'thin' as possible.

Controllers are typically specific in context, so as a rule controllers should never be reused. A controller can be linked to a HTML form, which might be reused in multiple contexts — but that controller most likely wouldn't be applicable in other places.

It is also worth noting that [John Papa insists that controllers don't directly manipulate properties](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#controllers) in $scope, but rather the [ControllerAs](https://docs.angularjs.org/api/ng/directive/ngController) syntax should be used which injects the controller into a HTML block's context. The main rationale is that it makes the $scope variables less cluttered, and makes the controller more testable as an object.

### Conventions
* Should be only object changing application $state
* Is used in a single context
* Don't use the $scope variable EVER
* Use ControllerAs syntax
* Don't $watch variables, use on-change or refactor to use a directive to watch values

### Unit Testing
* Set all items that would be required from a route when the Controller is instantiated
* Mock any services used by the controller

### Documentation
The only difference between controllers and other components is the
'.controller:' part in the @name annotation. It makes controller documentation
appear in controllers section. Be sure to document the methods and properties
that the controller exposes.

```
/**
 * @ngdoc service
 * @name module-name.controller:controllerName
 *
 * @description
 * Controller description.
 *
 */
```


## Directive
Directives are pieces of HTML markup that have been extended to do a certain function. *This is the only place where it is reasonable to manipulate the DOM*.

*Make disticntion between directive and component -- components use E tag and isolate scope, directive use C and never isolate scope*

### Conventions
* Restrict directives to only elements or attributes
* Don't use an isolated scope unless you absolutely have to
* If the directive needs extenal information, use a controller — don't manipulate data in a link function

### Unit Testing
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

### Documentation
Directive docs should have well described '@example' section. 

Directive docs should always have '@restrict' annotation that takes as a value one of: A, E, C, M or any combination of those.
In order to make directive docs appear in directives section there needs to be '.directive:' part in @name annotation.

```
/**
 * @ngdoc directive
 * @restrict A
 * @name module-name.directive:directiveName
 *
 * @description
 * Directive description.
 *
 * @example
 * Short description of how to use it.
 * ```
 *   <div directiveName></div>
 * ```
 * Now you can show how the markup will look like after applying directive code.
 * ```
 * <div directiveName>
 *     <div>something</div>
 * </div>
 * ```
 */
```

### Extending a Directive
You can extend a directive by using AngularJS's decorator pattern. Keep in mind that a directive might be applied to multiple places or have multiple directives applied to the same element name.

```Javascript
angular.module('my-module')
    .config(extendDirective);

extendDirective.$inject = ['$provide'];
function extendDirective($provide) {
  
  // NOTE: This method has you put 'Directive' at the end of a directive name
  $provide.decorator('OpenlmisInvalidDirective', directiveDecorator);
}

directiveDecorator.$inject = ['$delegate'];
function directiveDecorator($delegate) {
  var directive = $delegate[0], // directives are returned as an array
      originalLink = directive.link;

  directive.link = function(scope, element, attrs) {
    // do something
    originalLink.apply(directive, arguments); // do the original thing
    // do something after
  }

  return $delegate;
}

```


## Filters
Use an AngularJS filter if:
- You need to do complex formatting
- You need to render value in HTML, and it doesn't make sense to include in a controller.

### Documentation
Filter docs should follow the pattern from example below:
```
/**
 * @ngdoc filter
 * @name module-name.filter:filterName
 *
 * @description
 * Filter description.
 *
 * @param   {Type} input     input description
 * @param   {Type} parameter parameter description
 * @return  {Type}           returned value description
 *
 * @example
 * You could have short description of what example is about etc.
 * ```
 * <div>{{valueToBeFiltered | filterName:parameter}}</div>
 * ```
 */
```

It is a good practice to add example block at the end to make clear how to use it.
As for parameters the first one should be describing input of the filter.
Please remember of '.filter:' part. It will make sure that this one will appear in filters section.
