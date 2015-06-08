var fs = require('fs');
var crypto = require('crypto');

var RDConfig = function(){
    var projectPath = process.cwd();
    var envFilePath = projectPath + '/.env';

    this.cryptKey = 'wrong_aes_key';
    this.cryptMethod = 'aes-256-ctr';
    this.cryptedFlag = '--crypted--';

    if (fs.existsSync(envFilePath)) {
        var envFileContent = fs.readFileSync(envFilePath).toString().split(/\r?\n/);
        process.env['NODE_ENV'] = envFileContent[0];
        if(envFileContent.length > 1) {
            this.cryptKey = envFileContent[1];
        }
    }

    this.config = require('config');
};

RDConfig.prototype.encrypt = function(value) {
    var cipher = crypto.createCipher(this.cryptMethod, this.cryptKey);
    var crypted = cipher.update(value,'utf8', 'hex');
    crypted += cipher.final('hex');
    return this.cryptedFlag + crypted;
};

RDConfig.prototype.decrypt = function(obj){
    if(typeof obj === 'string' && obj.substr(0, this.cryptedFlag.length) === this.cryptedFlag){
        var secureValue = obj.substr(this.cryptedFlag.length);
        var decipher = crypto.createDecipher(this.cryptMethod, this.cryptKey);
        var dec = decipher.update(secureValue, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }else if(typeof obj === 'string'){
        return obj;
    }

    var decryptedObject = {};

    for(var key in obj){
        var value = obj[key];
        decryptedObject[key] = this.decrypt(value);
    }

    return decryptedObject;
};

RDConfig.prototype.get = function(property){
    var configValue = this.config.get(property);

    return this.decrypt(configValue);
};

RDConfig.prototype.has = function(property){
    return this.config.has(property);
};

RDConfig.prototype.getConfigObj = function(){
    return this.config;
};

module.exports = new RDConfig();
