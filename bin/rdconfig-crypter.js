var config = require('../rdconfig.js'),
    args   = process.argv.slice(2);

var mode = args[0];
var value = args[1];

if (typeof value === 'undefined') {
    console.log('Usage: ' + process.argv[1] + ' <encrypt|decrypt> <value to encrypt>');
    process.exit(1)
}

if (mode === 'encrypt') {
    console.log(config.encrypt(value));
} else if (mode === 'decrypt') {
    console.log(config.decrypt(value));
} else {
    throw Error('Unsupported crypter command');
}