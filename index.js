const { app, BrowserWindow, Menu, Tray, dialog, ipcMain  } = require('electron');
const path = require('path');
const url = require('url');
const webControl = require('./webControl.js');
let tray = null

let win, awin;

m = 1;
f = 0;



function resetApplication() {
    const settings = require('electron-settings');
    settings.set('svc', true)
    win.close()
    win=null
    settings.set('ip', null)
    settings.set('svc', false)
    settings.set('adp', null)
    settings.set('gate', null)
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
    tray = new Tray('./res/IPLogo.ico')
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
    win.webContents.openDevTools();
    win.on('close', function (e) {
        win = null;
    });
    win.once('ready-to-show', () => {
        win.show();
    });
}

function createAlertWindow() {
    awin = new BrowserWindow({
        width: 600, height: 200, webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        }, frame: false, transparent: true, show: false, icon: path.join(__dirname, 'res/ipLogo.ico')
    })
    awin.setMenu(null);
    awin.loadURL(url.format({
        pathname: path.join(__dirname, 'alert.html'),
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
    if(settings.get('svc')==null) settings.set('svc', true)
    return settings.get('svc')
}

function onFirstRun() {
    createMainWindow();
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
    var res=await onBackgroundService();
    if(!res) app.exit();
}

app.on('window-all-closed', function (e) {
    e.preventDefault();
    allCloseHandler();
});

async function makeAlert() {
    var tName = await webControl.getWifiName();
    var tDnsStat = await webControl.checkDns();
    var tNetStat = await webControl.checkInternet();
    if (tName != orgName || tNetStat != orgNetStat || tDnsStat != orgDnsStat) {
        if (!fir && !tNetStat) {
            if (win == null && awin == null) {
                const ipModule=require('./changeIp.js')
                if(tName=="Iasa_hs" && ipModule.getCurrentState()==0) {
                    createAlertWindow(0);
                    ipModule.changeToSchool(function() {
                        awin.webControl.send('finishChange')
                    });
                }
                if(tName!="Iasa_hs" && ipModule.getCurrentState()==1) {
                    createAlertWindow(1);
                    ipModule.changeToSchool(function() {
                        awin.webControl.send('finishChange')
                    });
                }
            }
        }
        fir = false;
    }
    orgName = tName;
    orgNetStat = tNetStat;
    orgDnsStat = tDnsStat;
}

setInterval(function () {
    makeAlert();
    //localStorage.setItem('chgStat', 10);
    if(awin) awin.webContents.send('finishChange')
}, 10000);

