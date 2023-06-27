rm -rf ./dist/*
node ./build.mjs
node ./themes/build.js
npx http-server ./dist