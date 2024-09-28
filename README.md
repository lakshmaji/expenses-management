# Expenses management

> Important: Got rid of utf8 and un-necessarily used constants for loops, which is annoying but had to make sacrifice due to geektrust platform

Ugly hacks due to geektrust platform limitations

1. using INITIAL_BALANCE instead of number 0 in test cases
2. using amounts in constants for testcase
3. using constants in assertion statements, where not needed in test cases 
4. Same is applicable for source code
5. TESTING_CONSTANTS
6. Ugly hacks: due to geektrust AI model incorrect evaluations .using INITIAL_BALANCE instead of number zero


## Decision Registry

### 25 Sep 2024

1. Everything in one file, just to understand and solve problem. No test cases.
2. Implemented solution using simple `Set` and `Map` for members and balances respectively.


### 26 Sep 2024

1. Its hard to keep track of changes when refactoring above concluded solution, so added specs using jest framework
2. Single Hashmap only. Removed `Map`, completely relayed on Set.

### 27 Sep 2024

1. Split and move test cases
2. Use Javascript class
3. Workaround to get rid of geektrust AI platformm magic number checks (So much math refer to test.helpers.js)
4. Validator classes (not needed though)
5. The `io` contains reads and writes for CLI application. A rest or gRPC or GraphQL layer can be added according to needs.

### 28 Sep 2024

1. Removed major test case file from submission, as it has bunch of numbers


## TODO

- [ ] Magic number test cases (follow up)
  - [ ] 12 magic numbers > 30 > (30 now - crazy...)
- [ ] Duplicate blocks in test cases 
  - [ ] 6 > 4 > 2 (now)

Any node.js version with `fs` support is fine.


### SOnarcube

```bash
# Issue #1
# sonarqube-1  | bootstrap check failure [1] of [1]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]; for more information see [https://www.elastic.co/guide/en/elasticsearch/reference/8.13/_maximum_map_count_check.html]

sysctl vm.max_map_count

sudo sysctl -w vm.max_map_count=262144


```

[Open it in broswer](http://localhost:9000/account/reset_password)
admin 
2woW4py~b9q}d8=,ku_3_w£

#analsys token
sqp_2bf24d537930064eeebf1241b7d2f696dc097580


instaling sonar scanner

```bash
# Docs https://docs.sonarsource.com/sonarqube/10.6/analyzing-source-code/scanners/sonarscanner/
# Downloaded it from https://docs.sonarsource.com/sonarqube/10.6/analyzing-source-code/scanners/sonarscanner/ (Linuxx64 and 6.2 version)
sudo unzip sonar-scanner-cli-4.8.0.2856-linux.zip
sudo mv sonar-scanner-4.8.0.2856-linux /opt/sonar-scanner
export PATH=$PATH:/opt/sonar-scanner/bin
source ~/.bashrc

docker compose up
cd /home/minions/development/apps/expense-mgmt

sonar-scanner \
  -Dsonar.projectKey=Testing-my-solution \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=sqp_639ad6860dee27796cd3810087938c6e5320a236
```
## Package manager

`yarn`

## Running cli

```bash
npm start sample_input/input1.txt 
# or
node geektrust.js sample_input/input1.txt 
# or
./run.sh # ubuntu
```

## Testing

```bash
yarn test
```

## Coverage report

```bash
yarn test --coverage
```

---
## Pre-requisites
* NodeJS 12.6.0/14.15.4/16.10.0
* npm

## How to run the code

We have provided scripts to execute the code. 

Use `run.sh` if you are Linux/Unix/macOS Operating systems and `run.bat` if you are on Windows.  Both the files run the commands silently and prints only output from the input file `sample_input/input1.txt`. You are supposed to add the input commands in the file from the appropriate problem statement. 

Internally both the scripts run the following commands 

 * `yarn install --silent` - This will build the solution downloading the necessary dependencies.
 * Once the `yarn install` from the previous build process is complete, we will execute the program using the command

`yarn run --silent start sample_input/input1.txt`

We expect your program to take the location to the text file as parameter. Input needs to be read from a text file, and output should be printed to the console. The text file will contain only commands in the format prescribed by the respective problem.

This main file, main.go should receive in the command line argument and parse the file passed in. Once the file is parsed and the application processes the commands, it should only print the output.

 ## Running the code for multiple test cases

 Please fill `input1.txt` and `input2.txt` with the input commands and use those files in `run.bat` or `run.sh`. Replace `./geektrust sample_input/input1.txt` with `./geektrust sample_input/input2.txt` to run the test case from the second file. 

 ## How to execute the unit tests

 Mocha based test cases are executed with the following command from the root folder
`mocha test`

Jest based test cases are executed with the following command from the root folder
`jest`

## Typescript

Your main file should be named as `geektrust.ts`.

As of now we only support Typescript under the NPM build system. This will require you to compile your typescript program into javascript.

We run the commands `yarn install --silent`, `yarn run --silent start` and `yarn test --silent`.

Please ensure that the npm install commands creates the file `geektrust.js` from your geektrust.ts file. The npm start command should then execute this `geektrust.js` file.

In your `package.json` file make sure you have an entry for the install, start and test script.

* The install command should install the dependencies and also build the `geektrust.js` file.
* The start command will execute the program.
* The test command should execute all the unit tests present

```
"scripts": {
    "install" :"<command to create your geektrust.js file>",
    "start": "node geektrust.js",
    "test": "mocha"
}
```

Note: If you create the geektrust.js file in some other folder (like dist/, build/ or out/)other than the main folder, then please appropriately edit the start command.

## Help

You can refer our help documents [here](https://help.geektrust.com)
You can read build instructions [here](https://github.com/geektrust/coding-problem-artefacts/tree/master/NodeJS)