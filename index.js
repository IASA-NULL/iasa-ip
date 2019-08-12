const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const webControl=require('./webControl.js');

let win;

m=1;
f=0;

function createWindow() {
    // 새로운 브라우저 창을 생성합니다.
    win = new BrowserWindow({
        width: 800, height: 600, webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }, icon: path.join(__dirname, 'ipLogo.ico')
    })
    win.setMenu(null);

    // 그리고 현재 디렉터리의 index.html을 로드합니다.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // 개발자 도구를 엽니다.
    //win.webContents.openDevTools()

    // 창이 닫히면 호출됩니다.
    win.on('close', function(e){
        win=null;
    });
}

o=1;

orgName=webControl.getWifiName();

app.on('ready', createWindow)

app.on('window-all-closed', function(e){
    e.preventDefault();
});

setInterval(function() {
    if(orgName!=webControl.getWifiName()) {
        localStorage.setItem('wifiName', 10);
        orgName=webControl.getWifiName();
        if(win==null) {
            createWindow();
        }
    }
}, 1000);

