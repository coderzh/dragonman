var gulp = require('gulp');
const gutil = require("gulp-util");
const gprint = require('gulp-print').default;
var webpack = require("webpack");
const vinylPaths = require('vinyl-paths');
const webpack_config = require('./webpack.config.js');
var del = require('del');

const paths = {
    build: './dist/',
    pages: ['demo/www/*.html']
};

gulp.task('clean', () => {
    return gulp.src(`${paths.build}*`)
        .pipe(gprint())
        .pipe(vinylPaths(del));
});

gulp.task('copy-html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest(`${paths.build}`));
});

gulp.task('webpack', (done) => {
    webpack(webpack_config, function (err, stats) {
        if (err) {
            throw new gutil.PluginError("webpack", err);
        }
        else {
            gutil.log("[webpack]", stats.toString());
        }
        done();
    });
});

gulp.task('default', gulp.series('clean',
    gulp.parallel('copy-html', 'webpack')));