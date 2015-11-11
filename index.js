/**
 * gulp-fontello-config
 * Copyright(c) 2015 Sébastien Demanou
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var path = require('path')
  , fs = require('fs')
  , yaml = require('js-yaml');
  
var es = require('event-stream')
  , gutil = require('gulp-util');

var cheerio = require('cheerio');

var stream = function(buffer){
    return es.map(function (file, cb) {
        try {
            file.contents = new Buffer( buffer( String(file.contents) ));
        } catch (err) {
            return cb(new gutil.PluginError('gulp-fontello-config', err));
        }
        cb(null, file);
    });
};

/**
 * Load config font files
 */
var glyphs = {};
var selectors = {};
var config = require('./config.json');

const ICON_PREFIX = process.env.ICON_PREFIX || config.css_prefix_text;

fs.readdirSync('./config').forEach(function(file) {
    var doc = yaml.load(fs.readFileSync('./config/' + file, 'utf8'));
    var fileinfo = path.parse(file);
    var fontname = fileinfo.name;
    
    if (fileinfo.ext == '.yaml') {
        selectors[fontname] = [];
        
        doc.glyphs.forEach(function(glyph) {
            selectors[fontname].push(ICON_PREFIX + glyph.css);
            delete glyph.search;
            
            glyph.src = fontname;
            glyphs[fontname + '-' + ICON_PREFIX + glyph.css] = glyph;
        });
    }
});

module.exports = function(done) {
    var selected_glyphs = [];
    var selectors_clone = JSON.parse(JSON.stringify(selectors));
    
    return stream(function(fileContents){
        var $ = cheerio.load(fileContents);
        
        for (var selector in selectors_clone) {
            $('.' + selector).each(function() {
                var classes = $(this).attr('class').split(/\s/);
                
                classes.forEach(function(current_class) {
                    if (current_class === selector) {
                        return;
                    }
                    
                    var pos = selectors_clone[selector].indexOf(current_class);
                    
                    if (pos > -1) {
                        selected_glyphs.push(glyphs[selector + '-' + current_class]);
                        delete selectors_clone[selector][pos];
                        
                        $(this).removeClass(current_class);
                    }
                });
                
                $(this).removeClass(selector);
            });
        }
        
        if (selected_glyphs.length) {
            var config_clone = JSON.parse(JSON.stringify(config));
            
            config_clone.css_prefix_text = ICON_PREFIX;
            config_clone.glyphs = selected_glyphs;
            
            if (typeof done == 'function') {
                done(config_clone);
            }
            
            return JSON.stringify(config_clone, undefined, 4);
        }
        
        if (typeof done == 'function') {
            done(false);
        }
        
        return '';
    });
};

module.exports._stream = stream;