// Base Gulp File
var gulp = require('gulp')
  , rename = require('gulp-rename')
  , fontelloConfig = require('./')
  , exec = require('child_process').exec;

gulp.task('generate-fontello-fonts', function() {
    gulp.src('test/fixtures/index.html')
        .pipe(fontelloConfig())
        .pipe(rename('config.json'))
        .pipe(gulp.dest('test/fixtures/build'));
});

exec('fontello-cli install --config ./test/fixtures/build/config.json --css ./test/fixtures/assets/css --font ./test/fixtures/assets/font');

// Gulp Default Task
gulp.task('default', ['generate-fontello-fonts']);