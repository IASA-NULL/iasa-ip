const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const webControl=require('./webControl.js');

let win, awin;

m=1;
f=0;


function createMainWindow() {
    win = new BrowserWindow({
        width: 800, height: 600, webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }, show:false, icon: path.join(__dirname, 'res/ipLogo.ico')
    })
    win.setMenu(null);
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    //win.webContents.openDevTools();
    win.on('close', function(e){
        win=null;
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
        }, frame:false, transparent:true, show:false,icon: path.join(__dirname, 'res/ipLogo.ico')
    })
    awin.setMenu(null);
    awin.loadURL(url.format({
        pathname: path.join(__dirname, 'alert.html'),
        protocol: 'file:',
        slashes: true
    }))
    awin.setOpacity(0.95);
    //awin.webContents.openDevTools()
    awin.setAlwaysOnTop(true, "floating", 1);
    awin.setIgnoreMouseEvents(true);
    awin.on('close', function(e){
        awin=null;
    });
    awin.once('ready-to-show', () => {
        awin.show();
    });
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
}
app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
        if (win.isMinimized()) win.restore()
        win.focus()
    }
    else {
        createMainWindow();
    }
});




let orgName, orgNetStat, orgDnsStat;
o=1;

fir=true;

app.on('ready', createMainWindow);

app.on('window-all-closed', function(e){
    e.preventDefault();
});

async function makeAlert()
{
    var tName=await webControl.getWifiName();
    var tDnsStat=await webControl.checkDns();
    var tNetStat=await webControl.checkInternet();
    if(tName!=orgName || tNetStat!=orgNetStat || tDnsStat!=orgDnsStat) {
        if(!fir && !tNetStat) {
            if(win==null && awin==null) {
                createAlertWindow();
            }
        }
        fir=false;
    }
    orgName=tName;
    orgNetStat=tNetStat;
    orgDnsStat=tDnsStat;
}

setInterval(function() {
    makeAlert();
    //localStorage.setItem('chgStat', 10);
}, 1000);

