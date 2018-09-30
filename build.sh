#!/bin/sh

# Update everything (just in case)
npm rebuild
npm install

# Built and test
grunt --production
