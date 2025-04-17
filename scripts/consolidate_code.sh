#!/bin/bash

# Script to consolidate all relevant source code files into a single output file

OUTPUT_FILE="consolidated_code.txt"

# Excluded directories
EXCLUDE_DIRS=("node_modules" "dist" "build" ".git")

# Relevant file extensions
RELEVANT_EXTENSIONS=("js" "jsx" "ts" "tsx" "json" "env" "eslintrc" "config")

# Generate directory structure using tree command
echo "Generating directory structure..."
echo "Directory Structure:" > "$OUTPUT_FILE"
tree -I "$(IFS=\|; echo "${EXCLUDE_DIRS[*]}")" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Function to check if a file has a relevant extension
is_relevant_file() {
    local file="$1"
    for ext in "${RELEVANT_EXTENSIONS[@]}"; do
        if [[ "$file" == *".$ext" ]]; then
            return 0
        fi
    done
    return 1
}

# Iterate through all files in the project
echo "Collecting relevant files..."
find . -type f | while read -r file; do
    # Skip files in excluded directories
    for exclude in "${EXCLUDE_DIRS[@]}"; do
        if [[ "$file" == ./"$exclude"/* ]]; then
            continue 2
        fi
    done

    # Check if the file has a relevant extension
    if is_relevant_file "$file"; then
        echo "Processing $file..."
        echo "File: $file" >> "$OUTPUT_FILE"
        echo "--------------------" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
done

echo "Consolidation complete. Output written to $OUTPUT_FILE."