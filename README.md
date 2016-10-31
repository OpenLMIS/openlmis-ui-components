# OpenLMIS Requisition Reference UI Module
This repository holds the files for the OpenLMIS Requisition Reference UI Module.

## Prerequisites
* Docker 1.11+
* Docker Compose 1.6+

## Quick Start
1. Fork/clone this repository from GitHub.

 ```shell
 git clone https://github.com/OpenLMIS/openlmis-requisition-refUI.git
 ```
2. Develop w/ Docker by running `docker-compose run --service-ports requisition-refui`.
3. You should now be in an interactive shell inside the newly created development environment, build the project with: `grunt build` and then you can start it with `grunt serve`.
4. Go to `http://<yourDockerIPAddress>:9000/public/pages/login.html` to see the login page. Note that you can determine yourDockerIPAddress by running `docker-machine ip`.

## Building & Testing
Grunt is our build tool. Grunt tasks available:
- `grunt serve` to run project
- `grunt build` to build all sources. After building sources, it also runs unit tests. Build will be successful only if all tests pass.
- `grunt watch` will rebuild all the sources after every change — it doesn't run unit tests.
- `grunt clean` to remove build artifacts.
- `grunt karma:unit` to run Jasmine unit tests.
- `grunt karma:tdd` run Jasmine unit tests in test driven development mode, where test will automatically rerun when openlmis.js is rebuilt or any test file is updated.
- `grunt check` to run JSHint and LessLint tasks that perform code quality check.
- `grunt docs` will build the ngDocs documentation website

### Flags
- `--production` will compress all UI related files to be used in production. Otherwise files are not compressed and include sourcemaps for easier debugging.
- `--docs` Will generate ngDocumentation at build time
- `--styleguide` will create a styleguide from KSS pages
- `--openlmisServerURL` takes an argument that will change the location where the OpenLMIS UI application will look for a OpenLMIS Server. This variable can also be set in config.json. 
- `--authServiceURL` just like openlmisServerURL, but for the location of the Openlmis Authentication Service. If this url doesn't start with 'http' it will be prefixed by the openlmisServerURL. 
- `--requisitionServiceURL` just like authServiceURL, but for the OpenLMIS Requisitions Service. 
- `--addProxyService` for working with OpenLMIS servers or services that are on a different domain and don't implement CORs. This flag when run with `gulp serve` will start a [CORS Anywhere](https://github.com/Rob--W/cors-anywhere) server at `http://127.0.0.1:3030` — Adding this flag to `grunt build` or `grunt watch` will prepend any OpenLMIS URL with `http://127.0.0.1:3030/` so that all requests to OpenLMIS are CORS compliant. 



### Development Environment
Launches into shell with Grunt and all needed plugins needed for building UI module.

If you run the UI module, it should be available on port 9000.

```shell
> docker-compose run --service-ports requisition-refui
$ grunt build
$ grunt serve
```

### Running complete application with nginx
To run OpenLMIS Requisition Reference UI Module with Requisition and Auth services, use [OpenLMIS-Blue] (https://github.com/OpenLMIS/openlmis-blue).

When the application is up and running, you should be able to access UI with http://localhost/public/pages/index.html

To log into the UI you can use following credentials:
```
login: admin
password: password
```

### Build Deployment Image
The specialized docker-compose.builder.yml is geared toward CI and build
servers for automated building, testing and docker image generation of
the UI module.

```shell
> docker-compose -f docker-compose.builder.yml run builder
> docker-compose -f docker-compose.builder.yml build image
```

### Internationalization (i18n)
Transifex has been integrated into the development and build process. In order to sync with the project's resources in Transifex, you must provide values for the following keys: TRANSIFEX_USER, TRANSIFEX_PASSWORD.

For the development environment in Docker, you can sync with Transifex by running the sync_transifex.sh script. This will upload your source messages file to the Transifex project and download translated messages files.

The build process has syncing with Transifex seamlessly built-in.
