/*
 * gulpfile.js
 * shalles
 * 2015.08.12
 */

'use strict';

/*==START========================================================================*/
function utils(gulp){
    var fs = require('fs'),
        del = require('del'),
        path = require('path'),
        Rsync = require('rsync'),
        rev = require('gulp-rev'),
        utils = require('./utils'),
        uglify = require('gulp-uglify'),
        gulpFecmd = require('gulp-fecmd'),
        compass = require('gulp-compass'),
        servermock = require('servermock'),
        imagemin = require('gulp-imagemin'),
        minifyCSS = require('gulp-minify-css'),
        sourcemaps = require('gulp-sourcemaps'),
        livereload = require('gulp-livereload'),
        revreplace = require('gulp-rev-replace');

    var dep = [],
        cwd = process.cwd(),
        // config = require(path.join(cwd, 'fepro.config')),
        config = utils.readjson(path.join(cwd, 'fepro.config')),
        DEBUG = config && config.env === 'DEBUG',
        stylesSuffix = config.styles.scss ? '/*.scss' : '/*.css',
        scriptSuffix = config.scripts.coffee ? '/*.coffee' : '/*.js';

    return {
        print: function(msg) {
            var str = '-',
                len = 60 - (msg.split('')).length;
            len = (len < 0 && len > 60) ? 0 : len / 2;

            for (var i = 0; i < len; i++) {
                str += str;
            }
            console.log(len);
        },
        sync: function(remote, msg) {

            var remote = config.remote,
                rsync = new Rsync()
                .shell('ssh')
                .flags(remote.flags || 'az')
                .source(remote.suorce)
                .destination(remote.dest);

            rsync.execute(function(error, code, cmd) {
                console.log('err: ', error, '\ncode: ', code, '\ncmd: ', cmd);
                code === 0 && console.log(msg);
            });
        },
        style: style,
        script: script,
        image: image,
        watch: watch,
        watchFile: watchFile,
        view: view,
        del: dele,
        server: server,
        deploy: deploy,
        rsync: rsync
    }


    function style(cb) {
        var styles = config.styles;
        var data = styles.scss ?
            gulp.src(styles.src + stylesSuffix)
            .pipe(compass({
                css: styles.src + '/css',
                sass: styles.src,
                style: styles.style || 'expanded' //:nested, :expanded, :compact, or :compressed
            }))
            .on('error', function(error) {
                console.log(error);
                //this.emit('end');
            }) :
            gulp.src(styles.src + stylesSuffix);

        data = cb && cb(data) || data;

        config.minify && (data = data.pipe(minifyCSS()));

        config.livereload && data.pipe(livereload());

        config.version ?
            data.pipe(rev())
                .pipe(gulp.dest(styles.exp))
                .pipe(rev.manifest('css-map.json'))
                .pipe(gulp.dest(config.tmp)) :
            data.pipe(gulp.dest(styles.exp));

        console.log('styles');

        return data;
    }

    function script(cb) {
        var scripts = config.scripts;
        var data = gulp.src(scripts.src + scriptSuffix);
            
        config.env === 'DEBUG' && (data = data.pipe(sourcemaps.init()));

        data = data.pipe(gulpFecmd({type: scripts.exportType}));

        data = cb && cb(data) || data;

        config.minify && (data = data.pipe(uglify()).pipe(sourcemaps.write()));

        config.livereload && data.pipe(livereload());

        config.version ?
            data.pipe(rev())
                .pipe(gulp.dest(scripts.exp))
                .pipe(rev.manifest('js-map.json'))
                .pipe(gulp.dest(config.tmp)) :
            data.pipe(gulp.dest(scripts.exp));

        console.log('scripts');

        return data;
    }

    // Copy all static images
    function image() {
        var images = config.images;
        var data = gulp.src(images.src);

        images.min && (data = data.pipe(imagemin({
            optimizationLevel: 5
        })));

        data.pipe(gulp.dest(images.exp));

        config.livereload && data.pipe(livereload());

        console.log('images');

        return data;
    }

    function view(cb) {
        var views = config.views;
        var data = gulp.src(views.src),
            manifest = gulp.src(config.tmp + '/*.json');

        config.version &&
            (data = data.pipe(revreplace({
                replaceInExtensions: ['.jade', '.html', '.vm', '.htm', '.php'],
                manifest: manifest
            })));

        data = cb && cb(data) || data;

        data.pipe(gulp.dest(views.exp));

        config.livereload && data.pipe(livereload());

        console.log('views');
    }

    function watch(all) {
        livereload.listen();

        config.views && gulp.watch(config.views.src, ['views']);
        config.styles && gulp.watch(config.styles.src + (all ? '**' : '') + stylesSuffix, ['styles']);//stylesSuffix
        config.scripts && gulp.watch(config.scripts.src + (all ? '**' : '') + scriptSuffix, ['scripts']);//scriptSuffix
        config.images && gulp.watch(config.images.src, ['images']);
        config.version && gulp.watch(config.tmp + '/*.json', ['views']);
    }

    function watchFile(opt){
        opt = utils.extend({
            title: '',
            scriptPath: '../scripts',
            stylePath: '../styles'
        }, opt);

        gulp.watch(config.views.src, function(event){
            console.log('watch file ' + event.path, '; event type ' + event.type);
            if(event.type === 'added'){
                var extname = path.extname(event.path);
                var filename = path.basename(event.path);
                // console.log(filename);
                filename = filename.slice(0, - extname.length);
                var jsFilename = path.join(cwd, config.scripts.src, filename + '.js');
                var cssFilename = path.join(cwd, config.styles.src, filename + '.scss');
                console.log(filename, jsFilename, cssFilename);

                fs.writeFileSync(jsFilename, '// ' + filename);
                fs.writeFileSync(cssFilename, '/* ' + filename + ' */');
                console.log(path.join(__dirname, '../src/gulp-tpl/html.tpl'));
                console.log(utils.readFile(path.join(__dirname, '../src/gulp-tpl/html.tpl')))
                fs.writeFileSync(event.path, utils.simpleTemplate(
                    utils.readFile(path.join(__dirname, '../src/gulp-src/html.tpl')), {
                        title: opt.title || filename,
                        scriptPath: path.join(opt.scriptPath, filename + '.js'),
                        stylePath: path.join(opt.stylePath, filename + '.css')
                }));

            } else if(event.type === 'deleted'){

            }
        });
    }

    function server() {
        var opt = config.server;
        console.log(opt);

        servermock(opt);
    }

    function dele() {
        del.sync(config.exports);
        console.log('delete: ', config.exports);
    }

    //部署到代码
    function deploy() {
        console.log("开始部署到服务器");
        console.log(config.sync.dest);
        utils.sync(config.sync, "文件已部署到远程服务器");
    }

    //同步到服务器
    function rsync() {
        console.log("开始同步到远程服务器");
        utils.sync(config.sync, "文件已同步到远程服务器");
    }
}

module.exports = utils;
/*==END========================================================================*/
