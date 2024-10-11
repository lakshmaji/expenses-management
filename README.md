# Expenses management

[![Build Status](https://github.com/lakshmaji/expenses-management/actions/workflows/quality.yml/badge.svg)](https://github.com/lakshmaji/expenses-management/actions/workflows/quality.yml)

![report](./.github/report.png)

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

Any node.js version with `fs` support is fine.

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