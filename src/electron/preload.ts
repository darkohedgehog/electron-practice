import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  addBook: (book: { title: string; author: string; file_path: string }) =>
    ipcRenderer.invoke('add-book', book),
  getBooks: () => ipcRenderer.invoke('get-books'),
});
