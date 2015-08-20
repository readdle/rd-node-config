var config = require('../rdconfig.js'),
        fs = require('fs'),
       ejs = require('ejs');

if (!config.has('nginx')) {
    console.log("ERROR: unable to compile nginx.conf, can't load app config")
    process.exit(1);
}


var tmpl = fs.readFileSync("config/nginx.conf.ejs").toString();
var nginx_path = "system/nginx.conf";

fs.writeFile(nginx_path, ejs.render(tmpl, config.get('nginx')), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("updated nginx.conf in " + nginx_path);
});

