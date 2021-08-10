import {screen} from "electron";
import {BrowserWindow} from "electron-acrylic-window";
import url from "url";
import path from "path";

const windowHeight = 400

export function createMainWindow(dev = false) {
    let win;
    const currentScreen = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
    const displayRect = currentScreen.bounds
    const workAreaRect = screen.getPrimaryDisplay().workAreaSize
    win = new BrowserWindow({
        width: 400,
        height: windowHeight,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
        icon: path.join(__dirname, '..', '..', 'res', 'logo.png'),
        frame: false,
        backgroundColor: '#00000000',
        x: displayRect.x + displayRect.width - 410,
        y: displayRect.y + workAreaRect.height - windowHeight - 10,
        ...(!dev && {skipTaskbar: true,}),
        show: true,
        resizable: false
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, '..', 'ui', 'main', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    win.once('blur', () => {
        if (!dev) win.close()
    })
    win.setAlwaysOnTop(true, 'floating');
    if (dev) win.webContents.openDevTools({mode: "detach"});

    return win
}
