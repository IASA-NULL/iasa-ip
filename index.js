const { app, BrowserWindow, Menu, Tray, dialog, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const webControl = require('./webControl.js');
let tray = null

const verNum=15;

let win, awin;

m = 1;
f = 0;

const { execSync } = require('child_process');
try { execSync('schtasks /create /tn "MyTasks\\iasa-ip-l" /xml "./res/iasa-ip-l.xml" /f') } catch (e) { }

function resetApplication() {
    const settings = require('electron-settings');
    settings.set('svc', true)
    win.close()
    win = null
    settings.set('ip', null)
    settings.set('svc', false)
    settings.set('adp', null)
    settings.set('gate', null)
    settings.set('aupd', false)
    createMainWindow();
}

ipcMain.on('resetApplication', (event, arg) => {
    resetApplication();
})


function openMainWindow() {
    if (win != null) {
        if (!win.isVisible()) {
            win.show()
        }
    }
    else {
        createMainWindow();
    }
}

function askStopService() {
    const dialogOptions = { type: 'info', buttons: ['예', '아니요'], message: '서비스를 종료하면 IP가 자동으로 바뀌지 않습니다.\n정말로 종료할까요?', title: "IP" }
    dialog.showMessageBox(dialogOptions, i => { if (i == 0) app.exit() })
}

function createTray() {
    tray = new Tray('C:\\Program Files\\IP\\res\\IPLogo.ico')
    const contextMenu = Menu.buildFromTemplate([
        { label: '열기', click: openMainWindow },
        { label: '서비스 종료', click: askStopService }
    ])
    tray.setToolTip('IP가 실행 중입니다.')
    tray.setContextMenu(contextMenu)
    tray.on('click', openMainWindow);
}

function createMainWindow() {
    win = new BrowserWindow({
        width: 850, height: 600, webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }, show: false, icon: path.join(__dirname, 'res/ipLogo.ico')
    })
    win.setMenu(null);
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    //win.webContents.openDevTools();
    win.on('close', function (e) {
        win = null;
    });
    win.once('ready-to-show', () => {
        win.show();
    });
}

function createAlertWindow(op) {
    awin = new BrowserWindow({
        width: 600, height: 200, webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        }, frame: false, transparent: true, show: false, icon: path.join(__dirname, 'res/ipLogo.ico')
    })
    awin.setMenu(null);
    awin.loadURL(url.format({
        pathname: path.join(__dirname, 'alert_' + String(op) + '.html'),
        protocol: 'file:',
        slashes: true
    }))
    awin.setOpacity(0.9);
    //awin.webContents.openDevTools()
    awin.setAlwaysOnTop(true, "floating", 1);
    awin.setIgnoreMouseEvents(true);
    awin.on('close', function (e) {
        awin = null;
    });
    awin.once('ready-to-show', () => {
        awin.show();
    });
}

function onBackgroundService() {
    const settings = require('electron-settings');
    if (settings.get('svc') == null) settings.set('svc', true)
    return settings.get('svc')
}

let notification = null;

function onFirstRun() {
    const { Notification } = require('electron');
    notification = new Notification({ title: '업데이트', body: 'IP의 새 버전이 있습니다.', icon: path.join(__dirname, 'res/ipLogo.ico') });
    notification.on('click', () => {
        const { shell } = require('electron')
        shell.openExternal('http://iasa.ga/ip')
    });
    chkUpdate();
    if (require('process').argv.length != 2) createMainWindow();
    createTray();
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
}
app.on('second-instance', openMainWindow);


let orgName, orgNetStat, orgDnsStat;
o = 1;

fir = true;

app.on('ready', onFirstRun);

async function allCloseHandler() {
    var res = await onBackgroundService();
    if (!res) app.exit();
}

app.on('window-all-closed', function (e) {
    e.preventDefault();
    allCloseHandler();
});

async function makeAlert() {
    var tName = await webControl.getWifiName();
    if (fir && tName != null) {
        fir = false
        if (win == null && awin == null) {
            const ipModule = require('./changeIp.js')
            if (tName == "Iasa_hs" && ipModule.getCurrentState() == 0) {
                createAlertWindow(0);
                await ipModule.changeToSchool();
                setTimeout(function () { awin.webContents.send('finishChange') }, 500)
            }
            if (tName != "Iasa_hs" && ipModule.getCurrentState() == 1) {
                createAlertWindow(1);
                await ipModule.changeToOut();
                setTimeout(function () { awin.webContents.send('finishChange') }, 500)
            }
        }
    }
    fir = true;
}

setInterval(function () {
    makeAlert();
}, 1000);



function chkUpdate() {
    var r = require("request")({ url: 'http://api.iasa.ga/ip/ver', timeout: 1000 }, function (e, response) {
        if (e != null) return;
        else if (parseInt(response.body) > verNum) {
            notification.close();
            notification.show();
        }
    });
}
setInterval(function () {
    chkUpdate();
}, 1000*60*10);
