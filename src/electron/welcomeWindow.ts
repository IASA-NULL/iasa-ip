import {screen} from "electron";
import {BrowserWindow} from "electron-acrylic-window";
import url from "url";
import path from "path";

export function createWelcomeWindow(dev = false) {
    let win;
    win = new BrowserWindow({
        width: 700,
        height: 500,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
        icon: path.join(__dirname, '..', '..', 'res', 'logo.png'),
        frame: false,
        backgroundColor: '#00000000',
        resizable: false
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, '..', 'ui', 'welcome', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    win.setAlwaysOnTop(true, 'floating');
    if (dev) win.webContents.openDevTools({mode: "detach"});

    return win
}
