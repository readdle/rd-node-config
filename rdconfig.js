var fs = require('fs');
var crypto = require('crypto');
var Path = require('path');
var myCnfReader = require('./mycnfreader');

var RDConfig = function(forceEnvName){
    var CONFIG_DIR = process.env.NODE_CONFIG_DIR || Path.join(process.cwd(), 'config');
    var projectPath = Path.dirname(CONFIG_DIR);
    
    var envFilePath = projectPath + '/.env';

    this.cryptKey = 'wrong_aes_key';
    this.cryptMethod = 'aes-256-ctr';
    this.cryptedFlag = '--crypted--';

    if (fs.existsSync(envFilePath)) {
        var envFileContent = fs.readFileSync(envFilePath).toString().split(/\r?\n/);
        if(typeof forceEnvName === "string"){
            envFileContent[0] = forceEnvName
        }
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
    switch(typeof obj){
        case "string":
            if(obj.substr(0, this.cryptedFlag.length) === this.cryptedFlag) {
                var secureValue = obj.substr(this.cryptedFlag.length);
                var decipher = crypto.createDecipher(this.cryptMethod, this.cryptKey);
                obj = decipher.update(secureValue, 'hex', 'utf8');
                obj += decipher.final('utf8');
            }
            break;
        case "object":
            var decryptedObject = Array.isArray(obj) ? [] : {};
            for(var key in obj){
                var value = obj[key];
                decryptedObject[key] = this.decrypt(value);
            }
            obj = decryptedObject;
            break;
    }

    return obj;
};

RDConfig.prototype.getMyCnfParamsWithDatabase = function(database) {
    var myCnf = myCnfReader();
    
    if (database) {
        myCnf.database = database;
    }
        
    return myCnf;
}


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
