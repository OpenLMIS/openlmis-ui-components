#!/bin/sh

# Sync with Transifex
./sync_transifex.sh

# Not 100% sure how this helps
npm install -g bower
rm -r ./bower_components

# Update everything (just in case)
bower install --allow-root
npm install --no-optional

# Built and test
grunt build
