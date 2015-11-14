// Base Gulp File
var gulp = require('gulp')
  , rename = require('gulp-rename')
  , inject = require('gulp-inject-string')
  , fontelloConfig = require('./')
  , exec = require('child_process').exec;

gulp.task('generate-fontello-fonts', function() {
    gulp.src('test/src/index.html')
        .pipe(fontelloConfig())
        .pipe(rename('config.json'))
        .pipe(gulp.dest('build'));
});

gulp.task('generate-fontello-fonts', function() {
    gulp.src('test/src/index.html')
    .pipe(fontelloConfig({
        alias: {
            fontawesome: 'fa'
        },
        done: function(config) {
            config.name = 'font'; // Change the font name
            console.log(config)
            // To change the class prefix, use this:
            //         config.css_prefix_text = 'fa-';
        }
    }))
    .pipe(rename('config.json'))
    .pipe(gulp.dest('build'));
});

// gulp.task('generate-fontello-fonts-alias', function() {
//     gulp.src('test/src/alias.html')
//         .pipe(fontelloConfig({
//             fontawesome: 'fa',
//             fontelico: 'fo',
//             entypo: 'en',
//             typicons: 'ti',
//             iconic: 'ic'
//         }))
//         .pipe(rename('config.json'))
//         .pipe(gulp.dest('build'));
// });

gulp.task('generate-fontello-fonts', function() {
    gulp.src('test/src/alias-with-prefix.html')
    .pipe(fontelloConfig({
        prefix: 'fa-',
        alias: {
            fontawesome: 'fa'
        }
    }))
    .pipe(rename('config.json'))
    .pipe(gulp.dest('build'));
});

exec('fontello-cli install --config ./build/config.json --css ./build/assets/css --font ./build/assets/font');


gulp.task('inject-font-link', function(){
    gulp.src('test/src/index.html')
    .pipe(inject.after('</title>', '\n<link rel="stylesheet" href="assets/css/font.css">\n'))
    .pipe(gulp.dest('build'));
});

gulp.task('inject-font-link', function(){
    gulp.src('test/src/alias-with-prefix.html')
    .pipe(inject.after('</title>', '\n<link rel="stylesheet" href="assets/css/fontello.css">\n'))
    .pipe(gulp.dest('build'));
});

// Gulp Default Task
gulp.task('default', ['generate-fontello-fonts', 'inject-font-link']);