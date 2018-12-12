# Performance
The OpenLMIS-UI is a large application that will be running in a web browser
with less RAM and processing power than your computer. This is a fair
statement, because if you are reading this, you are probably a developer.

This set of conventions is about detecting, diagnosing, and fixing common
performance issues that have been a problem in the OpenLMIS-UI.

## Blocking the DOM
Use asynchronous Javascript (promises) so you don't block the thread. This will
cause web browers to think the OpenLMIS-UI is crashing, and it will try to close
the browser tab.

## Memory Leaks
This one is a bit tricky. It's fairly hard to create a memory leak in
AngularJS unless you're mixing
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

## Anti-patterns
Here are some anti-pattern that you should avoid and how to fix them.

### Event handlers using scope
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