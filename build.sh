#!/bin/bash

cd mindmap
tsc
cd ..
browserify export.js -o kk.view.js
uglifyjs -o kk.view.min.js kk.view.js
