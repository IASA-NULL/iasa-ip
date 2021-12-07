import {execSync} from "child_process"
import fetch from 'node-fetch'
import path from "path"
import {startingService} from "./notify";
import type {PLACE} from "../const";
import {version} from '../../package.json'
import Store from './store'

function timeout(ms: number, promise: Promise<any>) {
    let fail = false;
    return new Promise<any>((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('TIMEOUT'))
            fail = true;
        }, ms)

        promise
            .then(value => {
                clearTimeout(timer)
                if (!fail) resolve(value)
            })
            .catch(reason => {
                clearTimeout(timer)
                if (!fail) reject(reason)
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
        execSync(path.join(__dirname, '..', '..', '..', '..', 'res', `IP_BACKEND.exe`))
        await sleep(2000)
        for (let i = 0; i < 10; ++i) {
            try {
                await sleep(500)
                await timeout(500, fetch('http://localhost:5008'))
                break
            } catch (e) {

            }
        }
        throw new Error()
    } catch (e) {

    }
}

export function startBackend(run = true) {
    return new Promise((resolve) => {
        timeout(500, fetch('http://localhost:5008')).then(() => {
            fetch('http://localhost:5008/register/' + Store.get('userId'))
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
