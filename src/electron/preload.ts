import {contextBridge, ipcRenderer} from 'electron'
import type {PLACE} from "../const"

contextBridge.exposeInMainWorld(
    'electron',
    {
        openWebPage: (src: string) => ipcRenderer.send('openWebPage', src),
        close: () => ipcRenderer.send('close'),
        get: (key: string) => {
            return new Promise((resolve => {
                const getHandler = (event, data: { key: string, value: any }) => {
                    if (data.key === key) resolve(data.value)
                    ipcRenderer.removeListener('getHandler', getHandler)
                }
                ipcRenderer.on('getHandler', getHandler)
                ipcRenderer.send('get', key)
            }))
        },
        set: (key: string, value: any) => ipcRenderer.send('set', {key, value}),
        changeToPlace: (place: PLACE) => {
            return new Promise(resolve => {
                ipcRenderer.once('changeToPlaceHandler', (event, res: boolean) => {
                    resolve(res)
                })
                ipcRenderer.send('changeToPlace', place)
            })
        },
        enableAutomaticChange: () => ipcRenderer.send('enableAutomaticChange'),
        isAutomaticPaused: () => {
            return new Promise(resolve => {
                ipcRenderer.once('isAutomaticPausedHandler', (event, data: boolean) => {
                    resolve(data)
                })
                ipcRenderer.send('isAutomaticPaused')
            })
        },
        openIdChangeWindow: () => ipcRenderer.send('openIdChangeWindow'),
        setUpdateChannel: (channel: string) => ipcRenderer.send('setUpdateChannel', channel),
    }
)
