/**
* Load javascript objects
* 
* @example
*    var jsconf = require('jsconf')
*    var config = jsconf.load('/path/to/config.jsconf')
*    console.log(config)
*    
*    var config = jsconf.parse('{x: +new Date}')
*    console.log(config)
*
* @module jsconf
*/
var exports = module.exports = {}
var vm = require('vm')
var path = require('path')
var fs = require('fs')
var format = require('util').format

/**
* Regex used to match c-style comments
*
* @attribute REGEX_C_STYLE_COMMENTS
* @type RegEx 
* @private
* @final
*/
var REGEX_C_STYLE_COMMENTS = /(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(\/{2}.*)/g

/**
* Default Context where jsconf are evaluated with
*
* @attribute DEFAULT_CONTEXT
* @type Object
* @private
* @final
*/
var DEFAULT_CONTEXT = {result: null, module: {}, fs: fs, path: path, format: format}

/**
* Current context being used to load jsconf files
*
* @attribute CONTEXT
* @type Object
* @private
*/
var CONTEXT = DEFAULT_CONTEXT

/**
* Current context being used to load jsconf files
*
* @property context
* @type Object
*/
Object.defineProperty(
    exports, 
    'context',
    {
        get: function() 
        { 
            return CONTEXT || DEFAULT_CONTEXT
        },
        set: function(context) { 
            if (context === Object(context))
            {
                if (context.result !== undefined)
                {
                    console.warn('`result` keyword is reserved, overwritting.')
                } 
                context.result = null
                CONTEXT = context
            }
            else
            {
                CONTEXT = DEFAULT_CONTEXT
            }
            return CONTEXT
        },
    }
);

/**
* Return a parsed jsconfig file as an Object
* 
* @method load
* @param filename {String}
* @param context {Object}
* @return Object|null
*/
exports.load = function (filename, context) {
    var filename = path.resolve(filename)
    if (fs.existsSync(filename))
    {
        var content = fs.readFileSync(filename, {encoding: 'utf8'})
        return this.parse(content, context)
    }
    else
    {
        throw new Error('file not found: ' + filename)
    }
}

/**
* Parse a string with jsconfig content
* 
* @method parse
* @param jsconf {String}
* @param context {Object}
* @return Object|null
*/
exports.parse = function (jsconf, context) {
    var jsconf = jsconf.replace(REGEX_C_STYLE_COMMENTS, '')
    var sandbox = context || this.context
    var jscript = vm.createScript(format('result = (%s)', jsconf))
    jscript.runInNewContext(sandbox)
    return sandbox.result
}
