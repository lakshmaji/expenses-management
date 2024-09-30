#!/bin/bash

random_filename="upload_$(date +%s)_$RANDOM.zip"

rm upload_*.zip
# zip -r $random_filename geektrust.js src jest.setup.js jest.config.js yarn.lock package.json .gitignore README.md spec_helpers __tests__

# zip -r $random_filename geektrust.js src jest.setup.js jest.config.js yarn.lock package.json .gitignore README.md spec_helpers __tests__/command-parser.test.js # (all pass)

zip -r $random_filename geektrust.js src jest.setup.js jest.config.js yarn.lock package.json .gitignore README.md spec_helpers __tests__/properties.test.js # (2 instances of code duplication > 1)


# zip -r $random_filename geektrust.js src jest.setup.js jest.config.js yarn.lock package.json .gitignore README.md spec_helpers __tests__/properties.test.js __tests__/command-parser.test.js 


# zip -r $random_filename geektrust.js src jest.setup.js jest.config.js yarn.lock package.json .gitignore README.md spec_helpers __tests__/dues.test.js # (magic numbers)
# zip -r $random_filename geektrust.js src jest.setup.js jest.config.js yarn.lock package.json .gitignore README.md spec_helpers __tests__/clear-due.test.js # (magic numbers)
# zip -r $random_filename geektrust.js src jest.setup.js jest.config.js yarn.lock package.json .gitignore README.md spec_helpers __tests__/main.test.js # (magic numbers)
# zip -r $random_filename geektrust.js src jest.setup.js jest.config.js yarn.lock package.json .gitignore README.md spec_helpers __tests__/move-in.test.js # (magic numbers)
# zip -r $random_filename geektrust.js src jest.setup.js jest.config.js yarn.lock package.json .gitignore README.md spec_helpers __tests__/move-out.test.js # (magic numbers, 1 instance of code duplication - hopefully fixed)
# zip -r $random_filename geektrust.js src jest.setup.js jest.config.js yarn.lock package.json .gitignore README.md spec_helpers __tests__/spend.test.js # (magic numbers)

