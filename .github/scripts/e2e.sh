#! bin/bash

for input_file in sample_input/*; do
    base_name=$(basename "$input_file")
    expected_file="sample_outputs/${base_name}"

    node geektrust.js $input_file > actual_output.txt 2>&1
    
    if ! diff -u $expected_file actual_output.txt > /dev/null; then            
        echo "Failed $expected_file testcase"

        expected_lines=$(wc -l < $expected_file)
        actual_lines=$(wc -l < actual_output.txt)

        echo "Number of lines in expected output: $expected_lines"
        echo "Number of lines in actual output: $actual_lines"
        exit 1
    fi

    rm actual_output.txt
done