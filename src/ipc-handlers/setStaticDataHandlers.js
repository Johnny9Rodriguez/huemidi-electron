import { ipcMain } from 'electron';
import { getLightGroups } from './static-data/getLightGroups.js';
import { getLights } from './static-data/getLights.js';
import { getScenesByGroup } from './static-data/getScenes.js';
import { setResource } from './static-data/setResource.js';
import { removeResource } from './static-data/deleteResource.js';
import { addResource } from './static-data/createResource.js';

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
    });
};

export { setStaticDataHandlers };
