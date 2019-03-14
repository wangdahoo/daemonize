const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const createLogStream = (cwd, appname, type = 'out') =>
    new Promise((resolve, reject) => {
        const streamOptions = {
            encoding: 'utf8',
            flags: 'w'
        }

        const fileName = path.join(cwd, `${appname}.${type}.log`)

        const stream = fs.createWriteStream(fileName, streamOptions)

        stream.on('open', () => {
            resolve(stream)
        })

        stream.on('error', e => {
            reject(e)
        })
    })

module.exports = async options => {
    if (process.env.__is_daemon__) return process

    // cwd & env
    const cwd = options.cwd || process.cwd()
    const env = options.env || process.env
    env.__is_daemon__ = true

    // args
    const args = [].concat(process.argv)
    args.shift()

    // appname
    const appname =
        options.appname ||
        args[0]
            .split('/')
            .pop()
            .split('.')[0]

    // logfile
    const out = await createLogStream(cwd, appname)
    const err = await createLogStream(cwd, appname, 'err')

    // create daemon process
    const child = spawn(process.execPath, args, {
        stdio: ['ignore', out, err],
        cwd,
        env,
        detached: true
    })

    // write pidfile
    fs.writeFileSync(path.join(cwd, `${appname}.pid`), child.pid)

    // set flag & unref
    child.__is_daemon__ = true
    child.unref()

    // done and exit
    process.exit()
}
