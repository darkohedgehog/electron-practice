import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
import * as path from 'path';
import { addBook, getBooks, getBookImages, addBookImage, deleteBook, updateBook } from './db.js';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { dialog } from 'electron';
import { migrateBooks } from './migrate';




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
    width: 1300,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
    },
  });
  //console.log('Loading preload from:', preloadPath);

 // win.webContents.openDevTools();

  const devURL = 'http://localhost:5123';
  const prodURL = `file://${path.join(app.getAppPath(), '/dist-react/index.html')}`;
  win.loadURL(app.isPackaged ? prodURL : devURL);
}

app.whenReady().then(() => {
  console.log('User data path:', app.getPath('userData'));
  createWindow();
});

ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }]
  });
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0]; // Vraća apsolutnu putanju odabranog fajla
  }
  throw new Error('No file selected');
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


ipcMain.handle('get-user-data-path', async () => {
  return app.getPath('userData');
});

ipcMain.handle('copy-image', async (event, originalFilePath: string) => {
  try {
    const userDataPath = app.getPath('userData');
    const imagesFolder = path.join(userDataPath, 'images');
    
    if (!existsSync(imagesFolder)) {
      mkdirSync(imagesFolder, { recursive: true });
    }
    
    const fileName = path.basename(originalFilePath);
    const destinationPath = path.join(imagesFolder, fileName);
    
    copyFileSync(originalFilePath, destinationPath);
    console.log("Kopiran fajl:", fileName, "u", destinationPath);
    
    return fileName;
  } catch (error) {
    console.error('Greška pri kopiranju slike:', error);
    throw error;
  }
});

ipcMain.handle('copy-gallery-image', async (event, originalFilePath: string) => {
  try {
    const userDataPath = app.getPath('userData');
    const galleryFolder = path.join(userDataPath, 'gallery');
    
    if (!existsSync(galleryFolder)) {
      mkdirSync(galleryFolder, { recursive: true });
    }
    
    const fileName = path.basename(originalFilePath);
    const destinationPath = path.join(galleryFolder, fileName);
    
    copyFileSync(originalFilePath, destinationPath);
    
    return fileName;  // ili destinationPath ako želiš
  } catch (error) {
    console.error('Greška pri kopiranju galerijske slike:', error);
    throw error;
  }
});

// Handler za brisanje knjige
ipcMain.handle('delete-book', async (event: IpcMainInvokeEvent, bookId: number) => {
  try {
    const result = deleteBook(bookId);
    console.log('Knjiga obrisana, broj izmenjenih redova:', result);
    return result;
  } catch (error) {
    console.error('Greška pri brisanju knjige:', error);
    throw error;
  }
});

// Handler za ažuriranje knjige
ipcMain.handle('update-book', async (event: IpcMainInvokeEvent, book) => {
  try {
    const result = updateBook(book);
    console.log('Knjiga ažurirana, broj izmenjenih redova:', result);
    return result;
  } catch (error) {
    console.error('Greška pri ažuriranju knjige:', error);
    throw error;
  }
});
ipcMain.handle('migrate-books', async () => {
  try {
    await migrateBooks();
    return { success: true, message: 'Migracija uspešna' };
  } catch (error: unknown) {
    let errorMessage = 'Došlo je do greške';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
});




