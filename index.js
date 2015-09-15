
var copy = require('copy-dir'),
	path = require('path'),
	gutils = require("./lib/utils-gulp"),
	fs = require('fs');

var root = __dirname,
	cwd = process.cwd(),
	cmdIdx = 2;

function excuteCommand(cmds){
	var cmd;
	while(cmd = cmds[cmdIdx]){
		excuteSingleCommand(cmd);
	}
}
function excuteSingleCommand(cmd){
	switch(cmd){
		case '-b': 
			buildProject(process.argv[3]);
			cmdIdx += 2;
			break;
		case 'init':
			break;
		case '-h':
		default:
			cmdIdx++;
			console.log(
				"----------------------------fepro---------------------------\n",
				"\n-b\tbuild project use template[gulp, demo, ...]",
				"\n-h\thelp?"
			);
			break;
	}
}
function buildProject(name){
	
	console.log('log-----------------------------------');
	console.log('cwd=',cwd);
	console.log('root=',root);
	var src = path.join('~/.fepro/', name), //path.join(root, 'src/proTpl/', name),
		dist = cwd;

	if(!fs.existsSync(src) && !fs.existsSync(src = path.join(root, 'src/proTpl/', name))){
		return;
	}

	copy.sync(src, dist, 
		function(_stat, _path, _file){
			var stat = true;
			if (_stat === 'file' && path.extname(_path) === '.setting') {
				// copy files, without .html 
				stat = false;
			} else if (_stat === 'directory' && _file === '.svn') {
				// copy directories, without .svn 
				stat = false;
			}
			
			console.log((stat ? "copy " : "filter ") + _path);
			
			return stat;
		}, 
		function(err){
			console.log('ok');
  		}
  	);
}

module.exports = {
	gulpUtils: gutils,
	excuteCommand: excuteCommand
}