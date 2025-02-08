import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  addBook: (book: { 
    title_lat: string; 
    title_cyr: string;
    author_lat: string;
    author_cyr: string;
    description_lat?: string;
    description_cyr?: string;
    file_path: string;
  }) => ipcRenderer.invoke('add-book', book),
  getBooks: () => ipcRenderer.invoke('get-books'),
});

