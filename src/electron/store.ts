import Store from 'electron-store'
import {PLACE} from "../const";

const store = new Store({
    schema: {
        uid: {
            type: 'number',
            default: 0
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
            default: PLACE.unknown
        },
        adapter: {
            type: 'string',
            default: 'Wi-Fi'
        }
    }
})

export default store