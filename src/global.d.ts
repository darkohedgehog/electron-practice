export {};

declare global {
  interface Window {
    api: {
      addBookImage(arg0: { 
        book_id: number; 
        image_path: string; 
        image_type: string; 
        position: number; 
      }): unknown;
      addBook: (book: {
        title_lat: string;
        title_cyr: string;
        author_lat: string;
        author_cyr: string;
        description_lat?: string;
        description_cyr?: string;
        file_path: string;
        year: string; // Dodato, kako bi se uklopio sa novom strukturom
      }) => Promise<number>;
      getBooks: () => Promise<any[]>;
      // Ako imaš još API funkcija, dodaj ih ovde...
    };
  }
}
