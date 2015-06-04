var gulp = require('gulp');
var bower = require('gulp-bower-files');
gulp.task('bower', function () {
    bower().pipe (gulp.dest('libs'));
});