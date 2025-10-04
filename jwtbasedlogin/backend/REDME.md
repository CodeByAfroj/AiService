BOOTSTRAPPING
1.npm init -y
2.npm i -d typescript
3.npm i express nodemon....
4.npx tsc --init
5.make changes inside ts config uncomment rootdir, outDir ,use commonjs
6.npm i @types/express
6.npx tsc


 "rootDir": "./src",
    "outDir": "./dist",

 "build": "tsc -b",
    "start": "node dist/index.js",
    "dev": "npm run build && npm run start"
