# OpenLMIS-UI Overview

The OpenLMIS-UI is a single page application that communicates with OpenLMIS Services to provide a user interface for interacting with OpenLMIS. This UI aims to be modular, extendable, and provide a consistent user experience. It is called a 'reference' because implementations may use and/or customize it to their local needs.

At a high level, the OpenLMIS-UI uses JavaScript to create an application that runs in a user's web browser. After the UI has been loaded into a user's web browser, it can be used while offline. Supported web browsers are Google Chrome and Firefox.

The OpenLMIS-UI is state-driven, meaning the browser's URL determines what is displayed on the screen. Once the application starts, the browser's current URL is parsed and used to retrieve data from OpenLMIS Services. All retrieved data populates HTML-based views, which are displayed in the user's browser and styled by CSS.

The OpenLMIS-UI is built in a modular way from multiple other UI repositories and compiled into a single page application. The OpenLMIS Dev-UI provides the build system and uses other repositories to provide layouts and components along with feature-specific repositories (e.g. Auth UI, Requisition UI) that provide the screens that users interact with for different features of OpenLMIS.

Core technologies used to build the UI are:

- [Docker](https://www.docker.com/) provides environment encapsulation
- [NPM](https://www.npmjs.com/) is the package manager
- [Grunt](https://gruntjs.com/) orchestrates the application build process
- [Sass](http://sass-lang.com/) is used to generate CSS
- For unit testing, [Karma](https://karma-runner.github.io/2.0/index.html) is the test runner and [Jasmine](https://jasmine.github.io/) is the assertion and mocking library
- [Nginx](https://www.nginx.com/) runs the OpenLMIS-UI within the OpenLMIS micro-services framework

Primary libraries used within the UI are:

- [AppCache](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache>) allows the application run in a browser while offline
- [AngularJS v1](https://angularjs.org/) is the application framework
- [Angular UI-Router](https://github.com/angular-ui/ui-router/) provides URL routing
- [PouchDB](https://pouchdb.com/) stores data for offline functionality