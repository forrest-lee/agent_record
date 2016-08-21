var gulp = require('gulp');
var livereload = require('gulp-livereload');
var webpack = require("webpack-stream");
var nodemon = require('gulp-nodemon');

var webpackConfig = require('./webpack.config.js');         // 开发环境配置
// var webpackProConfig = require('./webpack.pro.config.js');  // 生产环境配置

// webpackConfig.entry = {
//     app: './App/index.js'
// };

gulp.task("webpack", function() {
    return gulp.src('App/**/*.js')
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('./public/js'));
});


gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['App/*.js', 'App/**/*.js', 'App/**/**/*.js'], ['webpack']);
});

gulp.task('start', function() {
    nodemon({
        script: './bin/www',
        ext: 'js html',
        env: { 'NODE_ENV': 'development' }
    });
});

gulp.task('default', [
    'webpack',
    'start',
    'watch'
]);
