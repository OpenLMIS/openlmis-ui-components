# Developer Toolkit

Over the years of working on OpenLMIS the team have created several utilities that can be used in order to faster develop new features. The utilities covers basic things like communicating with the backend server, mapping objects, extending classes and operating on arrays.

Index
* [classExtender](#classextender)
* [modalStateProvider](#modalstateprovider)
* [OpenlmisResource](#openlmisresource)
* [OpenlmisRepository](#openlmisrepository)
* [OpenlmisRepositoryImpl](#openlmisrepositoryimpl)

## classExtender

Base of the class extension functionality. All it does is hiding some utility lines that would otherwise be repeated when extending prototype. This utility was created in order to make migration to ES6 easier. An example can be seen at [UI Coding Conventions -> Class -> Extending classes](conventions-javascript.md#extending-classes)

## modalStateProvider

This utility lets you define a state that will be displayed as a modal in the same way you would define a regular state using ui-router. The state definition is pretty much the same with just a slight differences that will be described in the following sections

### Usage

Below is a little example of how to define the module.

First of all, you need to add the 'openlmis-modal-state' module as a dependency:

```Javascript
//module-name.module.js
(function() {

    'use strict';

    /**
     * @module module-name
     *
     * @description
     * Example module.
     */
    angular.module('module-name', [
        'these',
        'are',
        'example',
        'modules',
        'openlmis-modal-state'
    ]);

})();
```

After adding the dependency you can use the modalStateProvider to define a state in a matter really similar to the regular stateProvider provided by ui-router.


```Javascript
//state.name.routes.js
(function() {

    'use strict';

    angular
        .module('module-name')
        .config(routes);

    routes.$inject = ['modalStateProvider'];

    function routes(modalStateProvider) {

        modalStateProvider.state('state.name', {
            url: '/stateUrl',
            templateUrl: 'module-name/template-name.html',
            controller: 'ControllerName',
            controllerAs: 'vm',
            resolve: {
                resolveOne: function() {
                    //do something
                    return result;
                },
                resolveTwo: function() {
                    //do something different
                    return result;
                }
            }
        });

    }

})();
```

##

### Using parent resolves

Let's say we have the following state:

```Javascript
//parent-state.routes.js
(function() {

    'use strict';

    angular
        .module('module-name')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('parentState', {
            url: '/stateUrl',
            templateUrl: 'module-name/parent-state-template.html',
            controller: 'ParentController',
            controllerAs: 'vm',
            resolve: {
                resolveOne: function() {
                    //do something
                    return result;
                },
                resolveTwo: function() {
                    //do something different
                    return result;
                }
            }
        });

    }

})();
```

We want to add a child state that will be distinguished by the URL and shown as a modal. We also want to access one of its resolved properties (resolveOne). This differs a little from how we would do it with ui-router (simply injecting in the controller) as we need to define a "parentResolves" property in the child state definition like this:

```Javascript
//child-state.routes.js
(function() {

    'use strict';

    angular
        .module('module-name')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('parentState.childState', {
            url: '/stateUrl',
            templateUrl: 'module-name/child-state-template.html',
            controller: 'ChildController',
            controllerAs: 'vm',
            resolve: {
                resolveTwo: function() {
                    //do something different
                    return result;
                }
            },
            //this is an Array so we can specify as many resolves as we want
            parentResolves: ['resolveOne']
        });

    }

})();
```

## OpenlmisResource

This piece is responsible for communicating with the RESTful API of the OpenLMIS backend server and it covers CRUD actions using the POST, GET, PUT and DELETE methods.

### Usage

First of all we need to add the module as a dependency:

```Javascript
//module-name.module.js
(function() {

    'use strict';

    /**
     * @module module-name
     *
     * @description
     * Example module.
     */
    angular.module('module-name', [
        'these',
        'are',
        'example',
        'modules',
        'openlmis-repository'
    ]);

})();
```

Using the class is as simple as this (remember to inject it):

```Javascript
new OpenlmisResource('/api/resourceName');
```

For information on the available methods, please refer to JSDocs of the class.

This approach is a little inefficient as it requires us to define the URI every time we want to communicate with the server. However, this is by design as, thanks to the classExtender, we can simply extend this class and create more specific resources. Here's an example on how to do it:

```Javascript
(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name custom.CustomResource
     *
     * @description
     * Communicates with the custom RESTful endpoint of the OpenLMIS server.
     */
    angular
        .module('custom')
        .factory('CustomResource', CustomResource);

    CustomResource.$inject = ['OpenlmisResource', 'classExtender'];

    function CustomResource(OpenlmisResource, classExtender) {

        classExtender.extend(CustomResource, OpenlmisResource);

        return CustomResource;

        function CustomResource() {
            this.super('/api/custom');
        }
    }

})();
```

Using the above approach we can simply do the following whenever we want to communicate with the specific resource.

```Javascript
new CustomResource();
```

### Using with non-paginated endpoints

Generally, most of our endpoints are paginated, but some of the older ones might use a different pattern for dealing with searching and simply return a list. The OpenlmisResource has the capabilities to deal with this
as well by using the config object when creating it. It can be achieved with the following code.

```Javascript
(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name old.OldResource
     *
     * @description
     * Communicates with the old RESTful endpoint of the OpenLMIS server.
     */
    angular
        .module('old')
        .factory('OldResource', OldResource);

    OldResource.$inject = ['OpenlmisResource', 'classExtender'];

    function OldResource(OpenlmisResource, classExtender) {

        classExtender.extend(OldResource, OpenlmisResource);

        return OldResource;

        function OldResource() {
            this.super('/api/old', {
                paginated: false
            });
        }
    }

})();
```

This will result in the resource not expecting the response to be a page, but a list instead.

### Handling unsupported actions

There are some cases that will result in some of the methods not being supported by the server and thus, ideally, we should get some feedback that this action is not supported. When we're extending our OpenlmisResource class we can use the following approach.

```Javascript
(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name non-editable.CustomResource
     *
     * @description
     * Communicates with the non-editable RESTful endpoint of the OpenLMIS server.
     */
    angular
        .module('non-editable')
        .factory('NonEditableResource', NonEditableResource);

    NonEditableResource.$inject = ['OpenlmisResource', 'classExtender'];

    function NonEditableResource(OpenlmisResource, classExtender) {

        classExtender.extend(NonEditableResource, OpenlmisResource);

        NonEditableResource.prototype.update = NonEditableResource.prototype.throwMethodNotSupported;

        return NonEditableResource;

        function NonEditableResource() {
            this.super('/api/nonEditable');
        }
    }

})();
```

Using this approach, calling the update method on the NonEditableResource will throw and exception saying that this action is not supported before even communicating with the backend server.

## OpenlmisRepository

This is a facade for fetching objects of a specific class. It accepts a class and a implementation which will return pure Javascript object that then will be transformed into class objects by the Repository. This pattern should be used if we want our objects to have some kind of logic with them, otherwise we should simply use the OpenlmisResource as it returns pure Javascript objects.

### Domain class

Represents a single domain concept that has some logic and should not be created for simple data objects (objects without methods). When creating a domain class that will be used by the repository there is one prerequisite to it. The class should only accept two parameters in its constructor, first one being the JSON representation of the object (pure Javascript object) and the second being the instance of the repository that created the object. The latter can be omitted if our object does not provide logic for saving itself and similar. Below is an example of the domain class.

```Javascript
(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name module-name.DomainClass
     *
     * @description
     * Example domain class.
     */
    angular
        .module('module-name')
        .factory('DomainClass', DomainClass);

    function DomainClass() {

        DomainClass.prototype.save = save;

        return DomainClass;

        /**
         * @ngdoc method
         * @methodOf module-name.DomainClass
         * @name DomainClass
         *
         * @description
         * Creates a new instance of the DomainClass class.
         *
         * @param  {Object}  json        the JSON representation of the object
         * @param  {Object}  repository  the repository that created the object
         * @return {Object}              the object of the DomainClass class
         */
        function DomainClass(json, repository) {
            this.parameter = json.parameter;
            this.repository = repository;
        }

        /**
         * @ngdoc method
         * @methodOf module-name.DomainClass
         * @name exampleMethod
         *
         * @description
         * Saves the instance of the DomainClass class on the backend.
         *
         * @return {Promise}  the promise resolved once the instance is saved, rejected otherwise
         */
        function save() {
            return this.repository.update(this);
        }
    }

})();
```

### Usage

Just like OpenlmisResource this class is designed to be sub-classed rather than being used on it's own. However, here's an example on how to use it on its own.

```Javascript
new OpenlmisResource(DomainClass, new OpenlmisResource('/api/domainClass'));
```

This approach is, as you can see, not very elegant thus the following approach is the preferred one.

### Sub-classing

Below is an example on how to create a sub-class of the OpenlmisResource.

```Javascript
(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name custom.CustomRepository
     *
     * @description
     * Repository for the objects of the Custom class.
     */
    angular
        .module('custom')
        .factory('CustomRepository', CustomRepository);

    CustomRepository.$inject = ['OpenlmisRepository', 'classExtender', 'DomainClass', 'CustomResource'];

    function CustomRepository(OpenlmisRepository, classExtender, DomainClass, CustomResource) {

        classExtender.extend(CustomRepository, OpenlmisRepository);

        return CustomRepository;

        /**
         * @ngdoc method
         * @methodOf custom.CustomRepository
         * @name CustomRepository
         * @constructor
         * 
         * @description
         * Creates an object of the CustomRepository class. It no implementation is provided it
         * will use an instance of the CustomResource class by default.
         */
        function CustomRepository(impl) {
            this.super(DomainClass, impl || new CustomResource());
        }
    }

})();
```

In the following example we've defined a default repository implementation as CustomResource. We've also added the ability to pass custom repository implementation if we need some custom behavior. This part is mostly used by the OpenlmisRepositoryImpl pattern and we will discuss it in the following section in details.

## OpenlmisRepositoryImpl

This pattern is designed for dealing with domain objects that are more complex and are constructed from multiple other objects fetches from the backend. It should only be used when the merging of the objects is required in order to deal with the logic and shouldn't be used if we simply need extra information for displaying the data. In that case the [ObjectMapper pattern](#objectmapper) should be used. Below is an example of how to implement the pattern.

```Javascript
(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name module-name.UserRepositoryImpl
     *
     * @description
     * Example repository implementation.
     */
    angular
        .module('module-name')
        .factory('UserRepositoryImpl', UserRepositoryImpl);

    UserRepositoryImpl.$inject = ['CredentialsResource', 'ContactDetailsResource']

    function UserRepositoryImpl(CredentialsResource, ContactDetailsResource) {

        //We need to define all the actions
        UserRepositoryImpl.prototype.create = create;
        UserRepositoryImpl.prototype.update = update;
        UserRepositoryImpl.prototype.get = get;
        UserRepositoryImpl.prototype.delete = delete;
        UserRepositoryImpl.prototype.query = query;

        return UserRepositoryImpl;

        /**
         * @ngdoc method
         * @methodOf module-name.UserRepositoryImpl
         * @name UserRepositoryImpl
         *
         * @description
         * Creates a new instance of the UserRepositoryImpl class.
         *
         * @return {Object}  the object of the UserRepositoryImpl class
         */
        function UserRepositoryImpl(json, repository) {
            this.customResource = new CredentialsResource();
            this.extendingResource = new ContactDetailsResource();
        }

        /**
         * @ngdoc method
         * @methodOf module-name.UserRepositoryImpl
         * @name UserRepositoryImpl
         *
         * @description
         * Creates the given object in the repository.
         *
         * @param  {Object}  user  the user to be created
         * @return {Promise}       the promise resolving to the created user
         */
        function create(user) {
            return $q
                .all([
                    this.credentialsResource.create(user.getCredentials()),
                    this.contactDetails.create(user.getContactDetails())
                ])
                .then(combineResponses);
        }

        /**
         * @ngdoc method
         * @methodOf module-name.UserRepositoryImpl
         * @name UserRepositoryImpl
         *
         * @description
         * Updates the given object in the repository.
         *
         * @param  {Object}  user  the user to be updated
         * @return {Promise}       the promise resolving to the updated user
         */
        function update(user) {
            return $q
                .all([
                    this.credentialsResource.update(user.getCredentials()),
                    this.contactDetails.update(user.getContactDetails())
                ])
                .then(combineResponses);
        }

        /**
         * @ngdoc method
         * @methodOf module-name.UserRepositoryImpl
         * @name UserRepositoryImpl
         *
         * @description
         * Gets the given object from the repository.
         *
         * @param  {Object}  id  the id of the user to be fetched
         * @return {Promise}     the promise resolving to the matching user
         */
        function get(id) {
            return $q
                .all([
                    this.credentialsResource.get(id),
                    this.contactDetails.get(id)
                ])
                .then(combineResponses);
        }

        /**
         * @ngdoc method
         * @methodOf module-name.UserRepositoryImpl
         * @name UserRepositoryImpl
         *
         * @description
         * Deletes object with the given ID from the repository.
         *
         * @param  {Object}  id  the id of the user to be deleted
         * @return {Promise}     the promise resolved when the user has been removed
         */
        function get(id) {
            return $q
                .all([
                    this.credentialsResource.get(id),
                    this.contactDetails.get(id)
                ])
                .then(combineResponses);
        }

        /**
         * @ngdoc method
         * @methodOf module-name.UserRepositoryImpl
         * @name UserRepositoryImpl
         *
         * @description
         * Searches the repository for objects matching the given parameters.
         *
         * @param  {Object}  params  the parameters to search by
         * @return {Promise}         the promise resolving to a page of objects representing users
         */
        function query(params) {
            return $q
                .all([
                    this.credentialsResource.query(params),
                    this.contactDetails.query(params)
                ])
                .then(combineResponses);
        }

        function combineResponses(credentials, contactDetails) {
            //combines response into single object and returns the result
        }
    }

})();
```

Once we have our repository implementation we can either pass it to the constructor or make it default implementation for a given repository.

```Javascript
// example of overriding the default implementation

new UserResource(new UserResourceImpl());

// default implementation example
(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name custom.CustomRepository
     *
     * @description
     * Repository for the objects of the Custom class.
     */
    angular
        .module('custom')
        .factory('UserRepository', UserRepository);

    UserRepository.$inject = ['OpenlmisRepository', 'classExtender', 'User', 'UserRepositoryImpl'];

    function UserRepository(OpenlmisRepository, classExtender, User, UserRepositoryImpl) {

        classExtender.extend(UserRepository, OpenlmisRepository);

        return UserRepository;

        /**
         * @ngdoc method
         * @methodOf custom.UserRepository
         * @name UserRepository
         * @constructor
         * 
         * @description
         * Creates an object of the UserRepository class. It no implementation is provided it
         * will use an instance of the UserRepositoryImpl class by default.
         */
        function UserRepository(impl) {
            this.super(User, impl || new UserRepositoryImpl());
        }
    }

})();
```