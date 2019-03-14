# daemonize
> daemonize a node.js application

### Example

```bash
yarn add @wangdahoo/daemonize express morgan
```

```js
const path = require('path')
const daemonize = require('@wangdahoo/daemonize')

const app = require('express')()
const port = process.env.PORT || 3000

app.use(require('morgan')('tiny'))

app.get('*', (req, res) => res.end('pong'))

app.listen(port, async () => {
    await daemonize({
        cwd: path.join(__dirname, '.')
    })
    console.info(`Listen on ${port}`)
})
```

That's all & have fun.
