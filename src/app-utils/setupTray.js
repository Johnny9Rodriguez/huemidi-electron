import { app, Menu, Tray, nativeImage } from 'electron';
import path from 'path';
import { ROOT_DIR } from '../../main.js';

let mainWindow = null;

const createTray = () => {
    let tray = null;

    app.whenReady().then(() => {
        const iconPath = path.join(ROOT_DIR, 'public/images/logo-256.png');
        let trayIcon = nativeImage.createFromPath(iconPath);

        // Resize the image to a suitable size for the tray
        trayIcon = trayIcon.resize({ width: 16, height: 16 });
        
        tray = new Tray(trayIcon)

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Quit',
                type: 'normal',
                click: () => {
                    app.quit();
                },
            },
        ]);

        tray.setToolTip('HueMIDI app');
        tray.setContextMenu(contextMenu);

        tray.on('click', onClick);
    });
};

const onClick = () => {
    mainWindow.show();
};

const setupTray = (win) => {
    mainWindow = win;
    createTray(ROOT_DIR);
};

export { setupTray };
