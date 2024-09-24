import { app } from 'electron';
import { boot } from './src/app-utils/boot.js';

const ROOT_DIR = import.meta.dirname;

app.whenReady().then(async () => {
    await boot();
});

app.on('window-all-closed', () => {
    app.quit();
    // if (process.platform !== 'darwin') app.quit();
});

// TODO: delete and implement SSL auth
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export { ROOT_DIR };
