FROM debian:jessie

WORKDIR /openlmis-ui-components

COPY package.json .
COPY package-yarn.json .
COPY config.json .
COPY src/ ./src/
COPY build/messages/ ./messages/
