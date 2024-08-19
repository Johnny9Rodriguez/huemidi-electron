const { ipcMain } = require('electron');
const { getLightGroups } = require('./static-data/getLightGroups');
const { getLights } = require('./static-data/getLights');
const { getScenesByGroup } = require('./static-data/getScenes');
const { setResource } = require('./static-data/setResource');
const { removeResource } = require('./static-data/deleteResource');
const { addResource } = require('./static-data/createResource');

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
    ipcMain.handle('delete-resource', async (_event, name, resourceID) => {
        return await removeResource(name, resourceID);
    });
    ipcMain.handle('create-resource', async (_event, name, data) => {
        return await addResource(name, data);
    })
};

module.exports = { setStaticDataHandlers };
