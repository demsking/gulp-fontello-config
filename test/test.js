
var fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    mocha = require('mocha'),
    assert = require('assert'),
    expect = require('chai').expect,
    fontelloConfig = require('../');

var fixtureFile = fs.readFileSync(path.join(__dirname, './fixtures/index.html'));

describe('gulp-fontello-config', function() {

    describe('parse', function () {

        var fakeFile;

        beforeEach(function() {
            fakeFile = new gutil.File({
                base: 'test/fixtures',
                cwd: 'test/',
                path: 'test/fixtures/index.html',
                contents: new Buffer(fixtureFile)
            });
        });

        it('should find fontello glyphs in the file', function(done){
            var stream = fontelloConfig(function(config) {
                assert.equal(true, config.glyphs instanceof Array);
                assert.equal(6, config.glyphs.length);
                done();
            });

            stream.write(fakeFile);
        });
    });
    
    describe('_stream', function () {
        
        it('should fail with a gulp-util.PluginError', function(done){
            var stream = fontelloConfig._stream(null, { method: 'fail' });
            
            stream.once('error', function(error){
                expect(error.plugin).to.equal('gulp-fontello-config');
                done();
            });
            
            stream.write('not a buffer');
        });
        
    });
    
});
