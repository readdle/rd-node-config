# rdconfig

## define your environment on special config file

.env

```
ENV_NAME
CRYPT_KEY
```

all configs for each environment may be stored at {ENV_NAME}.json files

## crypt your configs values

config/test.json

```json
{
    "test1": "--crypted--7136fef387",
    "test2": "--crypted--7136fef384",
    "test3": "--crypted--7136fef385",
    "testObj": {
        "test1": "--crypted--7136fef387",
        "test2": "--crypted--7136fef384",
        "test2": "--crypted--7136fef385"
    },
    "integer": 5,
    "bool": true,
    "array": [34, 34, "test", "--crypted--7136fef385"],
    "mixedObject": {
        "test1": "--crypted--7136fef387",
        "test2": "--crypted--7136fef384",
        "test2": "--crypted--7136fef385",
        "integer": 5,
        "bool": true,
        "array": [34, 34, "test", "--crypted--7136fef385"]
    }
}
```

.env

```
test
STr0nG_CrYpT_KeY
```

main.js

```js
config = require("rdconfig");

console.log(config.get("test1"));
console.log(config.get("test2"));
console.log(config.get("test3"));

console.log(config.get("testObj"));

console.log(config.get("integer"));
console.log(config.get("bool"));
console.log(config.get("array"));

console.log(config.get("mixedObject"));
```

output:

```
test1
test2
test3
{ test1: 'test1', test2: 'test3' }
5
true
{ '0': 34, '1': 34, '2': 'test', '3': 'test3' }
{ test1: 'test1',
  test2: 'test3',
  integer: 5,
  bool: true,
  array: { '0': 34, '1': 34, '2': 'test', '3': 'test3' } }
```

this package is based on [lorenwest/node-config](https://github.com/lorenwest/node-config) package and depends on it