/*
 * gulpfile.js
 * shalles
 * 2015.08.12
 */

'use strict';

/*==START========================================================================*/
var del = require('del'),
    path = require('path'),
    gulp = require('gulp'),
    Rsync = require('rsync'),
    rev = require('gulp-rev'),
    jade = require('gulp-jade'),
    coffee = require('gulp-coffee'),
    uglify = require('gulp-uglify'),
    compass = require('gulp-compass'),
    gulpFecmd = require('gulp-fecmd'),
    config = require('./fepro.config'),
    imagemin = require('gulp-imagemin'),
    minifyCSS = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    revreplace = require('gulp-rev-replace');

var dep = [],
    DEBUG = config.env === 'DEBUG',
    stylesSuffix = config.styles.scss ? '/*.scss' : '/*.css',
    scriptSuffix = config.scripts.coffee ? '/*.coffee' : '/*.js';

function log(msg){
    var str = '-',
        len = 60 - msg.length;
    len = len > 0 ? len/2 : 0;
    
    for(var i = 0; i < len; i++){
        str += str;
    }
    console.log(str + msg + str);
}

function sync(remote, msg){
    
    var remote = config.remote,
        rsync = new Rsync()
          .shell('ssh')
          .flags(remote.flags || 'az')
          .source(remote.suorce)
          .destination(remote.dest);
         
    rsync.execute(function(error, code, cmd) {
        console.log('err: ', error, '\ncode: ', code, '\ncmd: ', cmd);
        code ===0 && log(msg);
    });
}

config.styles && 
dep.push('styles') && 
gulp.task('styles', function() {
    var data = config.styles.scss ? 
                gulp.src(config.styles.src + stylesSuffix)
                    .pipe(compass({
                        css: config.styles.src + '/css',
                        sass: config.styles.src,
                        style: 'expanded' //:nested, :expanded, :compact, or :compressed
                    }))
                    .on('error', function(error) {
                        console.log(error);
                        //this.emit('end');
                    }) :
                gulp.src(config.styles.src + stylesSuffix);
    
    config.minify && (data = data.pipe(minifyCSS()));

    config.livereload && data.pipe(livereload());

    config.version ? 
        data.pipe(rev())
            .pipe(gulp.dest(config.styles.exp))
            .pipe(rev.manifest('css-map.json'))
            .pipe(gulp.dest(config.tmp)) :
        data.pipe(gulp.dest(config.styles.exp));

    log('styles');
});

config.scripts && 
dep.push('scripts') && 
gulp.task('scripts', function() {

    var data = config.scripts.coffee ?
                gulp.src(config.scripts.src + scriptSuffix)
                    .pipe(sourcemaps.init())
                    .pipe(coffee())
                    .on('error', function(error) {
                        console.log(error);
                    }) :
                gulp.src(config.scripts.src + scriptSuffix)
                    .pipe(sourcemaps.init());

    data = data.pipe(gulpFecmd());
    
    config.minify && (data = data.pipe(uglify()).pipe(sourcemaps.write()));

    config.livereload && data.pipe(livereload());
    
    config.version ?
        data.pipe(rev())
            .pipe(gulp.dest(config.scripts.exp))
            .pipe(rev.manifest('js-map.json'))
            .pipe(gulp.dest(config.tmp)) : 
        data.pipe(gulp.dest(config.scripts.exp));

    log('scripts');
});

// Copy all static images
config.images && dep.push('images') && 
gulp.task('images', function() {
    
    var data = gulp.src(config.images.src);

    config.images.min && (data = data.pipe(imagemin({optimizationLevel: 5})));

    data.pipe(gulp.dest(config.images.exp));

    config.livereload && data.pipe(livereload());

    log('images');
});

config.views && dep.push('views') && 
gulp.task('views', function(){

    var data =  gulp.src(config.views.src),
        manifest = gulp.src(config.tmp + '/*.json');

    config.views.jade && (data = data.pipe(jade({client: true})));

    config.version && 
        (data = data.pipe(revreplace({replaceInExtensions: ['.jade', '.html', '.vm', '.htm'], manifest: manifest})));

    data.pipe(gulp.dest(config.views.exp));

    config.livereload && data.pipe(livereload());

    log('views');
});


gulp.task('watch', dep, function() {
    livereload.listen();

    config.views && gulp.watch(config.views.src, ['views']);
    config.styles && gulp.watch(config.styles.src + stylesSuffix, ['styles']);
    config.scripts && gulp.watch(config.scripts.src + scriptSuffix, ['scripts']);
    config.images && gulp.watch(config.images.src, ['images']);
    config.version && gulp.watch(config.tmp + '/*.json', ['views']);
});

del.sync([config.exports]);

console.log("执行依赖:", dep);

// 部署
gulp.task('deploy', dep, function(){
    log("开始部署到服务器");
    log(config.remote.dest);
    sync(config.remote, "文件已部署到远程服务器");
})

//同步到服务器
gulp.task('sync', function() {
    log("开始同步到远程服务器");
    sync(config.remote, "文件已同步到远程服务器");
});

/*==END========================================================================*/

gulp.task('default', ['watch'], function(){

});
