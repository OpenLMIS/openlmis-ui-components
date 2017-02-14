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
<!-- HTML similar to this, will be updated by Transifex once the OpenLMIS-UI is build and run in a browser -->
<p>{{ 'example.instructions' | message }}</p>

<!-- The above message will be displayed to a person using the OpenLMIS-UI as: -->
<p>These are some instructions</p>
```

The stratedgy in the OpenLMIS-UI is to not reuse specific message keys, and let the tools in Transifex group messages that are the same together into a single spot for translation. This allows an implementer to further customize small messages such as 'Search' to 'Search Facilities' if the needs of their implementation require more specificity.

If there are large message string changes, it is possible for an implementer to replace the `messages_en.json` file, and make the changes that are needed. **This is not recommended.**

#### Images
Individual images are also easy to change, either by adding a CSS Override (see below) or 'implicitly' replacing the image. As mentioned earlier, all files overwrite eachother implicitliy, so to replace the default logo (for example) just replace the logo.png file in the publishing image.

#### HTML Layouts
There might be places where an implementor needs to completely change the layout of a page or element. An example of this might be adding an additional header, or a paragraph of instructions. This is simple because of AngularJS's markup pattern and the implicit file replacement.

Let's consider wanting to add a large footer element to the OpenLMIS-UI (which might contain phone numbers and help information). To do this, an implementer would replace the [main index.html file](https://github.com/OpenLMIS/openlmis-requisition-refUI/blob/master/src/main/webapp/index.html) (which actually contains very little code) and add a CSS file with the styling needed. The HTML markup in this new index.html file might look like:

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

### Global Styles

#### CSS and SASS
There should be no special method of removing or explicitly overriding CSS — an implementer should simply use more specific CSS rules to change styles. This means that CSS styles in OpenLMIS should strive to be as general (shallow) as possible so that overriding a style can be done by creating a new CSS style.

Some basic rules for doing this:
* avoid the !important statement
* use child selectors >
* make mark-up semantic and class free (ie, avoid divs)

All colors, absolute spacing, and browser breakpoints should be implemented using SASS variables, so that the overall UI look and feel can be changed by creating a different `*.variables.scss` file that will overwrite the initial declarations in OpenLMIS.

#### AngularJS Directives
* Non-component directives change how default DOM elements function, and we aim to extend them 
* Implicitly replace these, or don't include the project
* See the coding conventions

### Screens
When creating new functionality, there are needs to support the addition of configuration screens so configurations can be changed after initial implementation by a non-technical user. This set of extensions might not be used often by administrations, but for implementers there is value and re-assurance that these screens are available and accessible.

### New Screens
*Goal:* Add new functionality to the OpenLMIS-UI

*Examples:*
* Add new top-level functionality to OpenLMIS
* Add configuration page to administration section
* Add tab to requisition view page

The infrastructure to create new administration screens already exists - meaning an administrative user can navigate to a new screen that is defined in a UI docker module.

*Enabling features:*
* UI-Router: Allows for addition of screens with a unique URL
* NavigationService: Allows UI-Router definitions to expose their menu items into existing navigation frameworks

```
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

### Replacing an Existing Screen
*Goal:* Add content and functionality to an existing screen

*Examples:*
* An implementation needs to replace the homepage with an interactive dashboard
* A footer needs to be customized (less complicated than previous option)

*Options:*

Build Process Option - configure the build process so that files on a similar path overwrite each other before the UI build command is run (this would mean creating a large temporary directory). The nice thing is that if you wanted to replace the home page template, all you would have to do it place a file at `src/home/page.html` (for example). The work involved here would be defined in the NodeJS dev tools, which are shared across all repositories.

UI-Router Solution - Rewrite a UI-Router route to use the newly created view template or controller. The implementation of this in AngularJS would require a run statement to make the switch, because you would need to wait for the original state to be registered. Problem: Not clear how errors would be handled.

```
angular.module('custom-module').run(function($state){
  var state = $state.get('home'); // get the current home page state
  state.view.templateUrl = 'new_tempalte.html';
  // gotta figure out how to change this...
});
```

### Extending a Screen
*Goal:* To adding a single element or field into an existing screen without forking or replacing the entire screen.
