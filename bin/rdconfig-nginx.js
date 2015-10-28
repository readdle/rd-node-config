var config = require('../rdconfig.js'),
    fs = require('fs'),
    ejs = require('ejs');

if (!config.has('nginx')) {
    console.error("ERROR: unable to compile nginx.conf, can't load app config");
    process.exit(1);
}

var configDir = process.env.NODE_CONFIG_DIR || process.cwd() + "/config";

if (!fs.existsSync(configDir + "/nginx/template.ejs")) {
    console.error("ERROR: unable to compile nginx.conf, template.ejs not found in " + configDir + "/nginx");
    process.exit(1);
}

var tmpl = fs.readFileSync(configDir + "/nginx/template.ejs").toString();
var nginxPath = configDir + "/nginx/_generated.conf";

fs.writeFile(nginxPath, ejs.render(tmpl, config.get('nginx')), function (err) {
    if (err) {
        return console.error(err);
    }
    console.log("updated nginx.conf in " + nginxPath);
});

