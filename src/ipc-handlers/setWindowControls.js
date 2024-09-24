import { app, ipcMain } from 'electron';

const setWindowControls = (window) => {
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

export { setWindowControls };
