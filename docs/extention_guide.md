# UI Extention Guide
This document outlines how to extend the OpenLMIS-UI. The extention mechanims are presented by the type of extention an implementer wants to achieve, and has brief code samples — more detailed code samples are availble in the OpenLMIS-UI coding conventions.

**NOTE:** Implementers are encouraged to not override files to create maintainable extentions. There are definitely situations where it makes sense to quickly override a file to create desired functionality. Overriding files makes recieving or sharing working code with other OpenLMIS-UI repositories difficult, which is why this technique is discouraged.

*The extentions the OpenLMIS-UI supports are:*
* **Content** such as specific message strings, images, or specific parts of HTML markup
* **Styles** such as CSS presentation and AngularJS directives
* **Javascript Objects** such as AngularJS services, factories, and controllers that control application logic  
* **Pages** meaning adding new pages to the OpenLMIS-UI, completely replacing an existing page, or adding additional content to a specific screen.

To learn more about the types of files, and how they can be extended, see the OpenLMIS-UI coding conventions.

## Content
Most of the content in the OpenLMIS-UI is returned from the OpenLMIS Services, which should be modified in the OpenLMIS Services themselves. Other forms of content are static messages and images used throughout the OpenLMIS-UI. 

### Messages
Messages are translateable pieces of content that are a part of the OpenLMIS-UI. The best way to update a message is by configuring the OpenLMIS-UI to use your implementation's Transifex settings and editing the message directly in Transifex. What Transifex does is replace a message key, which is defined in the UI, with a human readable message. *This is how the OpenLMIS-UI supports multiple languages.*

See the example below:

```HTML
<!-- HTML similar to this, will be updated by Transifex once the OpenLMIS-UI is built and run in a browser -->
<p>{{ 'example.instructions' | message }}</p>

<!-- The above message will be displayed to a person using the OpenLMIS-UI as: -->
<p>These are some instructions</p>
```

The strategy in the OpenLMIS-UI is to not reuse message keys, allowing an implementer to further customize small messages such as 'Search' to 'Search Facilities' if this is a need in an implementation.

An implementer can also create their own `messages_en.json` file and override specific message keys with their own translations. This is the recommended way to update a message key IF the implementation uses a single language.

Interpolated messages can't use data that is not directly passed to the message when it is parsed. This means that an implementer might need to extend a Javascript object or HTML file to get the desired output.

### Images
Individual images are also easy to change, either by overriding the CSS style (see CSS extention section) or by overriding the image file.

To replace the default logo, it is best to override the logo.png file in the publishing image. Since image files are static and should only be placed with CSS — there is no technical debt incurred by replacing an image file.

## Global Styles
Global styles refer to CSS styles and AngularJS directives that create the appearance and affordance of the OpenLMIS-UI. The coding conventions promote simple and semantic HTML to allow for complex behavior to be added by CSS and AngularJS. This allows for implementers to override the complex behaviors to fit their needs from a single point.

### CSS and SASS
There should be no special method of removing or explicitly overriding CSS — an implementer should simply use more specific CSS rules to override a CSS style. The CSS coding conventions stress using shallow selectors and avoiding the `!important` selector, so that its easy for an implementor to make style changes in a publishing image.

```CSS
// In general, overriding a style is as simple as adding a higher level selector like 'body'
// Here is how an implementer might make all the links in the OpenLMIS-UI underlined

body a {
  text-decoration: underline;
}

```

In addition to keeping the CSS simple, the OpenLMIS-UI uses SASS variables to implement colors and spacing across the UI, which means changing a color is as simple as declaring a variable. The OpenLMIS-UI's sass varibles follow a semantic naming pattern, and `!default` variables are implemented in smaller files, which make it easy to update patterns.

To update Sass variables in a publishing image, create a file `src/variables.scss` and declare variables without `!default`
```
$brand-primary: #FDFB50; // Turned most branding elements a disgusting yellow
$brand-danger: #AE4442; // Made error elements use a darker more brown red
```

### AngularJS Directives
Within the OpenLMIS-UI, we use AngularJS directives to keep HTML markup semantic and have AngularJS create the improved interactive experience. The OpenLMIS-UI attempts to provide a simple, accessible, and usable experience -- but for some implementations these patterns might need to be changed.

Overriding or ignoring files that create directives is good way to change a directive for a specific implementation, since these changes are locale specific. Anything that is locale specific we assume will not be returned to the OpenLMIS-UI core repositories.

There might be reasons to change a directive's implementation slightly, and to do this we recommend following [AngularJS's decorator pattern for directives.](https://docs.angularjs.org/guide/decorators#directive-decorator-example) This method allows you to change what happens when a directive is instantiated, but won't allow for access to any internal methods within the directive. *Always add your modifications to a different module than the directive you are implement to ensure unit tests run correctly.*

Sometimes it's simpler to create a second directive that will run before (or after) the directive you are modifying. To understand how this is done, see the [AngularJS documentation on directive priority.](https://docs.angularjs.org/api/ng/service/$compile#-priority-).

## Javascript Objects
Javascript objects refer to AngularJS objects such as services, factories, or controllers. These objects fetch data and process data used throughout the OpenLMIS-UI. For this reason, they are the best place to add extentions that modify OpenLMIS-UI workflows and logic. Each OpenLMIS-UI module might be constructed slightly differently, so consult the OpenLMIS-UI documentation to decide which Javascript Object to extend.

An implementation might change a Javascript Object to:
* Change the URL that data is loaded from
* Perform secondary calculations on data before it is shown to the user
* Modify OpenLMIS-UI workflows by opening an additional modal

To make these changes, we use [AngularJS's decorator method.](https://docs.angularjs.org/guide/decorators) — each type of OpenLMIS-UI object has their own extention methods documented in the OpenLMIS-UI coding conventions.

The most important point to remember is to add these extentions in a different module than where the Javascript object is defined. The reason for doing this is to keep the original unit tests applied (and working) for the object BEFORE your extentions are added to the object.

## Pages
Pages are the primary unit of any application, and the OpenLMIS-UI has support for adding new pages, replacing existing pages, and adding content to existing pages.

### New Pages
To add a new page to OpenLMIS-UI an implementer needs to register a page with UI-Router. The OpenLMIS-Navigation directive can expose pages registered with UI-Router, which is used within the OpenLMIS-UI in the main header navigation, meaning that new pages are exposed to a user in the OpenLMIS-UI. See the UI coding conventions for specifics on how to add a route, and the configuration options available.

Here is a simple example.
```javascript
// Consider adding a view to see requisitions on a map
angular.module('custom-module').config(function($stateProvider){
  $stateProvider.state('requisitions.map', {
    url: '/map',
    showInNavigation: true,
    controller: 'MyCustomMapController',
    templateUrl: 'map/page.html'
  });
});
```

**NOTE:** Adding new pages to the OpenLMIS-UI should mostly be done in source code images, if the page adds functionality. If the page is implementation specific it sould be added in a publishing image. 

### Replacing an Existing Screen
We expect that some implementations will need to make small changes to existing pages within the OpenLMIS-UI that go beyond the previous extention techniques mentiond. The most simple method of replacing a screen is implicitly replacing the `*.routes.js` file where the route is defined. Overriding these files doesn't risk much technical debt, as these files are mostly configuration and rarely contain the definition of more than one screen.

A more complex alternative is to modify the UI-Router configuration at run-time, which would allow for very nuanced changes that require their own unique unit tests. The following example shows how to change a page's template depending on a user's access rights. **NOTE:** This is an invasive techinque, and should only be done if all other extention methods don't work

```javascript
angular.module('custom-module').run(function($state){
  var state = $state.get('home'); // get the current home page state
  state.view.templateUrl = 'new_tempalte.html';
  // gotta figure out how to change this...
});
```

### Extending a Screen
This functionality is still underdevelopment, see [OLMIS-1682: Extention directive to allow insertion of UI components](https://openlmis.atlassian.net/browse/OLMIS-1682) for implementation details.

### HTML Layouts
There might be places where an implementor needs to completely change the layout of a page or element. An example of this might be adding an additional header, or a paragraph of instructions. This is simple because of AngularJS's markup pattern and the implicit file replacement.

Forking the HTML markup does mean checking to make sure there were no changes to the original file when there was an update — but AngularJS was created to keep the markup simple and we write our HTML to keep as much logic out of the markup as possible.  *We still recommend an implement makes layout changes using CSS, rather than forking a file, if possible.*

Let's consider wanting to add a large footer element to the OpenLMIS-UI (which might contain help information or an emergency phone number). To do this, an implementer would replace the [main index.html file](https://github.com/OpenLMIS/openlmis-requisition-refUI/blob/master/src/main/webapp/index.html) and add a CSS file with the styling needed.

The HTML markup in this new index.html file might look like:
```HTML
<!-- NOTE: Dropped the HTML and HEAD sections -->
<body >
    <header ng-if="userIsAuthenticated">
      <div ng-include="'openlmis-header/header.html'" offline ng-class="{'isOffline':isOffline}" ></div>
      <div class="navbar">
        <openlmis-navigation class="nav navbar-nav"></openlmis-navigation>
        <openlmis-locale class="navbar-right locale-container"></openlmis-locale>
      </div>
    </header>
    <div ui-view></div>
    <!-- This is new -->
    <footer>
    ... phone numbers and additional information here ...
    </footer>
    <!-- /new -->
  </body>

```

*NOTE:* The main `index.html` was designed to be extremely minimal so that implementations could make huge changes quickly. Other HTML files within OpenLMIS follow this same paradigm of easy to replace HTML.