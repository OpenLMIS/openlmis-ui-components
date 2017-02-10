#!/bin/sh

# This script initializes the Transifex client. It then uploads the source resource to the
# Transifex project and downloads the translated resources into the build.

# Some things to note:
# - The .tx folder, if it exists, is deleted beforehand so that the 'tx init' does not need to
#   prompt to overwrite it.
# - The .tx folder is generated each time, rather than saving the .tx/config file into version
#   control, because a .transifexrc also needs to be generated using the username and password.
#   Since these credentials should not be in version control, the regeneration approach is used.

rm -rf .tx
tx init --host=https://www.transifex.com --user=$TRANSIFEX_USER --pass=$TRANSIFEX_PASSWORD
tx set --auto-local -r openlmis-requisition-ui.messages \
    '.tmp/messages/messages_<lang>.json' --source-lang en --type KEYVALUEJSON \
    --source-file .tmp/messages/messages_en.json --execute
tx push -s
tx pull -a -f
