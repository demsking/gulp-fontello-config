# gulp-fontello-config

Parse your HTML and generate the fontello config file

## Usage

See `test/fixtures/build` for output.

```js

var gulp = require('gulp')
  , rename = require('gulp-rename')
  , fontelloConfig = require('gulp-fontello-config');

gulp.task('generate-fontello-fonts', function() {
    gulp.src('test/fixtures/index.html')
        .pipe(fontelloConfig())
        .pipe(rename('config.json'))
        .pipe(gulp.dest('test/fixtures/build'));
});

// Gulp Default Task
gulp.task('default', ['generate-fontello-fonts']);

```

### Usage with fontello-cli

See `test/fixtures/assets` for output.

```js

var gulp = require('gulp')
  , rename = require('gulp-rename')
  , fontelloConfig = require('gulp-fontello-config')
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

```