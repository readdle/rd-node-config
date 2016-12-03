var fs = require('fs');
var Path = require('path');
var myCnfReader = require('./mycnfreader');

var RDConfig = function(forceEnvName){
    var CONFIG_DIR = process.env.NODE_CONFIG_DIR || Path.join(process.cwd(), 'config');
    var projectPath = Path.dirname(CONFIG_DIR);
    
    var envFilePath = projectPath + '/.env';

    var cryptKey = '';

    if (fs.existsSync(envFilePath)) {
        var envFileContent = fs.readFileSync(envFilePath).toString().split(/\r?\n/);
        if(typeof forceEnvName === "string"){
            envFileContent[0] = forceEnvName
        }
        process.env['NODE_ENV'] = envFileContent[0];
        if(envFileContent.length > 1) {
            cryptKey = envFileContent[1];
        }

        cryptKey = cryptKey.substring(0, 16);
    }

    if (cryptKey.length != 16) {
        cryptKey = 'wrong_16_aes_key';
    }

    this.config = require('config');
    this.rdcrypto = require('rdcrypto')(cryptKey)
};

RDConfig.prototype.envSubstitute = function(value) {

    if (typeof value === 'string') {
        return value.replace(/\${(.+?)}/g, function(match, name) {    
            if (typeof process.env[name] === 'string') {
                return process.env[name];
            }
            return match;
        });
    }
    
    return value;
};

RDConfig.prototype.encrypt = function(value) {
    return this.rdcrypto.encrypt(value);
};


RDConfig.prototype.transform = function(obj, stringCallback){
    switch(typeof obj){
        case "string":
            return stringCallback(obj);
            break;
        case "object":
            var decryptedObject = Array.isArray(obj) ? [] : {};
            for(var key in obj){
                var value = obj[key];
                decryptedObject[key] = this.transform(value, stringCallback);
            }
            obj = decryptedObject;
            break;
    }

    return obj;
};

RDConfig.prototype.db = function () {
    var myCnf = this.getMyCnfParamsWithDatabase(this.get('db.database'));
    var conf = this.get('db');

    for(var key in myCnf) {
        conf[key] = myCnf[key];
    }
    return conf;
};

RDConfig.prototype.getMyCnfParamsWithDatabase = function(database) {
    var myCnf = myCnfReader();
    
    if (database) {
        myCnf.database = database;
    }
        
    return myCnf;
};


RDConfig.prototype.get = function(property){
    var configValue = this.config.get(property);
    configValue = this.envSubstitute(configValue);

    return this.transform(configValue, (function(value) {        
        return this.envSubstitute(this.rdcrypto.decrypt(value));
    }).bind(this));
};

RDConfig.prototype.has = function(property){
    return this.config.has(property);
};

RDConfig.prototype.getConfigObj = function(){
    return this.config;
};

module.exports = new RDConfig();
