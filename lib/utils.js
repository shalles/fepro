var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec;

var cwd = process.cwd(),
    flagWin = /\w:/.test(cwd);

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
    var cmd = ''
    switch(name){
        case 'gulp':
            cmd = 'bower install && npm install';
            break;
        default:
            break;
    }
    console.log("initial could excute many minutes ...");
    exec(cmd, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }else{
            console.log("initial finished successful");
        }
    });
}

module.exports = {
    copySync: copySync,
    getUserDir: getUserDir,
    projectInit: projectInit
}