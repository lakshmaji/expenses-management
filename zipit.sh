#!/bin/bash

random_filename="upload_$(date +%s)_$RANDOM.zip"

rm upload_*.zip
zip -r $random_filename geektrust.js src jest.setup.js jest.config.js __tests__ yarn.lock package.json .gitignore spec_helpers READMD.md
# zip -r $random_filename geektrust.js src utils.js jest.setup.js jest.config.js __tests__ yarn.lock package.json .gitignore -x __tests__/command-parser.test.js
# zip -r $random_filename geektrust.js src utils.js jest.setup.js jest.config.js yarn.lock package.json .gitignore __tests__/main.test.js __tests__/clear-due.test.js __tests__/dues.test.js
# __tests__/spend.test.js __tests__/move-in.test.js
