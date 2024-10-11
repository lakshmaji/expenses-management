const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function runCommand(command) {
  try {
    return execSync(command, { stdio: 'pipe' }).toString();
  } catch (err) {
    return err.stdout.toString();
  }
}

const inputFiles = fs.readdirSync('sample_input');

inputFiles.forEach(inputFile => {
  const inputFilePath = path.join('sample_input', inputFile);
  const expectedFilePath = path.join('sample_outputs', inputFile);
  const expectedFileContent = fs.readFileSync(expectedFilePath).toString();
  const expectedOutput = expectedFileContent.split("\n")
  
  const actualOutput = runCommand(`node geektrust.js ${inputFilePath}`).split("\n");

  expectedOutput.forEach((line, idx) => {    
    if (line !== actualOutput[idx]) {
      console.log(`Test case failed for ${inputFilePath}:`);
      process.exit(1);
    }
  })
});
