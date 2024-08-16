const { ipcMain } = require('electron');
const { getLightGroups } = require('./static-data/getLightGroups');
const { getLights } = require('./static-data/getLights');
const { getScenesByGroup } = require('./static-data/getScenes');
const { setResource } = require('./static-data/setResource');

const setStaticDataHandlers = () => {
    ipcMain.handle('fetch-light-groups', async () => {
        return await getLightGroups();
    });
    ipcMain.handle('fetch-lights', async (_event, groupID, type) => {
        return await getLights(groupID, type);
    });
    ipcMain.handle('fetch-scenes', async (_event, groupID) => {
        return await getScenesByGroup(groupID);
    });
    ipcMain.handle(
        'update-resource',
        async (_event, name, resourceID, data) => {
            return await setResource(name, resourceID, data);
        }
    );
};

module.exports = { setStaticDataHandlers };
