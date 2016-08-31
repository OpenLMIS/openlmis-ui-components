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
- `grunt build` to build all sources. After building sources, it also runs unit tests. Build will be successful only if all tests pass.
- `grunt serve` to run project
- `grunt clean` to remove build artifacts.
- `grunt karma` to run Jasmine unit tests.
- `grunt check` to run JSHint and LessLint tasks that perform code quality check.

If your openlmis-requisition service is located at anything other than http://localhost:8080/requisition/:
- `grunt build --requisitionServerURL=http://where-openlmis-requisition.is/located`

You can also change requisitionServerURL in `config.json` file to be able to run just `grunt build`.


### Development Environment
Launches into shell with Grunt and all needed plugins needed for building UI module.

If you run the UI module, it should be available on port 9000.

```shell
> docker-compose run --service-ports requisition-refui
$ grunt build
$ grunt serve
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
