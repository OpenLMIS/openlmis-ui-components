# UI Components
This repository contains UI components that are used in other OpenLMIS-UI projects.

## Prerequisites
* Docker 1.11+
* Docker Compose 1.6+

## Quick Start
1. Fork/clone this repository from GitHub.

 ```shell
> git clone https://github.com/OpenLMIS/openlmis-ui-components.git
> cd openlmis-ui-components/
 ```
2. Create a .env file, which can be used to overwrite 'sensitive' settings from config.json
```shell
> touch .env
```
3. Develop w/ Docker by running `docker-compose run --service-ports ui-components`.
4. You should now be in an interactive shell inside the newly created development environment, build the project with: 
```shell
$ npm install // installs the NodeJS tools

$ grunt --serve
// or
$ grunt clean bower build --serve
```
5. Go to `http://localhost:9000/webapp/` to see the login page.

*Note:* To change the location of where the OpenLMIS-UI attemps to access OpenLMIS, use the command `grunt build  --serve --openlmisServerUrl=<openlmis server url>`.

## Building & Testing
See the [OpenLMIS/dev-ui project](https://github.com/OpenLMIS/dev-ui) for more information on what commands are available, below are the command you might use during a normal work day.

```shell
// Open docker in an interactive shell
> docker-compose run --service-ports requisition-ui

// Install dependencies 
$ npm install
$ grunt clean
$ grunt bower

// Build and run the UI against a OpenLMIS server
$ grunt build --serve --openlmisServerUrl=<openlmis server url>

// Run unit tests
$ grunt karma:unit

// Run a watch process that will build and test your code
// NOTE: You must change a file at least once before your code is rebuilt
$ grunt watch --serve --openlmisServerUrl=<openlmis server url>

```

### Built Artifacts
After the OpenLMIS-UI is built and being served, you can access the following documents:
- `http://localhost:9000/webapp/` The compiled OpenLMIS application
- `http://localhost:9000/docs/` JS Documentation created from the source code
- `http://localhost:9000/styleguide/` KSS Documentation created from the CSS


### Build Deployment Image
The specialized docker-compose.builder.yml is geared toward CI and build
servers for automated building, testing and docker image generation of
the UI module.

```shell
> docker-compose pull
> docker-compose run --entrypoint ./build.sh requisition-ui
> docker-compose build image
```

### Internationalization (i18n)
Transifex has been integrated into the development and build process. In order to sync with the project's resources in Transifex, you must provide values for the following keys: TRANSIFEX_USER, TRANSIFEX_PASSWORD.

For the development environment in Docker, you can sync with Transifex by running the sync_transifex.sh script. This will upload your source messages file to the Transifex project and download translated messages files.

The build process has syncing with Transifex seamlessly built-in.
