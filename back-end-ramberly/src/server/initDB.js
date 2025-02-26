import pgPromise from "pg-promise";
import dotenv from "dotenv";

dotenv.config();
const url = process.env.URL; // da inizializzare

const db = pgPromise()("postgres//postgresFingerskate1@localhost5432/Ramberly");
const setupDb = async () => {
  try {
    await db.none(`DROP TABLE IF EXISTS users`);
    await db.none(`DROP TABLE IF EXISTS eventi `);

    await db.none(`CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    nome TEXT NOT NULL,
    cognome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    livello INTEGER DEFAULT (1),
    img BLOB,
    sesso CHAR(1) NOT NULL,
  peso DECIMAL(5,2) NOT NULL,
  attivita INTEGER NOT NULL,
  monitoraggio BOOLEAN NOT NULL,
  gruppo BOOLEAN NOT NULL,
  sfide BOOLEAN NOT NULL,
  running BOOLEAN,
  escursione BOOLEAN,
  biking BOOLEAN,
  camminata BOOLEAN,
  seguiti INTEGER[] DEFAULT ARRAY[],
  seguaci INTEGER[] DEFAULT ARRAY[]

    )`);

    await db.none(`CREATE TABLE eventi (
      id_evento SERIAL PRIMARY KEY NOT NULL,
      id_creatore INTEGER NOT NULL,
      FOREIGN KEY (id_creatore) REFERENCES users(id),
      nome_evento TEXT NOT NULL,
      start TEXT NOT NULL,
      finish TEXT NOT NULL,
      img BLOB NOT NULL,
      distanza DECIMAL(10,2) NOT NULL,
      orario TIME NOT NULL,
      data DATE NOT NULL,
      partecipanti INTEGER[] DEFAULT ARRAY[],
      privacy  CHAR(1) NOT NULL,
      difficolta CHAR(1) NOT NULL
      ) `);

    console.log("tabelle create correttamente");
  } catch (error) {
    console.error(error.message);
  }
};
setupDb();
