#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Get the location from where the script is being executed
const projectRoot = process.cwd();
// Check if the script is being executed from the project root
if (!fs.existsSync(path.join(projectRoot, 'turbo.json'))) {
    console.error('This script should be run from the project root directory.');
    process.exit(1);
}

// Source and destination directories
const sourceDir = path.join(projectRoot, 'scripts/git/hooks');
const destDir = path.join(projectRoot, '.git/hooks');

// Function to copy files and set them as executable
function moveFiles(srcDir, destDir) {
    // Check if source directory exists
    if (!fs.existsSync(srcDir)) {
        console.error(`Source directory does not exist: ${srcDir}`);
        return;
    }

    // Ensure destination directory exists
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    // Read files from source directory
    fs.readdir(srcDir, (err, files) => {
        if (err) {
            console.error(`Error reading source directory: ${err}`);
            return;
        }

        files.forEach((file) => {
            const srcFile = path.join(srcDir, file);
            const destFile = path.join(destDir, file);

            // Copy file from source to destination, replacing any existing file
            fs.copyFile(srcFile, destFile, (err) => {
                if (err) {
                    console.error(`Error copying file ${file}: ${err}`);
                } else {
                    console.log(`Copied ${file} to ${destDir}`);

                    // Set the file as executable
                    exec(`chmod +x ${destFile}`, (err) => {
                        if (err) {
                            console.error(`Error setting executable permissions for ${file}: ${err}`);
                        } else {
                            console.log(`Set executable permissions for ${file}`);
                        }
                    });
                }
            });
        });
    });
}

// Execute the file moving function
moveFiles(sourceDir, destDir);
