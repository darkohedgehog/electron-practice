import { contextBridge, ipcRenderer } from 'electron';

console.log('Preload script loaded');


contextBridge.exposeInMainWorld('api', {
  addBook: (book: { 
    title_lat: string; 
    title_cyr: string;
    author_lat: string;
    author_cyr: string;
    description_lat?: string;
    description_cyr?: string;
    file_path: string;
    year: string;
  }) => ipcRenderer.invoke('add-book', book),
  addBookImage: (image: { 
    book_id: number; 
    image_path: string; 
    image_type: string; 
    position: number; 
  }) => ipcRenderer.invoke('add-book-image', image),
  getBooks: () => ipcRenderer.invoke('get-books'),
  getBookImages: (book_id: number) => ipcRenderer.invoke('get-book-images', book_id),
});

export {};