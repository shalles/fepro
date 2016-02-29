/*
 * gulpfile.js
 * shalles
 * 2015.08.12
 */

'use strict';

/*==START========================================================================*/
var gulp = require('gulp'),
    fepro = require('fepro').gulpUtils(gulp);

var dep = ['styles', 'scripts', 'views', 'images'];

gulp.task('styles', function() {
    var data = fepro.style(function(data){
            
            return data;
        });
});

gulp.task('scripts', function() {
    var data = fepro.script(function(data){
            
            return data;
        });
});

// Copy all static images
gulp.task('images', function() {
    var data = fepro.image(function(data){
            
            return data;
        });
});

gulp.task('views', function() {
    var data = fepro.view(function(data){

            return data;
        });
});


gulp.task('watch', dep, function() {
    var data = fepro.watch(true);
});

gulp.task('server', ['watch'], function() {
    fepro.server();
});

gulp.task('del', function() {
    fepro.del();
});

// 部署
gulp.task('deploy', dep, function() {
    fepro.deploy();
})

//同步到服务器
gulp.task('sync', dep, function() {
    fepro.rsync();
});

/*==END========================================================================*/

gulp.task('default', ['server'], function() {

});