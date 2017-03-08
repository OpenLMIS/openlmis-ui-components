FROM debian:jessie

WORKDIR /openlmis-requisition-ui

COPY package.json .
COPY bower.json .
COPY config.json .
COPY src/ ./src/
COPY styleguide/ ./styleguide/
COPY docs/ ./docs/
