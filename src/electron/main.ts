import {app, dialog, ipcMain, shell} from 'electron';
import {createMainWindow} from "./window/mainWindow";
import {createTray} from "./tray"
import Store from './store'
import {changedToPlace, pausedAutomaticChange, updating} from "./notify"
import {PLACE} from "../const";
import {changeToPlace, startBackend} from "./communicate";
import wifiName from 'wifi-name'
import {autoUpdater} from 'electron-updater'
import {execSync} from "child_process";
import AutoLaunch from 'auto-launch'
import {createWelcomeWindow} from "./window/welcomeWindow";
import {createChangeIdWindow} from "./window/changeIdWindow";
import {validateUserId} from "../ui/common/validate";

let mainWindow
let updatingIP = false, currentPlace: PLACE

let sessionPauseAutomaticChange = false

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
}

app.on('second-instance', openMainWindow);

let autoLaunch = new AutoLaunch({
    name: 'IP',
    path: app.getPath('exe'),
});

autoLaunch.isEnabled().then((isEnabled) => {
    if (!isEnabled) autoLaunch.enable();
});

function openMainWindow() {
    if (mainWindow) {
        mainWindow.show()
        mainWindow.focus()
        return
    }
    const lastIPChange = Store.get('lastIdChanged')
    if (Store.get('firstRun')) createWelcomeWindow()
    else if (lastIPChange !== new Date().getFullYear() && new Date().getMonth() > 2) createChangeIdWindow()
    else if (!validateUserId(Store.get('userId') as string)) createChangeIdWindow()
    else {
        mainWindow = createMainWindow()
        mainWindow.once('close', () => {
            mainWindow = null;
        })
    }
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
    if (await changeToPlace(place)) {
        currentPlace = place
        Store.set("currentPlace", place)
        return true
    }
    return false
}

async function autoIPUpdate() {
    const wifiName = await getWifiName();
    if (updatingIP && wifiName !== null && !sessionPauseAutomaticChange) {
        updatingIP = false;
        if (mainWindow == null) {
            if (wifiName === "Iasa_hs" && await currentPlace !== PLACE.school) {
                if (await changeToPlaceProcess(PLACE.school)) changedToPlace(PLACE.school)
            }
            if (wifiName !== "Iasa_hs" && await currentPlace !== PLACE.home) {
                if (await changeToPlaceProcess(PLACE.home)) changedToPlace(PLACE.home)
            }
        }
    }
    updatingIP = true;
}

function init() {
    app.setAppUserModelId("com.null.ip");
    createTray({openMainWindow: openMainWindow, askStopService: askStopService})
    currentPlace = Store.get('currentPlace') as PLACE
    const lastIPChange = Store.get('lastIdChanged')
    if (Store.get('firstRun')) createWelcomeWindow()
    else if (lastIPChange !== new Date().getFullYear() && new Date().getMonth() > 2) createChangeIdWindow()
    else if (!validateUserId(Store.get('userId') as string)) createChangeIdWindow()
    startBackend().then()
    setTimeout(() => {
        autoUpdater.checkForUpdates().then().catch();
    }, 10000)
}

app.on('ready', init);

app.on('window-all-closed', async e => {
    e.preventDefault();
});

autoUpdater.on('update-available', () => {
    updating()
});

autoUpdater.on('update-downloaded', () => {
    try {
        execSync('schtasks /run /tn "MyTasks\\iasa-ip-stop"')
    } catch (e) {

    }
    app.exit()
});

ipcMain.on("close", askStopService);

ipcMain.on("openIdChangeWindow", () => {
    createChangeIdWindow()
});

ipcMain.on("openWebPage", (event, src: string) => {
    shell.openExternal(src).then()
});

ipcMain.on("enableAutomaticChange", () => {
    sessionPauseAutomaticChange = false
});

ipcMain.on("isAutomaticPaused", (() => {
    if (mainWindow) mainWindow.webContents.send("isAutomaticPausedHandler", sessionPauseAutomaticChange);
}))

ipcMain.on("get", (e, key: string) => {
    if (mainWindow) mainWindow.webContents.send("getHandler", {key: key, value: Store.get(key)});
});

ipcMain.on("set", (e, data: { key: string, value: any }) => {
    Store.set(data.key, data.value);
});

ipcMain.on("changeToPlace", async (e, place: PLACE) => {
    const result = await changeToPlaceProcess(place)
    if (result) {
        if (!sessionPauseAutomaticChange) pausedAutomaticChange()
        sessionPauseAutomaticChange = true
    }
    if (mainWindow) mainWindow.webContents.send("changeToPlaceHandler", result)
    else if (result) changedToPlace(place)
    else changedToPlace(PLACE.unknown)
});

setInterval(autoIPUpdate, 1000)