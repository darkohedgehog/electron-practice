import Database from 'better-sqlite3';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import dotenv from 'dotenv';
import { app } from 'electron';

dotenv.config();

const STRAPI_URL: string = process.env.VITE_STRAPI_API_URL as string;
const STRAPI_AUTH_TOKEN: string = process.env.VITE_STRAPI_AUTH_TOKEN as string;

if (!STRAPI_URL || !STRAPI_AUTH_TOKEN) {
  console.error('Strapi URL i Auth Token moraju biti definirani u .env datoteci.');
  process.exit(1);
}

const dbPath = path.join(app.getPath('userData'), 'books.db');
const db = new Database(dbPath);
const imagesFolder = path.join(app.getPath('userData'), 'images');

interface LocalBook {
  id: number;
  title_lat: string;
  title_cyr: string;
  author_lat: string;
  author_cyr: string;
  description_lat: string;
  description_cyr: string;
  file_path: string;
  year: string;
  added_at: string;
}

interface BookData {
  data: {
    title: string;
    author: string;
    description: any; // Objekt – blok struktura
    year: string;
    cover_image: number;
    locale: string;
    external_id?: number; // samo za default zapis (sr-Latn)
  };
}

// Funkcija za formatiranje opisa u blok strukturu
function formatDescription(text: string): any {
  return {
    blocks: [
      {
        id: `block-${Date.now()}`,
        type: "paragraph",
        data: { text }
      }
    ]
  };
}

// Upload slike – vraća ID uploadane slike
async function uploadImage(imageFileName: string): Promise<number | null> {
  const imagePath = path.join(imagesFolder, imageFileName);
  if (!fs.existsSync(imagePath)) {
    console.error(`Slika nije pronađena: ${imagePath}`);
    return null;
  }
  const formData = new FormData();
  formData.append('files', fs.createReadStream(imagePath));
  try {
    const res = await axios.post(`${STRAPI_URL}/api/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${STRAPI_AUTH_TOKEN}`,
      },
    });
    return res.data[0].id;
  } catch (error: any) {
    console.error('Greška pri uploadu slike:', error.response ? error.response.data : error.message);
    return null;
  }
}

// Dohvat default zapisa (sr-Latn) po external_id
async function findDefaultBook(externalId: number): Promise<any | null> {
  try {
    const res = await axios.get(`${STRAPI_URL}/api/books`, {
      params: {
        "filters[external_id][$eq]": externalId,
        "filters[locale][$eq]": "sr-Latn"
      },
      headers: { Authorization: `Bearer ${STRAPI_AUTH_TOKEN}` },
    });
    const data = res.data.data;
    return (data && data.length > 0) ? data[0] : null;
  } catch (error: any) {
    console.error('Greška pri dohvaćanju default zapisa:', error.response ? error.response.data : error.message);
    return null;
  }
}

// Dohvat prevoda (sr-Cyrl) po naslovu
async function findLocalizationByTitle(title: string): Promise<any | null> {
  try {
    const res = await axios.get(`${STRAPI_URL}/api/books`, {
      params: {
        "filters[title][$eq]": title,
        "filters[locale][$eq]": "sr-Cyrl"
      },
      headers: { Authorization: `Bearer ${STRAPI_AUTH_TOKEN}` },
    });
    const data = res.data.data;
    return (data && data.length > 0) ? data[0] : null;
  } catch (error: any) {
    console.error('Greška pri dohvaćanju prevoda po naslovu:', error.response ? error.response.data : error.message);
    return null;
  }
}

// Kreiranje default zapisa (sr-Latn)
async function importDefaultBook(bookData: BookData): Promise<any | null> {
  const { external_id } = bookData.data;
  let defaultRecord = await findDefaultBook(external_id!);
  if (defaultRecord) {
    console.log(`Default zapis za external_id ${external_id} već postoji.`);
    return defaultRecord;
  }
  try {
    const res = await axios.post(
      `${STRAPI_URL}/api/books`,
      { data: bookData.data },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_AUTH_TOKEN}`,
        },
      }
    );
    console.log(`Kreiran novi default zapis za external_id ${external_id}`);
    defaultRecord = await findDefaultBook(external_id!);
    return defaultRecord;
  } catch (error: any) {
    console.error("Greška pri kreiranju default zapisa:", error.response ? error.response.data : error.message);
    return null;
  }
}

// Ažuriranje postojeće lokalizacije (PUT)
async function updateLocalization(localizedId: number, localizationData: Partial<BookData["data"]>): Promise<any | null> {
  try {
    const res = await axios.put(
      `${STRAPI_URL}/api/books/${localizedId}?locale=sr-Cyrl`,
      { data: localizationData },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_AUTH_TOKEN}`,
        },
      }
    );
    console.log(`Ažurirana lokalizacija za ID ${localizedId}`);
    return res.data.data;
  } catch (error: any) {
    console.error("Greška pri ažuriranju lokalizacije:", error.response ? error.response.data : error.message);
    return null;
  }
}

// Kreiranje nove lokalizacije (POST)
async function createLocalization(defaultRecordId: number, localizationData: Partial<BookData["data"]>): Promise<any | null> {
  try {
    const res = await axios.post(
      `${STRAPI_URL}/api/books?locale=sr-Cyrl&referenceId=${defaultRecordId}`,
      { data: localizationData },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_AUTH_TOKEN}`,
        },
      }
    );
    console.log(`Kreirana lokalizacija za default zapis ID ${defaultRecordId}`);
    return res.data.data;
  } catch (error: any) {
    console.error("Greška pri kreiranju lokalizacije:", error.response ? error.response.data : error.message);
    return null;
  }
}

export async function migrateBooks(): Promise<void> {
  const books = db.prepare('SELECT * FROM books').all() as LocalBook[];
  console.log(`Pronađeno ${books.length} knjiga u bazi.`);
  
  for (const book of books) {
    console.log(`Migriram knjigu ID ${book.id}`);
    const coverImageId = await uploadImage(book.file_path);
    if (!coverImageId) {
      console.error(`Preskačem knjigu ID ${book.id} zbog greške pri uploadu slike.`);
      continue;
    }

    // Podaci za default zapis (sr-Latn)
    const bookDataLat: BookData = {
      data: {
        title: book.title_lat,
        author: book.author_lat,
        description: formatDescription(book.description_lat), // šaljemo objekt
        year: book.year,
        cover_image: coverImageId,
        locale: 'sr-Latn',
        external_id: book.id,
      },
    };

    const defaultRecord = await importDefaultBook(bookDataLat);
    if (!defaultRecord) {
      console.error(`Neuspješno kreiranje default zapisa za knjigu ID ${book.id}.`);
      continue;
    }

    // Pokušaj dohvaćanja prevoda na osnovu naslova ćiriličnog zapisa
    const existingCyr = await findLocalizationByTitle(book.title_cyr);
    if (existingCyr) {
      console.log(`Ćirilični prevod za knjigu ID ${book.id} već postoji, ažuriram ga.`);
      const updatePayload: Partial<BookData["data"]> = {
        title: book.title_cyr,
        author: book.author_cyr,
        description: formatDescription(book.description_cyr),
        year: book.year,
        cover_image: coverImageId,
        locale: 'sr-Cyrl',
      };
      const updated = await updateLocalization(existingCyr.id, updatePayload);
      if (!updated) {
        console.error(`Neuspješno ažuriranje lokalizacije za knjigu ID ${book.id}.`);
      }
      continue;
    }

    // Ako prevod ne postoji, kreiraj ga
    const localizationPayload: Partial<BookData["data"]> = {
      title: book.title_cyr,
      author: book.author_cyr,
      description: formatDescription(book.description_cyr),
      year: book.year,
      cover_image: coverImageId,
      locale: 'sr-Cyrl',
    };

    const localizationResult = await createLocalization(defaultRecord.id, localizationPayload);
    if (!localizationResult) {
      console.error(`Neuspješno kreiranje lokalizacije za knjigu ID ${book.id}.`);
      continue;
    }

    console.log(`Knjiga ID ${book.id} migrirana (sr-Latn: ${defaultRecord.id}, sr-Cyrl: ${localizationResult.id}).`);
  }
  console.log('Migracija završena.');
}

migrateBooks().catch(console.error);