rm -rf ./dist/*
cp -r static ./dist
node ./build.mjs
node ./themes/build.js
npx http-server ./dist