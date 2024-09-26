const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('huemidi', {
    static: {
        fetchLightGroups: () => ipcRenderer.invoke('fetch-light-groups'),
        fetchLights: (groupID, type) => ipcRenderer.invoke('fetch-lights', groupID, type), //prettier-ignore
        fetchScenes: (groupID) => ipcRenderer.invoke('fetch-scenes', groupID),
        updateResource: (name, resourceID, data) =>
            ipcRenderer.invoke('update-resource', name, resourceID, data),
        deleteResource: (name, resourceID) =>
            ipcRenderer.invoke('delete-resource', name, resourceID),
        createResource: (name, data) =>
            ipcRenderer.invoke('create-resource', name, data),
    },
    setup: {
        onBridgeNotFound: (callback) =>
            ipcRenderer.on('bridge-not-found', callback),
        onBridgeFound: (callback) =>
            ipcRenderer.on('bridge-found', (_event, data) => callback(data)),
        discoverBridge: () => ipcRenderer.send('discover-bridge'),
        linkBridge: (shouldLink) => ipcRenderer.send('link-bridge', shouldLink),
        onBridgeLinked: (callback) => ipcRenderer.on('bridge-linked', callback),
        closeSetup: () => ipcRenderer.send('close-setup'),
    },
    settings: {
        fetchBridgeData: () => ipcRenderer.invoke('fetch-bridge-data'),
        forgetBridge: () => ipcRenderer.send('forget-bridge'),
        fetchPreferredGroup: () => ipcRenderer.invoke('fetch-pref-group'),
        updatePreferredGroup: (groupID) =>
            ipcRenderer.send('update-pref-group', groupID),
    },
});

contextBridge.exposeInMainWorld('controls', {
    close: () => ipcRenderer.send('close-window'),
    maximize: () => ipcRenderer.send('maximize-window'),
    minimize: () => ipcRenderer.send('minimize-window'),
});
