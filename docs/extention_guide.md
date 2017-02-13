# UI Extention Architecture and Guide
This document outlines how the OpenLMIS UI supports extension and customization. The OpenLMIS UI is an AngularJS browser application that is built from multiple sources into a single app. The OpenLMIS UI works with the OpenLMIS APIs using RESTful HTTP requests. Below are explanations of the core extension components, along with brief examples of how to extend sections of the UI. To learn more about the files that are produced by the OpenLMIS-UI build process, see the build process documentation.

**Core technologies:**
* Javascript and AngularJS
* Docker and NodeJS for compiling a single page application from multiple sources
* Sass variables and mixins for easy style extention
* UI-Router for page definition
* Extention service for adding new functionality to existing components (in development)

## Docker Architecture
To create a modular single page application, we are using Docker and NodeJS to build multiple git repositories together into the working UI layer for OpenLMIS.

There are 3 types of Docker images that need to be combined to make a functional UI
* A **tooling image** that stores core components which can compile the UI (see Dev-UI)
* **Source code images** that contain Javascript, HTML, CSS/SCSS, and other assets that make up the OpenLMIS-UI
* A **publishing image,** that compiles the source code images and builds a working web server that is included into the OpenLMIS Server. Small adjustments like branding should be made in the publishing image. (See Reference-UI)
 
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
### HTML, Images, and Static Assets 

### CSS and SASS
There should be no special method of removing or explicitly overriding CSS — an implementer should simply use more specific CSS rules to change styles. This means that CSS styles in OpenLMIS should strive to be as general (shallow) as possible so that overriding a style can be done by creating a new CSS style.

Some basic rules for doing this:
* avoid the !important statement
* use child selectors >
* make mark-up semantic and class free (ie, avoid divs)

All colors, absolute spacing, and browser breakpoints should be implemented using SASS variables, so that the overall UI look and feel can be changed by creating a different `*.variables.scss` file that will overwrite the initial declarations in OpenLMIS.

### Adding New Screens
When creating new functionality, there are needs to support the addition of configuration screens so configurations can be changed after initial implementation by a non-technical user. This set of extensions might not be used often by administrations, but for implementers there is value and re-assurance that these screens are available and accessible.

### Creating new screens
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

### Replacing an existing screen
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
