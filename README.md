# fepro

## New Version

`version 1.1.6:` <br>
+ fepro init

```js
$ fepro -i

//or in gulp project template
$ fepro -i gulp
```
initialize command read from fepro.config.init


## Insatll

```js
$ (sudo) npm install -g fepro
```

## Usage

```js
// xxx is you project folder
$ mkdir xxx
$ cd xxx
$ fepro -b gulp

//or 

$ fepro -b gulp xxx 
```

// new project please excute 

```js
$ bower install && npm install 

//or

$ fepro -i gulp

$ gulp
```

// at project build/base path same as package.json <br>
// more config in fepro.config

```js
//fepro.config
{
    "init": "bower install && npm install", //ininial command  "$ fepro -i"
    "env": "RE", //Debug 版本号为@dev 代码无压缩 非Debug 版本号为@时间戳 代码压缩
    "version": false,//!DEBUG,
    // 此功能需要安装chrome插件 "https"://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
    "livereload": true,//DEBUG,
    "minify": true,//!DEBUG,
    // 本地导出目录
    "exports": "src/export",
    "tmp": "src/tmp",
    // 以下对应命令 gulp + ''/server/sync/views/scripts/styles/images
    // 默认gulp 执行所有并watch
    "server":{ //more see servermock "https"://www.npmjs.com/package/servermock or "https"://github.com/shalles/servermock
        "port": 8080,
        "protocol": "http", //https\
        "key": "~/cert/cert.key",
        "cert": "~cert/cert.crt",
        "main": "src/export/pages/app-1.html",
        // mock请求
        "mock":{
            "datapath": "mock/",
            "pagepath": "", //page mock data path, default same as page file with .json or .mjson
            "mockrc": ".mockrc", //相对mock datapath
            "ignore": ["html", "jpg", "png", "gif"],
            "regexurl": { //前面是regex new RegExp()
                "/api/1placesuggestion" : "placesuggestion.js", //走js 遵循cmd
                "/api/1placesuggestion" : "placesuggestion.json", //
                "/api/placesuggestion" : "placesuggestion.mjson" //
            }
        }
    },
    // 需要上传到服务器的时候启用 且值为远程服务器地址 gulp sync
    "sync": {
        "flag": "az", //详细请再命令行rsync -h : shell(value): --rsh=SHELL; delete(): --delete;  progress(): --progress;  archive(): -a;  compress(): -z;  recursive(): -r;  update(): -u;  quiet(): -q;  dirs(): -d;  links(): -l;  dry(): -n;          
        "source": "src/export/*",
        "dest": "192.168.1.15:/home/shalles/workspace/www/src.shalles.org"
    },
    // 视图页面的目录和导出目录
    "views": {
        "src": "src/views/**/*",
        "exp": "src/export/pages"
    },
    // 脚本的目录和导出目录 支持coffee
    "scripts": {
        "src": "src/scripts/",
        "exp": "src/export/js"
    },
    "styles": {
        "scss": true,  //使用scss开发时设为ture
        "src": "src/styles/",
        "exp": "src/export/css"
    },
    "images": {
        "min": false,  //需要压缩图片是设为true
        "src": "src/images/**/*",
        "exp": "src/export/images"
    }
}
```


there not only support gulp template, you can build yourself projecy template <br>
just create a project folder in ~/.fepro/yourProjectFolder <br>
and excute fepro -b yourProjectFolderName

## more info

[ https://www.npmjs.com/package/servermock ](https://www.npmjs.com/package/servermock) <br>
or <br>
[ https://github.com/shalles/servermock ](https://github.com/shalles/servermock)

[ https://www.npmjs.com/package/gulp-fecmd or fecmd ](https://www.npmjs.com/package/gulp-fecmd) <br>
or <br>
[ https://github.com/shalles/gulp-fecmd ](https://github.com/shalles/gulp-fecmd) 