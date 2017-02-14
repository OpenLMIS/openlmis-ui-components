# UI Extention Architecture and Guide
This document outlines how the OpenLMIS UI supports extension and customization. The OpenLMIS UI is an AngularJS browser application that is built from multiple sources into a single app. The OpenLMIS UI works with the OpenLMIS APIs using RESTful HTTP requests. Below are explanations of the core extension components, along with brief examples of how to extend sections of the UI. To learn more about the files that are produced by the OpenLMIS-UI build process, see the build process documentation.

**Core technologies:**
* Javascript and [AngularJS v1.6](https://angularjs.org/)
* [Docker](https://www.docker.com/) and NodeJS for compiling a single page application from multiple sources
* [Sass variables and mixins](http://sass-lang.com/) for easy style extention
* [UI-Router](https://github.com/angular-ui/ui-router) for page definition
* Extention service for adding new functionality to existing components (in development)

## Docker Architecture
To create a modular single page application, we are using Docker and NodeJS to build multiple git repositories together into the working UI layer for OpenLMIS. The pattern that the OpenLMIS-UI follows is extremely similar to the micro-services architecture used in OpenLMIS, with the large difference being that the OpenLMIS-UI is compiled and does not 'discover' UI components.

There are 3 types of Docker images that need to be combined to make a functional UI
* A **tooling image** that stores core components which can compile the UI [(see OpenLMIS/Dev-UI)](https://github.com/OpenLMIS/dev-ui)
* **Source code images** that contain Javascript, HTML, CSS/SCSS, and other assets that make up functional sections of the OpenLMIS-UI [(See OpenLMIS-Requisition-UI)](https://github.com/OpenLMIS/openlmis-requisition-refUI)
* A **publishing image,** that compiles the source code images and builds a working web server that is included into the OpenLMIS Server. Small adjustments like branding should be made in the publishing image. [(See OpenLMIS/Reference-UI)](https://github.com/OpenLMIS/openlmis-requisition-refUI)
 
When the OpenLMIS-UI is compiled, the source code images will overwrite each other, according to the order specified in the config.json file (see Dev-UI Documentation). This makes it possible to override assets or sections of behavior in a simple process.

*Note:* The decision to use implicit over-writing of files rather than an explicit configuration came from Javascript's global name space which would cause problems if two Javascript objects had the same name.

**Example:**
There are 2 images being included into a publishing image, and they have files at the following paths:

*OpenLMIS-UI-Common*
* *src/common/* logo.png
* *src/common/* header.scss

*OpenLMIS-Requisition-UI*
* *src/requisition/* requisition.js
* *src/requisition/* requisition.routes.js

*Example-UI-Distribution*
* *src/common/* logo.png
* *src/requisition/* requisition.routes.js

When comiled the following sources will be used:

* **Example-UI-Distribution/** *src/common/* logo.png (new logo)
* **OpenLMIS-UI-Common/** *src/common/* header.scss
* **OpenLMIS-Requisition-UI/** *src/requisition/* requisition.js
* **Example-UI-Distribution/** *src/requisition/* requisition.routes.js (changed requisition pages that are available)

## Guidelines and Examples
The following are brief examples of sections of the OpenLMIS-UI that can be extended, which are organized by the goal an implementation is trying to achieve. The extention goals the OpenLMIS-UI supports are:
* **Modifying content** such as specific message strings, images, or specific parts of HTML markup
* **Global styles** such as CSS presentation or singular directives
* **Pages** meaning adding new pages to the OpenLMIS-UI, completely replacing an existing screen, or adding additional content to a specific screen.

*NOTE:* Adding logic to existing Javascript classes is not currently documented, but is a need we are aware of.

### Modifying content
There are multiple places that the OpenLMIS-UI allows an implementer to customize content.

#### Messages
Messages are translateable pieces of content that are a part of the OpenLMIS-UI. The best way to update a message is by configuring the OpenLMIS-UI to use your implementation's Transifex settings and editing the message directly in Transifex. What Transifex does is replace a message key, which is defined in the UI, with a human readable message. *This is how the OpenLMIS-UI supports multiple languages.*

See the example below:

```HTML
<!-- HTML similar to this, will be updated by Transifex once the OpenLMIS-UI is built and run in a browser -->
<p>{{ 'example.instructions' | message }}</p>

<!-- The above message will be displayed to a person using the OpenLMIS-UI as: -->
<p>These are some instructions</p>
```

The strategy in the OpenLMIS-UI is to not reuse specific message keys, and let the tools in Transifex group messages that are the same together into a single spot for translation. This allows an implementer to further customize small messages such as 'Search' to 'Search Facilities' if the needs of their implementation require more specificity.

If there are large message string changes, it is possible for an implementer to replace the `messages_en.json` file, and make the changes that are needed. **This is possible as a last resort but not recommended.**

#### Images
Individual images are also easy to change, either by overriding the CSS style (see below) or 'implicitly' replacing the image. As mentioned earlier, all files overwrite each other implicitly, so to replace the default logo (for example) just replace the logo.png file in the publishing image.

#### HTML Layouts
There might be places where an implementor needs to completely change the layout of a page or element. An example of this might be adding an additional header, or a paragraph of instructions. This is simple because of AngularJS's markup pattern and the implicit file replacement.

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

### Global Styles
Global styles refer to CSS styles and Javascript interactions that are consistently applied throughout the OpenLMIS-UI. These designs and styles are purposefully implemented on extremely vanilla HTML to promote consistency and to make it easy for an implementer to quickly change interaction patterns across the entire UI. See the coding conventions for more information about how this is achieved.

#### CSS and SASS
There should be no special method of removing or explicitly overriding CSS — an implementer should simply use more specific CSS rules to override a CSS style. The CSS coding conventions stress using shallow selectors and avoiding the `!important` selector, so that its easy for an implementor to make style changes in a publishing image.

```CSS
// In general, overriding a style is as simple as adding a higher level selector like 'body'
// Here is how an implementer might make all the links in the OpenLMIS-UI underlined

body a {
  text-decoration: underline;
}

```

In addition to keeping the CSS simple, the OpenLMIS-UI uses SASS variables to implement colors and spacing across the UI, which means changing a color is as simple as declaring a variable. The OpenLMIS-UI's sass varibles follow a semantic naming pattern, and `!default` variables are implemented in smaller files, which make it easy to update patterns. A full list of variables in an implementation is availabe in the [generated OpenLMIS-UI styleguide.]()

To update Sass variables in a publishing image, create a file `src/variables.scss` and declare variables without `!default`
```
$brand-primary: #FDFB50; // Turned most branding elements a disgusting yellow
$brand-danger: #AE4442; // Made error elements use a darker more brown red
```

#### AngularJS Directives and Components
Within the OpenLMIS-UI there are many optimizations that use AngularJS directives to keep HTML markup DRY and provide a consistent experience. The core OpenLMIS-UI attempts to provide a simple, accessible, and usable experience -- but for some implementations these patterns might need to be changed or updated. See the OpenLMIS-UI coding conventions for a discussion of the difference between a directive and a component.

The best way to change these patterns is to implicitly replace the file where the directive is created.

**NOTE:** Changing directives is tricky, and a simple example will be added to this document ... eventually ...

### Pages
Pages are the primary unit of any application, and the OpenLMIS-UI has support for adding new pages, replacing existing pages, and adding content to existing pages.

#### New Pages
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

#### Replacing an Existing Screen
We expect that some implementations will need to make small changes to existing pages within the OpenLMIS-UI that go beyond the previous extention techniques mentiond. The most simple method of replacing a screen is implicitly replacing the `*.routes.js` file where the route is defined, as these files are mostly configuration and shouldn't contain complex logic.

A more complex alternative is to modify the UI-Router configuration at run-time, which would allow for very nuanced changes that require their own unique unit tests. The following example shows how to change a page's template depending on a user's access rights. **NOTE:** This is an invasive techinque, and should only be done if all other extention methods don't work

```javascript
angular.module('custom-module').run(function($state){
  var state = $state.get('home'); // get the current home page state
  state.view.templateUrl = 'new_tempalte.html';
  // gotta figure out how to change this...
});
```

#### Extending a Screen
This functionality is still underdevelopment, see [OLMIS-1682: Extention directive to allow insertion of UI components](https://openlmis.atlassian.net/browse/OLMIS-1682) for implementation details.
