
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');



gulp.task('lint', function() {
    return gulp.src(['src/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


gulp.task('scripts', function() {
    return gulp.src(['bower_components/underscore/underscore-min.js','bower_components/backbone/backbone.js','bower_components/knockout/dist/knockout.debug.js', 'src/**'])
        .pipe(concat('observable.js'))
        .pipe(gulp.dest('./dist'))

});


gulp.task('dist', function() {
    return gulp.src(['bower_components/underscore/backbone-min.js','bower_components/backbone/backbone.js','bower_components/knockout/dist/knockout.js', 'src/**'])
        .pipe(concat('observable.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'))

});

gulp.task('watch', function() {
    gulp.watch([ 'src/**'], ['lint', 'scripts']);
});

gulp.task('default', ['lint', 'scripts', 'watch']);