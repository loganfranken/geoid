var gulp = require('gulp');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');

gulp.task('default', ['minify-js']);

gulp.task('minify-js', function () {

  gulp.src('geoid.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('.'));

});
