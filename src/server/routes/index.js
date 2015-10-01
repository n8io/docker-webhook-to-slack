var fs = require('fs');
var path = require('path');

module.exports = function(app) {
  var fileOrDirectory;
  fs.readdirSync(__dirname).forEach(function(file) {
    if(file.indexOf('index.js') > -1) {
      return;
    }

    fileOrDirectory = ['./', file.split('.js').join('')].join('');

    require(fileOrDirectory)(app);
  });
};
