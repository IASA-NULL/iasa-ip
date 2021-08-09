import {app, dialog, ipcMain, shell} from 'electron';
import {createMainWindow} from "./mainWindow";
import {createTray} from "./tray"
import Store from './store'
import {changedToPlace, pausedAutomaticChange} from "./notify"
import {PLACE} from "../const";
import {changeToPlace, startBackend} from "./communicate";
import wifiName from 'wifi-name'

let mainWindow
let updatingIP = false, currentPlace: PLACE

let sessionPauseAutomaticChange = false

function openMainWindow() {
    if (mainWindow) {
        mainWindow.show()
        mainWindow.focus()
        return
    }
    mainWindow = createMainWindow(false)
    mainWindow.once('close', () => {
        mainWindow = null;
    })
}

function askStopService() {
    const dialogOptions = {
        type: 'info',
        buttons: ['예', '아니요'],
        message: '서비스를 종료하면 IP가 자동으로 바뀌지 않습니다.\n정말로 종료할까요?',
        title: "IP"
    };
    dialog.showMessageBox(dialogOptions).then(res => {
        if (!res.response) app.exit();
    });
}

function getWifiName() {
    try {
        return wifiName.sync();
    } catch (e) {
        return null;
    }
}

async function changeToPlaceProcess(place: PLACE) {
    await changeToPlace(place)
    currentPlace = place
    Store.set("currentPlace", place)
}

async function autoIPUpdate() {
    const wifiName = await getWifiName();
    if (updatingIP && wifiName !== null && !sessionPauseAutomaticChange) {
        updatingIP = false;
        if (mainWindow == null) {
            if (wifiName === "Iasa_hs" && await currentPlace !== PLACE.school) {
                await changeToPlaceProcess(PLACE.school)
                changedToPlace(PLACE.school)
            }
            if (wifiName !== "Iasa_hs" && await currentPlace !== PLACE.home) {
                await changeToPlaceProcess(PLACE.home)
                changedToPlace(PLACE.home)
            }
        }
    }
    updatingIP = true;
}

function init() {
    app.setAppUserModelId("com.null.ip");
    createTray({openMainWindow: openMainWindow, askStopService: askStopService})
    currentPlace = Store.get('currentPlace') as PLACE
    if (currentPlace === PLACE.unknown) Store.set('currentPlace', PLACE.home)
    startBackend().then()
}

app.on('ready', init);

app.on('window-all-closed', async e => {
    e.preventDefault();
});

ipcMain.on("close", askStopService);

ipcMain.on("openWebPage", (event, src: string) => {
    shell.openExternal(src).then()
});

ipcMain.on("enableAutomaticChange", (event) => {
    sessionPauseAutomaticChange = false
});

ipcMain.on("isAutomaticPaused", (event => {
    if (mainWindow) mainWindow.webContents.send("isAutomaticPausedHandler", sessionPauseAutomaticChange);
}))

ipcMain.on("get", (e, key: string) => {
    if (mainWindow) mainWindow.webContents.send("getHandler", {key: key, value: Store.get(key)});
});

ipcMain.on("set", (e, data: { key: string, value: any }) => {
    Store.set(data.key, data.value);
});

ipcMain.on("changeToPlace", async (e, place: PLACE) => {
    if (!sessionPauseAutomaticChange) pausedAutomaticChange()
    sessionPauseAutomaticChange = true
    await changeToPlaceProcess(place)
    if (mainWindow) mainWindow.webContents.send("changeToPlaceHandler")
    else changedToPlace(place)
});

setInterval(autoIPUpdate, 1000)