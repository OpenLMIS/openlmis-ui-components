# Build Process
The OpenLMIS-UI functions as a single-page application that is created through a Grunt-based build process.

This document details the different workflows a developer might use while working on the OpenLMIS-UI.

## Standard Build
The most standard way to build the OpenLMIS-UI is to run `grunt build` which will concatinate, and compile the OpenLMIS-UI into a working set of front-end assets that are ready for development. When run, the following high level tasks will be exectuted:
* clean the `build` directory
* -style check files in `src`-
* create OpenLMIS application in `build/webapp`
* run unit test in `src` against `build/webapp/openlmis.js`
* create OpenLMIS styleguide in `build/styleguide`
* create OpenLMIS Javascript Documentation in `build/docs`

## Build Flags
There are a number of settings that can be set when building the OpenLMIS-UI.

### Production
Running a command with the `--production` flag will make the grunt build command compress all file types, getting the UI ready for production rather than development.

```
grunt build --production 
```

### Unit tests
Running unit tests can be skipped by adding the `--noTest` flag to the command.

```
grunt build --noTest
```

### Styleguide
Building the styleguide can be skipped by adding `--noStyleguide` to the command.

```
grunt build --noStyleguide
```

### Javascript Documentation
Choose not to build the Javascipt Documentation by add `--noDocs` to the command.

```
grunt build --noDocs
```

### Application
Build only the OpenLMIS application, and skip all tests by adding `--appOnly` to the command.

```
grunt build --appOnly
```

### Service Paths
Since the OpenLMIS Services might be in a different location than the OpenLMIS-UI, you can change the path to the OpenLMIS server location through a build flag. There are actually hooks to use OpenLMIS services hosted in different locations.

#### OpenLMIS Server path
`--openlmisServerURL` is the path to the main OpenLMIS server. This URL will be prepended to all other service paths, unless the service path starts with `http`

```
grunt build --openlmisServerURL=http://somewhere.com/
```

#### Auth Service path
```
grunt build --authServiceURL=/where/to/find/auth
``` 

#### Requisition Service path
```
grunt build --requisitionServiceURL=http://requisitions.are/here
```

### Proxy Service
If the OpenLMIS-UI is located at a different root domain than the OpenLMIS Services, the browser will not run the OpenLMIS-UI because of CORS errors. Since it is not always practical to set up CORs on a development instance of OpenLMIS — while developing the UI a developer can use the `--addProxyService` a command, which will prepend a proxy service location to any OpenLMIS Server URL.

A developer will also need to start a proxy service on the development server by running `grunt serve --addProxyService`

```
// sets the openlmisServerURL to 'http://127.0.0.1:3000/http://over/there'
grunt build --openlmisServerURL=http://over/there --addProxyService

// starts a proxy server at http://127.0.0.1:3000
grunt serve --addProxyService
```

## Automatic Building
When working on the OpenLMIS-UI it's convient to have the entire UI rebuilt when changes are made to the source files. This is achieved by running `grunt watch`. Everytime a file change is detected in `src/` grunt will re-run the build process with all the flags from when `grunt watch` was run.

*It is recommended that one run grunt watch to speed up application development*

```
grunt watch --openlmisServerURL=http://where.openlmis.is/
```

## Test Driven Development
A test driven development server can be run, where each time the `build/openlmis.js` or any unit test file is change will trigger the unit tests to be automatically rerun. This is a great way to karma and phantomjs tests because the test browser is never closed, meaning tests will run much faster.

```
grunt karma:tdd
```

### Debugging Test Driven Development
Debugging karma tests can be difficult, but to ease the process you can debug tests in your machines local browser by visiting Karma's local server. When debugging you can set break points in unit tests or OpenLMIS-UI source files. Instructions for [capturing a browser manually are on this page.](https://karma-runner.github.io/1.0/config/browsers.html)

When karma starts, the console will output the karma server location, which will look like:
```
01 01 1970 0:0:0.0:INFO [karma]: Karma v0.13.22 server started at http://localhost:9876/
```
Then take your browser and go to `http://localhost:9876` (which might change depending on if a process is already using the port).

Once the page loads you will see the karma tests are run again, but this time there are two sets of tests running (once in PhantomJS, and once in your browser). In the right hand corner there is a debug button, which will open a new window where you can view all the test output in the console and set breakpoints using your browser's developer tools.