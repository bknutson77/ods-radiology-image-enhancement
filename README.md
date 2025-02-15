To install, do the following:

npm install


Then, under node_modules/daikon, open the package.json and add the following, browser dictionary. The package.json file should look like:

{
  "name": "daikon",
  "version": "1.2.46",
  "description": "A JavaScript DICOM reader.",
  "main": "src/main.js",
  "browser": {
    "fs": false,
    "path": false,
    "os": false,
    "net": false,
    "tls": false
  },
  "directories": {
    "test": "tests"
  },
  "dependencies": {
    "@wearemothership/dicom-character-set": "^1.0.4-opt.1",
    "jpeg-lossless-decoder-js": "2.0.7",
    "pako": "^2.1",
    "fflate": "*",
    "xss": "1.0.14"
  },
  "devDependencies": {
    "esbuild": "*",
    "browserify": "*",
    "uglify-js": "*",
    "full-icu": "*",
    "icu4c-data": "*",
    "jsdoc-to-markdown": "*",
    "mocha": "*"
  },
  "scripts": {
    "test": "NODE_ICU_DATA=./node_modules/icu4c-data/ && mocha --timeout 0 tests",
    "build": "rm -rf build; mkdir build; esbuild src/main.js --bundle --global-name=daikon --platform=node --outfile=build/daikon.js; esbuild src/main.js --bundle --global-name=daikon --platform=node --minify --outfile=build/daikon-min.js",
    "build-old": "rm -rf build; mkdir build; browserify --standalone daikon src/main.js -o build/daikon.js; uglifyjs build/daikon.js -o build/daikon-min.js",
    "release": "rm release/current/*.js; cp build/*.js release/current/.",
    "doc": "rm -rf build; mkdir build; ./node_modules/.bin/jsdoc2md src/*.js > build/docs.md"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/rii-mango/Daikon.git"
  },
  "keywords": [
    "JavaScript",
    "DICOM"
  ],
  "author": "Michael Martinez",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/rii-mango/Daikon/issues"
  },
  "homepage": "https://github.com/rii-mango/Daikon"
}



To build, do the following:

npm build

To start, do the following:

npm start