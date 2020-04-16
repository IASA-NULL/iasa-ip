const {app, BrowserWindow, Menu, Tray, dialog, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const vibrancy = require('electron-acrylic-window');
const webControl = require('./webControl.js');
const {execSync} = require('child_process');
const settings = require('electron-settings');

let tray = null;
let win, awin;
let fir = true;

const verNum = 421;

try {
    execSync('schtasks /create /tn "MyTasks\\iasa-ip-l" /xml "./res/iasa-ip-l.xml" /f')
} catch (e) {

}

function resetApplication() {
    settings.set('svc', true);
    win.close();
    win = null;
    settings.delete('ip');
    settings.set('adp', null);
    settings.set('gate', null);
    settings.set('aupd', true);
    createMainWindow();
}

ipcMain.on('resetApplication', () => {
    resetApplication();
});


function openMainWindow() {
    if (win) {
        if (!win.isVisible()) {
            win.show();
        }
    } else {
        createMainWindow();
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

function createTray() {
    tray = new Tray('C:\\Program Files\\IP\\res\\ipLogo.ico');
    const contextMenu = Menu.buildFromTemplate([
        {label: '열기', click: openMainWindow},
        {label: '서비스 종료', click: askStopService}
    ]);
    tray.setToolTip('IP가 실행 중입니다.');
    tray.setContextMenu(contextMenu);
    tray.on('click', openMainWindow);
}

function createMainWindow() {
    win = new BrowserWindow({
        width: 850, height: 600, webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }, show: false, icon: path.join(__dirname, 'res/ipLogo.ico'), frame: false, transparent: true
    });
    win.setMenu(null);
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    win.on('close', () => {
        win = null;
    });
    win.once('ready-to-show', () => {
        win.show();
        vibrancy.setVibrancy(win);
        win.setResizable(false);
        ipcMain.on('hide', (event, arg) => {
            win.minimize();
        });
        //win.webContents.openDevTools()
    });
}

function createAlertWindow(op) {
    awin = new BrowserWindow({
        width: 600, height: 200, webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        }, frame: false, transparent: true, show: false, icon: path.join(__dirname, 'res/ipLogo.ico')
    });
    awin.setMenu(null);
    awin.loadURL(url.format({
        pathname: path.join(__dirname, 'alert_' + String(op) + '.html'),
        protocol: 'file:',
        slashes: true
    }));
    awin.setAlwaysOnTop(true, "floating", 1);
    awin.setIgnoreMouseEvents(true);
    awin.on('close', () => {
        awin = null;
    });
    awin.once('ready-to-show', () => {
        awin.show();
        vibrancy.setVibrancy(awin);
        //awin.webContents.openDevTools()
    });
}

function onBackgroundService() {
    if (settings.get('svc') == null) settings.set('svc', true);
    return settings.get('svc');
}

let notification = null;

function onFirstRun() {
    const {Notification} = require('electron');
    notification = new Notification({
        title: '업데이트',
        body: 'IP의 새 버전이 있습니다.',
        icon: 'C:\\Program Files\\IP\\res\\ipLogo.ico'
    });
    notification.on('click', () => {
        const {shell} = require('electron');
        shell.openExternal('http://iasa.kr/program/ip');
    });
    chkUpdate();
    if (require('process').argv.length !== 2) createMainWindow();
    createTray();
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
}

app.on('second-instance', openMainWindow);


app.on('ready', onFirstRun);

async function allCloseHandler() {
    const res = onBackgroundService();
    if (!res) app.exit();
}

app.on('window-all-closed', async e => {
    e.preventDefault();
    await allCloseHandler();
});

async function makeAlert() {
    const tName = await webControl.getWifiName();
    if (fir && tName != null) {
        fir = false;
        if (win == null && awin == null) {
            const ipModule = require('./changeIp.js');
            if (tName === "Iasa_hs" && ipModule.getCurrentState() === 0) {
                createAlertWindow(0);
                await ipModule.changeToSchool();
                while (!awin) ;
                while (!awin.webContents) ;
                setTimeout(() => {
                    awin.webContents.send('finishChange')
                }, 500)
            }
            if (tName !== "Iasa_hs" && ipModule.getCurrentState() === 1) {
                createAlertWindow(1);
                await ipModule.changeToOut();
                while (!awin) ;
                while (!awin.webContents) ;
                setTimeout(() => {
                    awin.webContents.send('finishChange');
                }, 500)
            }
        }
    }
    fir = true;
}

setInterval(() => {
    makeAlert();
}, 1000);


function chkUpdate() {
    require("request")({url: 'https://api.iasa.kr/ip/ver', timeout: 1000}, (e, response) => {
        if (!e && parseInt(response.body) > verNum) {
            notification.close();
            notification.show();
        }
    });
}

setInterval(() => {
    chkUpdate();
}, 1000 * 60 * 10);
