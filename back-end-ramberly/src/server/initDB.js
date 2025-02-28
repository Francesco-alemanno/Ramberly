import pgPromise from "pg-promise";
import dotenv from "dotenv";

dotenv.config();
// const url = process.env.URL; // da inizializzare

export const db = pgPromise()(
  "postgresql://team_user:Ramberly31@130.25.236.251:5432/team_db?schema=public"
);

const setupDb = async () => {
  try {
    await db.none(`
      DROP TABLE IF EXISTS users;
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        nome TEXT,
        cognome TEXT,
        email TEXT UNIQUE,
        password TEXT,
        livello INTEGER DEFAULT 1,
        img BYTEA,
        sesso TEXT,
        peso INTEGER,
        eta INTEGER CHECK (eta >= 18 AND eta <= 99),  
        attivita TEXT,
        monitoraggio TEXT,
        gruppo TEXT,
        sfide TEXT,
        running TEXT,
        escursione TEXT,
        biking TEXT,
        camminata TEXT,
        seguiti INTEGER[] DEFAULT ARRAY[]::INTEGER[],
        seguaci INTEGER[] DEFAULT ARRAY[]::INTEGER[]
      );
    `);

    await db.none(`
      DROP TABLE IF EXISTS eventi;
      CREATE TABLE eventi (
        id_evento SERIAL PRIMARY KEY,
        id_creatore INTEGER,
        FOREIGN KEY (id_creatore) REFERENCES users(id),
        nome_evento TEXT,
        start TEXT,
        finish TEXT,
        img BYTEA,
        distanza DECIMAL(10,2),
        orario TIME,
        data DATE,
        partecipanti INTEGER[] DEFAULT ARRAY[]::INTEGER[],
        privacy CHAR(1),
        difficolta CHAR(1)
      );
    `);

    console.log("Tabelle create correttamente");
  } catch (error) {
    console.error("Errore durante la creazione delle tabelle:", error.message);
  }
};

setupDb();
