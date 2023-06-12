rm -rf ./dist/*
node ./build.mjs
npx http-server ./dist