const { ipcMain } = require('electron');

const setWindowControls = (app, window) => {
    ipcMain.on('close-window', () => {
        app.quit();
    });
    ipcMain.on('maximize-window', () => {
        if (window.isMaximized()) {
            window.unmaximize();
        } else {
            window.maximize();
        }
    });
    ipcMain.on('minimize-window', () => {
        // window.minimize();
        window.hide();
    });
};

module.exports = { setWindowControls };
