#!/bin/sh

# Sync with Transifex
./sync_transifex.sh

npm install --no-optional

rm -r ./bower_components
bower install --allow-root

# Run Grunt build
grunt build
