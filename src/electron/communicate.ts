import {exec, execSync} from "child_process"
import fetch from 'node-fetch'
import path from "path"

function timeout(ms, promise) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('TIMEOUT'))
        }, ms)

        promise
            .then(value => {
                clearTimeout(timer)
                resolve(value)
            })
            .catch(reason => {
                clearTimeout(timer)
                reject(reason)
            })
    })
}

function startService() {
    try {
        if ((execSync('schtasks /tn "MyTasks\\iasa-ip"') as any).stderr) throw new Error()
        execSync('schtasks /run /tn "MyTasks\\iasa-ip"')
    } catch (e) {
        exec(path.join(__dirname, '..', 'res', 'IP_SERVICE.exe'))
    }
}

export function startBackend(run = true) {
    return new Promise((resolve) => {
        timeout(500, fetch('http://localhost:5008')).then(() => {
            resolve(true)
        }).catch(() => {
            if (run) startService()
            setTimeout(() => {
                startBackend(false).then(() => {
                    resolve(true)
                })
            }, 500)
        })
    })
}

export async function changeToPlace() {
    await startBackend();
    let result = (await (await fetch('http://localhost:5008/change')).json())
}