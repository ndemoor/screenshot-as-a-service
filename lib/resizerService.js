/**
 * Module dependencies.
 */
var fs = require('fs');
var im = require('imagemagick');

/**
 * Resizer service.
 *
 * @api public
 */
var ResizerService = function() {
  this.files = {};
  var self = this;
  process.on('exit', function() {
    // Do nothing
  });
}

ResizerService.prototype.resize = function(path, frame, callback) {
    if(frame.clipWidth > 0 && frame.clipHeight > 0) {
        console.log('Start clipping and/or resizing ' + path + ' to ' + JSON.stringify(frame));
        
        if(!fs.existsSync(path)) {
            return callback(new Error('Could not find passed file: ' + path));
        }
        
        var imOpts;
        if(frame.resizeWidth > 0 && frame.resizeHeight > 0) {
            imOpts = [
                path, 
                '-resize', frame.clipWidth+'x', 
                '-crop', frame.clipWidth+'x'+frame.clipHeight+'+0+0',
                '-resize', frame.resizeWidth+'x'+frame.resizeHeight,
                path    
            ];
        } else {
            imOpts = [
                path, 
                '-resize', frame.clipWidth+'x', 
                '-crop', frame.clipWidth+'x'+frame.clipHeight+'+0+0',
                path    
            ];
        }
        
        im.convert(imOpts, function(err, stdout, sderr) {
            if (err) return callback(new Error('Error while clipping/resizing: ' + err));
                
            console.log('Clipping and/or resizing done');
            callback(null); 
        });
    } else {
        console.log('Skip resizing to ' + frame.clipWidth + '-' + frame.clipHeight);
        callback(null);
    }
}

module.exports = ResizerService;