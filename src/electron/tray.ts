import {Tray, Menu} from 'electron'
import path from "path";

let tray;

export interface trayAction {
    openMainWindow: () => void,
    askStopService: () => void
}

export function createTray(action: trayAction) {
    tray = new Tray(path.join(__dirname, '..', 'res', 'logo.ico'));
    const contextMenu = Menu.buildFromTemplate([
        {label: '열기', click: action.openMainWindow},
        {label: '서비스 종료', click: action.askStopService}
    ]);
    tray.setToolTip('IP');
    tray.setContextMenu(contextMenu);
    tray.on('click', action.openMainWindow);
}