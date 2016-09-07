#!/bin/sh

# Sync with Transifex
./sync_transifex.sh

npm install --no-optional

# Run Grunt build
grunt build styleguide
