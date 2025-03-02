import pgPromise from "pg-promise";
import dotenv from "dotenv";
import bcrypt from 'bcrypt'
dotenv.config();
// const url = process.env.URL; // da inizializzare

export const db = pgPromise()(
  "postgresql://team_user:Ramberly31@130.25.236.251:5432/team_db?schema=public"
);
// export const db = pgPromise()(
//   "postgresql://postgres:Fingerskate1@localhost:5432/ramberly"
// );
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
        running BOOLEAN,
        escursione BOOLEAN,
        biking BOOLEAN,
        camminata BOOLEAN,
        seguiti INTEGER[] DEFAULT ARRAY[]::INTEGER[],
        seguaci INTEGER[] DEFAULT ARRAY[]::INTEGER[]
      );
    `);
    await db.none(`INSERT INTO users (nome, cognome, email, password, livello, sesso, peso, eta, attivita, monitoraggio, gruppo, sfide, running, escursione, biking, camminata, seguiti, seguaci)
VALUES 
    ('Luca', 'Rossi', 'luca.rossi@email.com', 'Pass123!', 3, 'M', 75, 28, '2', 'si', 'gruppo', 'si', TRUE, FALSE, FALSE, TRUE, ARRAY[2,3], ARRAY[5,6,7]),
    ('Giulia', 'Bianchi', 'giulia.bianchi@email.com', 'Pass123', 5, 'F', 60, 32, '4', 'si', 'entrambi', 'si', FALSE, TRUE, FALSE, TRUE, ARRAY[1,4], ARRAY[3,8]),
    ('Sara', 'Neri', 'sara.neri@email.com', 'Pass123', 2, 'F', 55, 25, '5', 'si', 'solo', 'si', FALSE, FALSE, FALSE, TRUE, ARRAY[2,5], ARRAY[6,7,9]),
    ('Davide', 'Gialli', 'davide.gialli@email.com', 'Pass123', 7, 'M', 85, 40, '2', 'si', 'entrambi', 'si', TRUE, FALSE, FALSE, FALSE, ARRAY[1,3,4], ARRAY[8,9,10]),
    ('Elisa', 'Blu', 'elisa.blu@email.com', 'Pass123', 4, 'F', 68, 35, '4', 'si', 'gruppo', 'si', FALSE, TRUE, FALSE, FALSE, ARRAY[2,7,9], ARRAY[1,3,5]),
    ('Antonio', 'Viola', 'antonio.viola@email.com', 'Pass123', 6, 'M', 90, 50, '2', 'si', 'gruppo', 'si', FALSE, FALSE, TRUE, FALSE, ARRAY[5,6], ARRAY[1,2,10]),
    ('Federico', 'Marrone', 'federico.marrone@email.com', 'Pass123', 8, 'M', 78, 45, '2', 'si', 'solo', 'si', TRUE, FALSE, FALSE, FALSE, ARRAY[2,4,6], ARRAY[1,3,5,7]),
    ('Chiara', 'Grigio', 'chiara.grigio@email.com', 'Pass123', 5, 'F', 62, 31, '4', 'si', 'solo', 'si', FALSE, TRUE, FALSE, TRUE, ARRAY[3,8], ARRAY[4,6,9])`);
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



