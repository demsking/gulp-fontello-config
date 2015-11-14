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

var stream = function(buffer) {
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
var glyphs_array = [];
var selectors = {};
var config = require(path.join(__dirname, 'config.json'));

fs.readdirSync(path.join(__dirname, 'config')).forEach(function(file) {
    var doc = yaml.load(fs.readFileSync(path.join(__dirname, 'config', file), 'utf8'));
    var fileinfo = path.parse(file);
    var fontname = fileinfo.name;
    
    if (['.yml', '.yaml'].indexOf(fileinfo.ext) > -1) {
        selectors[fontname] = [];
        
        doc.glyphs.forEach(function(glyph) {
            delete glyph.meta;
            delete glyph.search;
            
            glyph.src = fontname;

            glyphs_array.push(glyph);
        });
    }
});

/**
 *
 *     example: {
 *        name: 'fontello',   // The font's name use to generate files
 *        prefix: 'icon-',    // The default css prefix
 *        suffix: false,      // The css suffix
 *        hinting: 1000,      //
 *        units: 1000,        // Units per em
 *        ascent: 85,         //
 *        alias: {            //
 *           fontawesome: 'fa',
 *           fontelico: 'fo',
 *           entypo: 'en'
 *        },
 *        done: function(config) {} // The callback function
 *     }
 * @param {object} options - A JSON object
 */
module.exports = function(options) {
    var selected_glyphs = [];
    var selectors_clone = JSON.parse(JSON.stringify(selectors));
    var glyphs = {};
    
    options = options || {};

    options.prefix = options.prefix || config.css_prefix_text;
    options.alias  = typeof options.alias == 'object'
                   ? options.alias || {}
                   : {};

    glyphs_array.forEach(function(glyph) {
        selectors_clone[glyph.src].push(options.prefix + glyph.css);
        glyphs[glyph.src + '-' + options.prefix + glyph.css] = glyph;
    })

    return stream(function(fileContents) {
        var $ = cheerio.load(fileContents);
        
        for (var selector in selectors_clone) {
            let current_selector = '.' + selector;
            
            if (typeof options.alias[selector] == 'string') {
                current_selector += ', .' + options.alias[selector];
            }
            
            $(current_selector).each(function() {
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

        var output_config = {
            name: options.name || config.name,
            css_prefix_text: options.prefix,
            css_use_suffix: options.suffix || config.css_use_suffix,
            hinting: options.hinting || config.hinting,
            units_per_em: options.units || config.units_per_em,
            ascent: options.ascent || config.ascent,
            glyphs: selected_glyphs
        };

        if (typeof options.done == 'function') {
            options.done(output_config);
        }

        return JSON.stringify(output_config, undefined, 4);
    });
};

module.exports._stream = stream;
