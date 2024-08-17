const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('huemidi', {
    // Static
    fetchLightGroups: () => ipcRenderer.invoke('fetch-light-groups'),
    fetchLights: (groupID, type) => ipcRenderer.invoke('fetch-lights', groupID, type), //prettier-ignore
    fetchScenes: (groupID) => ipcRenderer.invoke('fetch-scenes', groupID),
    updateResource: (name, resourceID, data) =>
        ipcRenderer.invoke('update-resource', name, resourceID, data),
    deleteResource: (name, resourceID) =>
        ipcRenderer.invoke('delete-resource', name, resourceID),
    // Ambient
    // MIDI
});

contextBridge.exposeInMainWorld('controls', {
    close: () => ipcRenderer.send('close-window'),
    maximize: () => ipcRenderer.send('maximize-window'),
    minimize: () => ipcRenderer.send('minimize-window'),
});
