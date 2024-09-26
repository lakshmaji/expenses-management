#!/bin/bash

random_filename="upload_$(date +%s)_$RANDOM.zip"

rm upload_*.zip
zip -r $random_filename geektrust.js src test.js run.* yarn.lock *.json test_data .gitignore
