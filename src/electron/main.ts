import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
import * as path from 'path';
import { addBook, getBooks, getBookImages, addBookImage } from './db.js'; // Uvezi sve funkcije iz db.js


// Definiši tip za knjigu
type Book = {
  title_lat: string;
  title_cyr: string;
  author_lat: string;
  author_cyr: string;
  description_lat?: string;
  description_cyr?: string;
  file_path: string;
  year: string;
};

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js');
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  console.log('Loading preload from:', preloadPath);

  win.webContents.openDevTools();

  const devURL = 'http://localhost:5123';
  const prodURL = `file://${path.join(app.getAppPath(), '/dist-react/index.html')}`;
  win.loadURL(app.isPackaged ? prodURL : devURL);
}

app.whenReady().then(() => {
  console.log('User data path:', app.getPath('userData'));
  createWindow();
});

// IPC handler za dodavanje knjige
ipcMain.handle('add-book', async (event: IpcMainInvokeEvent, book: Book) => {
  console.log('Primljen book u main procesu:', book);
  try {
    const result = addBook(book);
    console.log('Rezultat insertovanja:', result);
    return result;
  } catch (error) {
    console.error('Greška u addBook funkciji:', error);
    throw error;
  }
});

// IPC handler za dodavanje slike knjige
ipcMain.handle('add-book-image', async (event: IpcMainInvokeEvent, image: { 
  book_id: number; 
  image_path: string; 
  image_type: string; 
  position?: number;
}) => {
  console.log('Primljena slika u main procesu:', image);
  try {
    const result = addBookImage(image);
    console.log('Rezultat insertovanja slike:', result);
    return result;
  } catch (error) {
    console.error('Greška u addBookImage funkciji:', error);
    throw error;
  }
});

// IPC handler za učitavanje knjiga
ipcMain.handle('get-books', async (event: IpcMainInvokeEvent) => {
  try {
    const books = getBooks();
    console.log('Knjige iz baze:', books);
    return books;
  } catch (error) {
    console.error('Greška u get-books handleru:', error);
    throw error;
  }
});

// IPC handler za učitavanje slika za određenu knjigu
ipcMain.handle('get-book-images', async (event: IpcMainInvokeEvent, book_id: number) => {
  try {
    const images = getBookImages(book_id);
    console.log(`Slike za knjigu ${book_id}:`, images);
    return images;
  } catch (error) {
    console.error('Greška u get-book-images handleru:', error);
    throw error;
  }
});
