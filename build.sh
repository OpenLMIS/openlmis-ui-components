#!/bin/sh

# Sync with Transifex
./sync_transifex.sh

npm install --no-optional
bower install --allow-root

# Run Grunt build
grunt build styleguide
