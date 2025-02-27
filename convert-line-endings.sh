#!/bin/bash

# Script to convert CRLF line endings to LF for all text files
# Excluding /ios, /node_modules, and .github directories

echo "Converting CRLF to LF line endings..."

# Find all files, excluding specified directories and hidden files
find . -type f \
-not -path "*/\.git/*" \
-not -path "*/ios/*" \
-not -path "*/node_modules/*" \
-not -path "*/\.github/*" | while read -r file; do

# Check if file is a text file using the 'file' command
if file "$file" | grep -q "text"; then
    # Check if file contains CRLF
    if grep -q $'\r' "$file"; then
    echo "Converting: $file"
    # Create a temporary file for conversion
    tr -d '\r' < "$file" > "$file.tmp"
    mv "$file.tmp" "$file"
    fi
fi
done

echo "Conversion complete!"

# Make the script executable after creation
chmod +x convert-line-endings.sh

