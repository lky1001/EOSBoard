# EOS Board
This project is board app on EOS blockchain

Create react project by create-react-app
- https://github.com/facebook/create-react-app

## Install dependencies
```
$ npm install
```

## Starts the development server.
```
$ npm start
```

## Bundles the app into static files for production.
```
$ npm run build
```

## Starts the test runner.
```
$ npm test
```
## C++ Enviroment setting on VS Code.
- Download Mingw at https://sourceforge.net/projects/mingw-w64/
- Add System Variables on the Path. ex) MINGW_HOME - C:\Mingw.
- Create tasks.json and paste it.
```
   {
   "version": "2.0.0",
   "runner": "terminal",
   "type": "shell",
   "echoCommand": true,
   "presentation" : { "reveal": "always" },
   "tasks": [
   //C++ compile
   {
   "label": "save and compile for C++",
   "command": "g++",
   "args": [
   "${file}",
   "-o",
   "${fileDirname}/${fileBasenameNoExtension}"
   ],
   "group": "build",
   "problemMatcher": {
   "fileLocation": [
   "relative",
   "${workspaceRoot}"
   ],
   "pattern": {
   // The regular expression.
   //Example to match: helloWorld.c:5:3: warning: implicit declaration of function 'prinft'
   "regexp": "^(.*):(\\d+):(\\d+):\\s+(warning error):\\s+(.*)$",
   "file": 1,
   "line": 2,
   "column": 3,
   "severity": 4,
   "message": 5
   }
   }
   },

   //C++ debug
   {
   "label": "save and debugging for C++",
   "command": "g++",
   "args": [
   "${file}",
   "-g -o",
   "${fileDirname}/${fileBasenameNoExtension}"
   ],
   "group": "build",

   "problemMatcher": {
   "fileLocation": [
   "relative",
   "${workspaceRoot}"
   ],
   "pattern": {
   // The regular expression.
   //Example to match: helloWorld.c:5:3: warning: implicit declaration of function 'prinft'
   "regexp": "^(.*):(\\d+):(\\d+):\\s+(warning error):\\s+(.*)$",
   "file": 1,
   "line": 2,
   "column": 3,
   "severity": 4,
   "message": 5
   }
   }
   },

   //C compile
   {
   "label": "save and compile for C",
   "command": "gcc",
   "args": [
   "${file}",
   "-o",
   "${fileDirname}/${fileBasenameNoExtension}"
   ],
   "group": "build",
   "problemMatcher": {
   "fileLocation": [
   "relative",
   "${workspaceRoot}"
   ],
   "pattern": {
   // The regular expression.
   //Example to match: helloWorld.c:5:3: warning: implicit declaration of function 'prinft'
   "regexp": "^(.*):(\\d+):(\\d+):\\s+(warning error):\\s+(.*)$",
   "file": 1,
   "line": 2,
   "column": 3,
   "severity": 4,
   "message": 5
   }
   }
   },

   //C debug
   {
   "label": "save and debugging for C",
   "command": "gcc",
   "args": [
   "${file}",
   "-g -o",
   "${fileDirname}/${fileBasenameNoExtension}"
   ],
   "group": "build",
   "problemMatcher": {
   "fileLocation": [
   "relative",
   "${workspaceRoot}"
   ],
   "pattern": {
   // The regular expression.
   //Example to match: helloWorld.c:5:3: warning: implicit declaration of function 'prinft'
   "regexp": "^(.*):(\\d+):(\\d+):\\s+(warning error):\\s+(.*)$",
   "file": 1,
   "line": 2,
   "column": 3,
   "severity": 4,
   "message": 5
   }
   }
   },

   // execute binary
   {
   "label": "execute",
   "command": "cmd",
   "group": "test",
   "args": [
   "/C", "${fileDirname}\\${fileBasenameNoExtension}"
   ]
   }
   ]
   }
```
