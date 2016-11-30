#!/bin/sh

# Sync with Transifex
./sync_transifex.sh

npm install --no-optional

apt-get install --assume-yes git
npm install -g bower

rm -r ./bower_components
bower install --allow-root

apt-get uninstall 

# Run Grunt build
grunt build
