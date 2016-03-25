var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec;

var cwd = process.cwd(),
    flagWin = /\w:/.test(cwd),
    regComment = /(\/\*(?:[^*]|[\r\n]|(?:\*+(?:[^*\/]|[\r\n])))*\*+\/)|(?:[^:](\/\/.*))/g;

function getUserDir() {
    var regx = flagWin ? '/\w:\\Users\\\w+/' : /\/Users\/\w+/,
        match = cwd.match(/\/Users\/\w+/g);

    return match ? match[0] : '';
}

function copySync(from, to, filter, cb){
    if (!fs.existsSync(from)) {
        console.log('source file ', from, ' is not exists.');
        return;
    }
    try{
        copyDirSync(from, to, filter, cb);
        return {status: true, msg: "copy successful"};
    } catch(err){
        console.log(err);
        return {status: false, msg: err};
    }
}
function copyDirSync(from, to, filter, cb) {
    //console.log('copy from:\n', from, '\nto: \n', to);
    var stat = fs.statSync(from);

    if(cb ? !cb(from, to): false) return;

    if (stat.isDirectory()) {

            var list = fs.readdirSync(from);

            try{
                fs.mkdirSync(to);
            }catch(e){
                console.log("copy cover: ", to);
            }

            for(var i = list.length - 1; i > -1; i--){
                var _from = path.join(from, list[i]),
                    _to = path.join(to, list[i]);

                arguments.callee(_from, _to, filter, cb);
            };

    } else if (stat.isFile()) {

        if(filter && filter.indexOf(path.extname(from)) > -1) return;

        fs.writeFileSync(to, fs.readFileSync(from, 'binary'), 'binary');
    }

}

function projectInit(name){
    var cmd = '', config = readJson(path.join(process.cwd(), 'fepro.config'));
    switch(name){
        case 'gulp':
            cmd = config && config.init || 'bower install && npm install';
            break;
        default:
            cmd = config && config.init || '';
            break;
    }

    if(!cmd){
        console.log("please check you command or fepro.config.init command");
        return;
    }

    console.log("initial could excute many minutes ...");
    try{
        exec(cmd, function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
              console.log('exec error: ' + error);
            }else{
                console.log("initial finished successfully");
            }
        });
    } catch(err){
        console.log("initial error, please try to excute : ", cmd);
    }
}

function simpleTemplate(str, data) {

    if (!str || !data) return '';

    var type = Object.prototype.toString.call(data),
        strRes = '',
        regex = /\{\{\s*(\w+)\s*\}\}/g;

    switch (type) {
        case '[object Array]':
            for (var i = 0, len = data.length; i < len; i++) {
                strRes += simpleTemplate(str, data[i]);
            }
            break;
        case '[object Object]':
            strRes = str.replace(regex, function ($0, $1) {
                return data[$1];
            });
            break;
        case '[object String]':
            strRes = str.replace(regex, data);
            break;
        default:
            strRes = '';
    }

    return strRes;
}

function clearJs(str){
    var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g;
    return str.replace(reg, function(word) {
        return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word;
    });
}

function readFile(filepath){
    return fs.existsSync(filepath) ? fs.readFileSync(filepath, 'utf8').toString() : "";
}

function readJson(filepath){
    var json = '', content = '';
    if(fs.existsSync(filepath)){
        try{
            content = clearJs(readFile(filepath));
            json = JSON.parse(content);
            //log("open json file: " + filepath, content);
        } catch(e){
            log(chalk.red("json file error:"), filepath, e);
        }
    }
    return json;
}

function classof(o) {
    return Object.prototype.toString.call(o).slice(8,-1);
}

function extend(){
    var iterator = {
        stack: [],
        reset: function(){
            stack = [];
        },
        watch:function(co, cb){ // co对象或数组 这里不做额外判断
            if(this.stack.indexOf(co) > -1) return;
            this.stack.push(co), cb();
        }
    };

    function copy(to, from, deep){
        for(var i in from){
            var fi = from[i];
            if(!deep){
                if(fi !== undefined){
                    to[i] = fi;
                }
            }else{
                var classFI = classof(fi), 
                    isArr = classFI === 'Array', 
                    isObj = classFI === 'Object';
                if(isArr || isObj){
                    var tiC = classof(to[i]);

                    isArr ? tiC !== 'Array' && (to[i] = []) : 
                            tiC !== 'Object' && (to[i] = {});

                    iterator.watch(fi, function(){
                        copy(to[i], fi, deep);
                    });
                }else{
                    if(fi !== undefined){
                        to[i] = fi;
                    }
                }
            }
        }
    }

    var re, len = arguments.length, deep, i = 0;

    deep = arguments[i] === true ? (i++, true): false;
    re   = arguments[i++];

    for(i; i < len; i++){
        classof(arguments[i]) === 'Object' && copy(re, arguments[i], deep);
    }

    return re;
}

module.exports = {
    extend: extend,
    simpleTemplate: simpleTemplate,
    readFile: readFile,
    clearJs: clearJs,
    copySync: copySync,
    readJson: readJson,
    getUserDir: getUserDir,
    projectInit: projectInit
}