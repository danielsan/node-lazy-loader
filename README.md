If you maintain a node package that has multiple functionalities that are not necessarily interdependent you are probably exporting the functionalities on your main js file like this:
```js
module.exports = {
  feature1: require('./lib/feature1'),
  feature2: require('./lib/feature2'),
  feature3: require('./lib/feature3')
 ...
  featureN: require('./lib/featureN')
}
```

Some developers might install your node packages just because of a single one of those features, and most of them are loading your features like this:

```js
const { feature1 } = require('your-package')
...
```
### Problems
That forces their application to waste:
processing time by performing the IO operations to load files from 1...N
processing time by parsing those files and their respective require calls
memory allocation since **require** will cache all loaded files

### Workaround
Some developers can inspect your code and conclude that they can load the expected dependency like this:
```js
const feature1 = require('your-package/lib/feature1')
...
```

That works, but not just it is a minority of the users that do that, but they can run into problems if for some reason you decide to change a file name. For example:
```js
module.exports = {
  feature1: require('./lib/feature1-optimized'),
 ...
  featureN: require('./lib/featureN')
}
```

### Proposed Solution
```js
const lazy = require('@danielsan/node-lazy-loader')

module.exports = {
  get feature1 () { lazy(this, 'feature1', './lib/feature1') },
  get feature2 () { lazy(this, 'feature2', './lib/feature2') },
  get feature3 () { lazy(this, 'feature3', './lib/x', 'someExportedPropertyFromX') },
 ...
  get featureN () { lazy(this, 'featureN', './lib/featureN') }
}
```

By using getters the request will only happen when the property is read and this very package will rewrite the getter into a property with the expected value avoiding a function call the next time it is read

For example:
```js
// your-module index.js
const lazy = require('@danielsan/node-lazy-loader')

module.exports = {
  get feature1 () {
    console.log('reading feature1')
    lazy(this, 'feature1', './lib/feature1')
  }
}
```

```js
// app index.js
const module = require('your-module')

// the following line when executed will print 'reading feature1' then return the value
const a = module.feature1

// the following line will only return the value since it is not longer a getter but a property
const b = module.feature1
```

