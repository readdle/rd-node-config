# rdconfig

## define your environment on special config file

.env

```
ENV_NAME
CRYPT_KEY
```

all configs for each environment may be stored at {ENV_NAME}.json files

## crypt your configs values

config/development.json

```json
{
    "secret_value": "--crypted--ac32a9bcea41090b2faec95907"
    "not_secret_value": "string"
}
```

.env

```
development
&OTd@J`M]K)Fj%@3PnmFBN,~S[6Pz$/BzY5Pl~z*sZA/qPP]ZJ
```

main.js

```js
var config = require('rdconfig');

console.log( config.get('secret_value') ); // 'secret string'
console.log( config.get('not_secret_value') ); // 'string'
```

this package is based on [lorenwest/node-config](https://github.com/lorenwest/node-config) package and depends on it