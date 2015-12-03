
var fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    mocha = require('mocha'),
    assert = require('assert'),
    expect = require('chai').expect,
    fontelloConfig = require('../');

var indexFile = fs.readFileSync(path.join(__dirname, './src/index.html'));
var aliasWithPrefixFile = fs.readFileSync(path.join(__dirname, './src/alias-with-prefix.html'));

describe('gulp-fontello-config', function() {

    describe('index.html', function () {

        var fakeFile;

        beforeEach(function() {
            fakeFile = new gutil.File({
                base: 'test/src',
                cwd: 'test/',
                path: 'test/src/index.html',
                contents: new Buffer(indexFile)
            });
        });

        it('should find the 5 fontello named glyphs in the file', function(done) {
            var stream = fontelloConfig({
                done: function(config) {
                    assert.equal(5, config.glyphs.length);
                    done();
                }
            });

            stream.write(fakeFile);
        });
        
        it('should find the 9 fontello (named and aliased) glyphs in the file', function(done) {
            var stream = fontelloConfig({
                alias: {
                    fontawesome: 'fa',
                    fontelico: 'fo',
                    entypo: 'en',
                    typicons: 'ti',
                    iconic: 'ic',
                },
                done: function(config) {
                    assert.equal(9, config.glyphs.length);
                    done();
                }
            });
            
            stream.write(fakeFile);
        });

        it('should find nothing fontello glyphs in the file', function(done) {
            var stream = fontelloConfig({
                prefix: 'fa-',
                alias: {
                    fontawesome: 'fa'
                },
                done: function(config) {
                    assert.equal(0, config.glyphs.length);
                    done();
                }
            });

            stream.write(fakeFile);
        });
    });

    describe('alias-with-prefix.html', function () {

        var fakeFile;

        beforeEach(function() {
            fakeFile = new gutil.File({
                base: 'test/src',
                cwd: 'test/',
                path: 'test/src/alias-with-prefix.html',
                contents: new Buffer(aliasWithPrefixFile)
            });
        });

        it('should find 4 glyphs in the file', function(done) {
            var stream = fontelloConfig({
                prefix: 'fa-',
                alias: {
                    fontawesome: 'fa'
                },
                done: function(config) {
                    assert.equal(4, config.glyphs.length);
                    done();
                }
            });

            stream.write(fakeFile);
        });
    });
    
    describe('font-packs', function () {
        
        var fakeFile;
        
        beforeEach(function() {
            fakeFile = new gutil.File({
                base: 'test/src',
                cwd: 'test/',
                path: 'test/src/alias-with-prefix.html',
                contents: new Buffer(aliasWithPrefixFile)
            });
        });
        
        it('should add 47 glyphs of the font pack Meteocons', function(done) {
            var stream = fontelloConfig({
                packs: ['meteocons'],
                done: function(config) {
                    assert.equal(47, config.glyphs.length);
                    done();
                }
            });
            
            stream.write(fakeFile);
        });
    });
    
    describe('_stream', function () {
        
        it('should fail with a gulp-util.PluginError', function(done) {
            var stream = fontelloConfig._stream();
            
            stream.once('error', function(error) {
                expect(error.plugin).to.equal('gulp-fontello-config');
                done();
            });
            
            stream.write('not a buffer');
        });
        
    });
    
});
