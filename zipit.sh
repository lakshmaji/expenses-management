#!/bin/bash

random_filename="upload_$(date +%s)_$RANDOM.zip"

rm upload_*.zip
zip -r $random_filename geektrust.js src test.helpers.js jest.setup.js jest.config.js __tests__ run.* yarn.lock *.json .gitignore
