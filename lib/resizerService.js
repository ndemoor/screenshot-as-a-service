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

ResizerService.prototype.resize = function(path, width, height, callback) {
    if(width > 0 && height > 0) {
        console.log('Start resizing ' + path);
        im.resize({
            srcData: fs.readFileSync(path, 'binary'),
            width: width,
            height: height,
            quality: 1.0,
            format: "png"
        }, function(err, stdout, sderr){
            if (err) return callback(new Error());
            fs.writeFileSync(path, stdout, 'binary');
            console.log('resized ' + path + ' to ' + width + 'px x ' + height + 'px');
            callback(null);
        });
    } else {
        console.log('Skip resizing to ' + width + '-' + height);
        callback(null);
    }
}

module.exports = ResizerService;