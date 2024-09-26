#!/bin/bash

random_filename="upload_$(date +%s)_$RANDOM.zip"

rm upload_*.zip
zip -r $random_filename geektrust.js test.js run.* yarn.lock package.json README.md .gitignore
