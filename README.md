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

In your `gulpfile.js`, add the task:

```js

var gulp = require('gulp')
  , rename = require('gulp-rename')
  , fontelloConfig = require('gulp-fontello-config');

gulp.task('generate-fontello-fonts', function() {
    gulp.src('test/src/index.html')
        .pipe(fontelloConfig())
        .pipe(rename('config.json'))
        .pipe(gulp.dest('build'));
});

// Gulp Default Task
gulp.task('default', ['generate-fontello-fonts']);

```

See `build` for output.


Use the `fontello-cli` package to download your fonts.


```js

var gulp = require('gulp')
  , rename = require('gulp-rename')
  , fontelloConfig = require('gulp-fontello-config')
  , exec = require('child_process').exec;

gulp.task('generate-fontello-fonts', function() {
    gulp.src('test/src/index.html')
        .pipe(fontelloConfig())
        .pipe(rename('config.json'))
        .pipe(gulp.dest('build'));
});

exec('fontello-cli install --config ./build/config.json --css ./test/src/assets/css --font ./test/src/assets/font');

// Gulp Default Task
gulp.task('default', ['generate-fontello-fonts']);

```

See `test/src/assets` for output.

Now you can add the tag `link` in your HTML by using `gulp-inject-string`:


```js

var gulp = require('gulp'),
    inject = require('gulp-inject-string');

gulp.task('inject:after', function(){
    gulp.src('test/src/index.html')
        .pipe(inject.after('</title>', '\n<link rel="stylesheet" href="assets/css/fontello.css">\n'))
        .pipe(gulp.dest('build'));
});

```


### Using options

You can use aliases to simplify your HTML code. For example, instead to use `fontawesome icon-facebook`, you can use `fa icon-facebook`.

```html

<html>
  <head>
    <title>Test file with alias and prefix</title>
  </head>
  <body>
    <i class="fa fa-home"></i>
    <i class="fa fa-book"></i>
    <i class="fa fa-pencil"></i>
    <i class="fa fa-cog"></i>
  </body>
</html>

```

In your `gulpfile.js`:

```js

var gulp = require('gulp')
  , rename = require('gulp-rename')
  , fontelloConfig = require('gulp-fontello-config');

// The default options
var options = {
       name: 'fontello',        // The font name. Will be used as file name
       prefix: 'fa-',           // The default css prefix
       suffix: false,           // The css suffix
       hinting: 1000,
       units: 1000,             // Units per em
       ascent: 85,
       alias: {                 // Alias to use for parsing
          fontawesome: 'fa',
          fontelico: 'fo',
          entypo: 'en'
       },
       done: function(config) { // The callback function
            // you can change config object here
            // config.glyphs contains glyphs
       }
    };

gulp.task('generate-fontello-fonts', function() {
    gulp.src('test/src/alias-with-prefix.html')
        .pipe(fontelloConfig(options))
        .pipe(rename('config.json'))
        .pipe(gulp.dest('build'));
});

```