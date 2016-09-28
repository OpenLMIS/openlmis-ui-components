#!/bin/sh

# Sync with Transifex
./sync_transifex.sh

npm install --no-optional

apt-get install git
npm install -g bower

bower install --allow-root

apt-get uninstall 

# Run Grunt build
grunt build styleguide
