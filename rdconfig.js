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
        this.cryptKey = envFileContent[1];
    }

    this.config = require('config');
};

RDConfig.prototype.encrypt = function(value) {
    var cipher = crypto.createCipher(this.cryptMethod, this.cryptKey);
    var crypted = cipher.update(value,'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

RDConfig.prototype.decrypt = function(value){
    var decipher = crypto.createDecipher(this.cryptMethod, this.cryptKey);
    var dec = decipher.update(value, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};

RDConfig.prototype.get = function(property, undefined){
    var configValue = this.config.get(property);

    if (typeof configValue === 'string' && configValue.substr(0, this.cryptedFlag.length) === this.cryptedFlag) {
        configValue = configValue.substr(this.cryptedFlag.length);

        return this.decrypt(configValue);
    }

    return configValue;
};

RDConfig.prototype.getConfigObj = function(){
    return this.config;
};

module.exports = new RDConfig();
