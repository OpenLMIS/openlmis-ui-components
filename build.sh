#!/bin/sh

# Sync with Transifex
./sync_transifex.sh

# Update everything (just in case)
bower install --allow-root
npm install --no-optional

# Built and test
grunt build
