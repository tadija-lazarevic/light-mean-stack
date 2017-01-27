var gulp       = require('gulp');
var sass       = require('gulp-sass');
var jshint     = require('gulp-jshint');
var uglify     = require('gulp-uglify');
var beautify   = require('gulp-beautify');
var concat     = require('gulp-concat');
var rename     = require('gulp-rename');
var ngmin      = require('gulp-ngmin');
var ngAnnotate = require('gulp-ng-annotate');
var cssminify  = require('gulp-minify-css');
var paths      = require('./gulp.config.json');


//script paths ,
gulp.task('build-appjs', function () {
    return gulp.src(paths.js)
        .pipe(concat('app.js', {newLine: ';'}))
        .pipe(ngAnnotate({
            add          : true,
            single_quotes: true
        }))
        .pipe(rename('app.min.js'))
        .pipe(uglify({mangle: true}))
        .pipe(gulp.dest(paths.buildjs));
});

gulp.task('build-vendorjs', function () {
    return gulp.src(paths.vendorjs)
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest(paths.buildjs));
});

gulp.task('build-css', ['css'], function () {
    return gulp.src(paths.css)
        .pipe(concat('all.min.css'))
        .pipe(cssminify({}))
        .pipe(gulp.dest(paths.buildcss));
});


gulp.task('jshint', function () {
    return gulp.src('client/app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('css', function () {
    return gulp.src('client/assets/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('client/assets/css'));
});

gulp.task('watch', function () {
    gulp.watch('client/assets/scss/**/*.scss', ['build-css']);
    gulp.watch('client/app/**/*.js', ['jshint']);
});


// define the default task and add the watch task to it
gulp.task('default', ['watch', 'jshint', 'css']);

// Build whole application and jshint it
gulp.task('build-application', ['build-appjs', 'build-vendorjs', 'build-css']);
