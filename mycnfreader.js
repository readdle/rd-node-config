var fs = require('fs');

module.exports = function() {
    var db = { 'host': '127.0.0.1', 'password': '' };
    var myCnfKeys = ['user', 'host', 'password', 'database'];

    if (!process.env.HOME) {
        db.user = 'no-server-home-my-cnf';
        return db;
    }

    try {
        var myCnf = fs.readFileSync(process.env.HOME + '/.my.cnf', 'utf8');
    }
    catch(e) {
        db.user = 'error-reading-my-cnf';
        return db;
    }

    var myCnfLines = myCnf.match(/[^\r\n]+/g);
    db.password = db.user = 'my-cnf-parse-err';

    myCnfLines.forEach(function(value) {
        kv = value.split('=');

        if (kv.length == 2 && myCnfKeys.indexOf(kv[0]) > -1) {
           db[kv[0]] = kv[1];
        }
    });

    return db;
};
