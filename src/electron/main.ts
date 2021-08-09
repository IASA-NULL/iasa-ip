import {app, dialog, ipcMain, shell} from 'electron';
import {createMainWindow} from "./mainWindow";
import {createTray} from "./tray"
import Store from './store'
import {changedToPlace, pausedAutomaticChange} from "./notify"
import {PLACE} from "../const";
import {changeToPlace, startBackend} from "./communicate";

let win

let sessionPauseAutomaticChange = false

function openMainWindow() {
    if (win) {
        win.focus()
        return
    }
    win = createMainWindow(false)
    win.once('close', () => {
        win = null;
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

function init() {
    app.setAppUserModelId("com.null.ip");
    createTray({openMainWindow: openMainWindow, askStopService: askStopService})
    if (Store.get('currentPlace') === PLACE.unknown) Store.set('currentPlace', PLACE.home)
    startBackend()
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
    if (win) win.webContents.send("isAutomaticPausedHandler", sessionPauseAutomaticChange);
}))

ipcMain.on("get", (e, key: string) => {
    if (win) win.webContents.send("getHandler", {key: key, value: Store.get(key)});
});

ipcMain.on("set", (e, data: { key: string, value: any }) => {
    Store.set(data.key, data.value);
});

ipcMain.on("changeToPlace", async (e, place: PLACE) => {
    Store.set("currentPlace", place)
    await changeToPlace()
    if (!sessionPauseAutomaticChange) pausedAutomaticChange()
    sessionPauseAutomaticChange = true
    if (win) win.webContents.send("changeToPlaceHandler")
    else changedToPlace(place)
});
