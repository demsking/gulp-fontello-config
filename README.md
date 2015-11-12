# gulp-fontello-config

Parse your HTML and generate the fontello config file

## Usage

In your HTML, add the name of the fontello font and the name of the glyph (icon) you want.

```html

<!doctype html>
<html>
    <head>
        <title>Test file</title>
    </head>
    <body>
        <h1>Test file</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti, consequuntur.</p>
        <i class="fontelico icon-emo-happy"></i>
        <i class="fontelico icon-spin6"></i>
        <i class="fontawesome icon-facebook"></i>
        <i class="fontawesome icon-gplus"></i>
        <i class="entypo icon-user-add"></i>
        <i class="entypo icon-chat"></i>
        <i class="typicons icon-th-large-outline"></i>
        <i class="iconic icon-mail"></i>
        <i class="iconic icon-list"></i>
    </body>
</html>

```

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