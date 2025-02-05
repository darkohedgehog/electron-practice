import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { addBook, getBooks } from './db.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // nodeIntegration: false – uvek dobro imati ovo isključeno
    },
  });

  const devURL = 'http://localhost:5123';
  const prodURL = `file://${path.join(app.getAppPath(), '/dist-react/index.html')}`;
  win.loadURL(app.isPackaged ? prodURL : devURL);
}

app.whenReady().then(createWindow);

// IPC kanali
ipcMain.handle('add-book', async (event, book) => {
  return addBook(book);
});

ipcMain.handle('get-books', async () => {
  return getBooks();
});
