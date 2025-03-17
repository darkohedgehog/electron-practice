export {};

// Definiši tip za BookImage
export interface BookImage {
  id: number;
  book_id: number;
  image_path: string;
  image_type: string;
  position: number;
  added_at: string; // Možeš ostaviti i bez, u zavisnosti od potrebe
}

// (Opcionalno) Definiši tip za Book, ako ti je potreban u globalnoj deklaraciji
export interface Book {
  id: number;
  title_lat: string;
  title_cyr: string;
  author_lat: string;
  author_cyr: string;
  description_lat?: string;
  description_cyr?: string;
  file_path: string;
  year: string;
  added_at: string;
}

declare global {
  interface Window {
    api: {
      openFileDialog: any;
      userDataPath: string;
      getBookImages(id: number): Promise<BookImage[]>;
      addBookImage(arg0: { 
        book_id: number; 
        image_path: string; 
        image_type: string; 
        position: number; 
      }): Promise<number>;  // ili Promise<number> ako ti to odgovara
      addBook: (book: {
        title_lat: string;
        title_cyr: string;
        author_lat: string;
        author_cyr: string;
        description_lat?: string;
        description_cyr?: string;
        file_path: string;
        year: string;
      }) => Promise<number>;
      getBooks: () => Promise<Book[]>;
      copyImage(originalFilePath: string): Promise<string>;
      copyGalleryImage(originalFilePath: string): Promise<string>;
      getUserDataPath(): Promise<string>;
      deleteBook(bookId: number): Promise<number>;
      updateBook(book: Book): Promise<number>;
      migrateBooks: () => Promise<{ success: boolean; message: string }>;
      // Ako imaš još API funkcija, dodaj ih ovde...
    };
  }
}
