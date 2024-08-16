const { app, BrowserWindow } = require('electron');
const path = require('path');
const { loadBridgeData } = require('./src/bridge-utils/bridgeData');
const { setupTray } = require('./src/app-utils/setupTray');
const { setWindowControls } = require('./src/ipc-handlers/setWindowControls');
const { setStaticDataHandlers } = require('./src/ipc-handlers/setStaticDataHandlers'); // prettier-ignore
const { test } = require('./test');

const ROOT_DIR = path.resolve(__dirname);

const createWindow = () => {
    const win = new BrowserWindow({
        // width: 725,
        width: 1000,
        height: 500,
        minWidth: 725,
        minHeight: 500,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
    win.setMenuBarVisibility(false);

    return win;
};

app.whenReady().then(async () => {
    loadBridgeData(ROOT_DIR);

    const win = createWindow();
    setupTray(win);

    setWindowControls(app, win);
    setStaticDataHandlers();
});

app.on('window-all-closed', () => {
    app.quit();
    // if (process.platform !== 'darwin') app.quit();
});

// TODO: delete and implement SSL auth
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
