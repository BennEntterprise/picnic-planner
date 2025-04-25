#!/usr/bin/env node
// This script checks the Node.js and npm versions against the required versions specified in package.json.
// It should be run from the project root directory where package.json is located.
// If the script is not run from the project root, it will exit with an error message.

// check-versions.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the location from where the script is being executed
const rootDir = process.cwd();

// Check if the script is being executed from the project root
// We use "turbo.json" as a marker file to identify the project root, 
// becaue subprojects may ALSO have a package.json file.
if (!fs.existsSync(path.join(rootDir, 'turbo.json'))) {
    console.error('This script should be run from the project root directory.');
    process.exit(1);
}

function parseVersion(version) {
    return version.split('.').map(Number);
}

function versionSatisfies(current, required) {
    const currentParts = parseVersion(current.replace(/^v/, ''));
    const requiredParts = parseVersion(required.replace(/^[^0-9]*/, ''));

    for (let i = 0; i < requiredParts.length; i++) {
        if (currentParts[i] > requiredParts[i]) return true;
        if (currentParts[i] < requiredParts[i]) return false;
    }
    return true;
}

function checkVersions() {
    // Read package.json
    const packageJsonPath = path.resolve(rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Get the REQUIRED Node.js and npm versions
    const requiredNodeVersion = packageJson.engines && packageJson.engines.node;
    const requiredNpmVersion = packageJson.engines && packageJson.engines.npm;
    console.log(`Required Node.js version: ${requiredNodeVersion}`);
    console.log(`Required npm version: ${requiredNpmVersion}`);

    if (!requiredNodeVersion && !requiredNpmVersion) {
        const message = 'HEY AUTHORS! No specific Node.js or npm version specificed in package.json, what happened???'
        console.error(`❌ Error: ${message}`);
        throw new Error(message);
    }

    // Get the CURRENT Node.js and npm versions
    const currentNodeVersion = process.version;
    const currentNpmVersion = execSync('npm --version').toString().trim();
    console.log(`Current Node.js version: ${currentNodeVersion}`);
    console.log(`Current npm version: ${currentNpmVersion}`);

    // Check Node.js version
    if (requiredNodeVersion && !versionSatisfies(currentNodeVersion, requiredNodeVersion)
        || requiredNpmVersion && !versionSatisfies(currentNpmVersion, requiredNpmVersion)) {
        console.error(`❌ Error: Node.js version ${currentNodeVersion} does not satisfy the required version ${requiredNodeVersion}. Check out [Nvm](https://github.com/nvm-sh/nvm) or [N](https://github.com/tj/n) to manage multiple versions of node.`);
        process.exit(1);
    }

    console.log('✅ Node.js and npm versions are compatible.');
}

checkVersions();
