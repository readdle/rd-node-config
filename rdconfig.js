var fs = require('fs');

var RDConfig = function(){
    var projectPath = process.cwd();
    var envFilePath = projectPath + '/.env';

    if (fs.existsSync(envFilePath)) {
        process.env['NODE_ENV'] = fs.readFileSync(envFilePath).toString();
    }

    this.config = require('config');
};

RDConfig.prototype.get = function(property){
    // @todo crypt/decrypt values

    return this.config.get(property);
};

RDConfig.prototype.getConfigObj = function(){
    return this.config;
};

module.exports = new RDConfig();