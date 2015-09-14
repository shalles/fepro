// new project please excute 
// $ bower install && npm install
// $ gulp
// at project build/base path same as package.json
// about require more see https://github.com/shalles/gulp-fecmd
// or https://www.npmjs.com/package/gulp-fecmd or fecmd

var $ = require('jquery');
var utils = require('lib/utils');
var Calc = require('./lib/file.es6');
var PlaceSuggestion = require('./lib/ps');
var tpl = require('./tpl/html.tpl')

console.log(new Calc.Calc().add(11,22));

console.log('json', require('data/data.json'));

var start = new PlaceSuggestion({
    name: 'start'
}, $('.m-place-suggest.js-start'));