#!/bin/sh
node consul/registration.js -c register -f consul/config.json
nginx -g 'daemon off;'
