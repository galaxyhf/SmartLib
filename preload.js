const { contextBridge } = require('electron');

// (opcional) aqui você pode expor funções seguras
contextBridge.exposeInMainWorld('electronAPI', {});
