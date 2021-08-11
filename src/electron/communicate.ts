import {execSync} from "child_process"
import fetch from 'node-fetch'
import path from "path"
import {startingService} from "./notify";
import type {PLACE} from "../const";
import {version} from '../../package.json'
import Store from './store'

function timeout(ms: number, promise: Promise<any>) {
    return new Promise<any>((resolve, reject) => {
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

function sleep(ms: number) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

async function startService() {
    startingService()
    try {
        if ((execSync('schtasks /tn "MyTasks\\iasa-ip"') as any).stderr) throw new Error()
        execSync('schtasks /run /tn "MyTasks\\iasa-ip"')
        await sleep(5000)
        await timeout(500, fetch('http://localhost:5008'))
    } catch (e) {
        execSync(path.join(__dirname, '..', '..', '..', '..', 'res', `IP_SERVICE_${version}.exe`))
    }
}

export function startBackend(run = true) {
    return new Promise((resolve) => {
        timeout(500, fetch('http://localhost:5008')).then(() => {
            resolve(true)
        }).catch(async () => {
            if (run) await startService()
            setTimeout(() => {
                startBackend(false).then(() => {
                    resolve(true)
                })
            }, 500)
        })
    })
}

export async function changeToPlace(place: PLACE) {
    if (!Store.get('userId')) return false
    await startBackend();
    let result = (await (await fetch("http://localhost:5008/change", {
        method: 'POST',
        body: JSON.stringify({place: place, adapter: "Wi-Fi", id: Store.get('userId')}),
        headers: {'Content-Type': 'application/json'},
    })).json())
    return result.success;

}