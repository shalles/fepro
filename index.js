
var fs = require('fs'),
	path = require('path'),
	utils = require('./lib/utils'),
	gutils = require("./lib/utils-gulp");

var root = __dirname,
	cwd = process.cwd(),
	cmdIdx = 2;

function excuteCommand(cmds){
	var cmd;
	while(cmd = cmds[cmdIdx++]){
		excuteSingleCommand(cmd);
	}
}

function getArg(){
	var arg = ((arg = process.argv[cmdIdx]) && (arg[0] === '-')) ? '' : (cmdIdx++, arg || '');
	return arg;
}

function excuteSingleCommand(cmd){
	switch(cmd){
		case '-b': 
			var name = getArg(),
				proname = getArg();
			// console.log(proname);
			if(!name){
				console.log("please specify project template name after -b (gulp or ...).\n");
				return;
			}
			buildProject(name, proname);
			break;
		case 'init':
			break;
		case '-h':
		default:
			console.log(
				"\n----------------------------fepro---------------------------\n",
				"\n-b\tbuild project use template[gulp, demo, ...]",
				"\n-h\thelp?"
			);
			break;
	}
}
function buildProject(name, proName){
	
	console.log('fepro log-----------------------------------');
	var src = path.join(utils.getUserDir(), '.fepro/', name), //path.join(root, 'src/proTpl/', name),
		dist = path.join(cwd, proName);

	if(!fs.existsSync(src) && !fs.existsSync(src = path.join(root, 'src/proTpl/', name))){
		console.log("没有找到项目模板：", name);
		return;
	}

	var result = utils.copySync(src, dist);

  	var msg = 'fepro bulid ' + name;

	msg += result.status ? ' ok' : ' error:\n' + result.msg;
	console.log(msg);

}

module.exports = {
	gulpUtils: gutils,
	excuteCommand: excuteCommand
}