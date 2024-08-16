const { app, Menu, Tray } = require('electron');
const path = require('path');

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

module.exports = { setupTray };
