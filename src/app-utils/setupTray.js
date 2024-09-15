import { app, Menu, Tray } from 'electron';
import path from 'path';

let mainWindow = null;

const createTray = (app) => {
    let tray = null;

    app.whenReady().then(() => {
        tray = new Tray(
            path.join(__dirname, '../../public/images/tray-logo.png')
        );

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
    createTray(app);
};

export { setupTray };
