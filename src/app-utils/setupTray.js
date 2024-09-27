import { app, Menu, Tray } from 'electron';
import path from 'path';
import { ROOT_DIR } from '../../main.js';

let mainWindow = null;

const createTray = () => {
    let tray = null;

    app.whenReady().then(() => {
        tray = new Tray(path.join(ROOT_DIR, 'public/images/logo-16.ico'));

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
