import Store from 'electron-store'
import {PLACE} from "../const";

const store = new Store({
    schema: {
        userId: {
            type: 'string'
        },
        lastVer: {
            type: 'string'
        },
        autoChange: {
            type: 'boolean',
            default: true
        },
        autoVpn: {
            type: 'boolean',
            default: false
        },
        currentPlace: {
            type: 'number',
            default: PLACE.home
        },
        adapter: {
            type: 'string',
            default: 'Wi-Fi'
        },
        firstRun: {
            type: 'boolean',
            default: true
        }
    }
})

export default store