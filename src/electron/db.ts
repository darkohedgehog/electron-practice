import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

// Putanja do SQLite fajla
const dbPath = path.join(app.getPath('userData'), 'books.db');
const db = new Database(dbPath);

// Kreiranje tabele za knjige
db.prepare(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    file_path TEXT,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Kreiranje tabele za slike
db.prepare(`
  CREATE TABLE IF NOT EXISTS book_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER,
    image_path TEXT,
    image_type TEXT,
    position INTEGER,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id)
  )
`).run();

export function addBook(book: { title: string; author: string; file_path: string }) {
  const stmt = db.prepare('INSERT INTO books (title, author, file_path) VALUES (?, ?, ?)');
  const info = stmt.run(book.title, book.author, book.file_path);
  return info.lastInsertRowid;
}

export function getBooks() {
  return db.prepare('SELECT * FROM books ORDER BY added_at DESC').all();
}

// Funkcija za dodavanje slike
export function addBookImage(image: { book_id: number; image_path: string; image_type: string; position?: number }) {
  const stmt = db.prepare('INSERT INTO book_images (book_id, image_path, image_type, position) VALUES (?, ?, ?, ?)');
  const info = stmt.run(image.book_id, image.image_path, image.image_type, image.position || null);
  return info.lastInsertRowid;
}

// Funkcija za dobijanje slika za određenu knjigu
export function getBookImages(book_id: number) {
  return db.prepare('SELECT * FROM book_images WHERE book_id = ? ORDER BY position ASC, added_at DESC').all(book_id);
}
