const { app, BrowserWindow } = require('electron');
const path = require('path');

// Inicia o servidor backend Express
require('./server');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: true // Garante que o DevTools esteja ativo
        }
    });

    // Carrega a tela inicial (login)
    win.loadFile('login.html');

    // Abre o DevTools automaticamente (opcional: comente se não quiser)
    win.webContents.openDevTools();
}

// Quando o Electron estiver pronto, cria a janela
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Fecha o app quando todas as janelas forem fechadas (exceto no macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
