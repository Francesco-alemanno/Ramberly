import pgPromise from "pg-promise";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const URL = process.env.URL;

export const db = pgPromise()(URL);

// export const db = pgPromise()(
//   "postgresql://team_user:Ramberly31@130.25.236.251:5432/team_db?schema=public"
// );

// export const db = pgPromise()(
//   "postgresql://postgres:Fingerskate1@localhost:5432/ramberly"
// );

const readImage = (filePath) => {
  return fs.readFileSync(path.resolve(filePath)); // Legge il file e restituisce un buffer
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatars = {
  luca: path.join(__dirname, "../assets/avatar/avatar (3).webp"),
  giulia: path.join(__dirname, "../assets/avatar/avatar (1).webp"),
  sara: path.join(__dirname, "../assets/avatar/avatar (2).webp"),
  davide: path.join(__dirname, "../assets/avatar/avatar (4).webp"),
  elisa: path.join(__dirname, "../assets/avatar/avatar (5).webp"),
  antonio: path.join(__dirname, "../assets/avatar/avatar (8).webp"),
  federico: path.join(__dirname, "../assets/avatar/avatar (9).webp"),
  chiara: path.join(__dirname, "../assets/avatar/avatar (6).webp"),
};
const setupDb = async () => {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nome TEXT,
        cognome TEXT,
        email TEXT UNIQUE,
        password TEXT,
        token TEXT,
        punteggio NUMERIC(4,1) DEFAULT 1.0,
        livello INTEGER GENERATED ALWAYS AS (FLOOR(punteggio)) STORED,
        img BYTEA, 
        sesso TEXT,
        peso INTEGER,
        eta INTEGER CHECK (eta >= 18 AND eta <= 99),  
        attivita CHAR(1),
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
    await db.none(
      `CREATE OR REPLACE FUNCTION update_livello()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.livello := FLOOR(NEW.punteggio);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trigger_update_livello
      BEFORE INSERT OR UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_livello();`
    );
    await db.none(
      `INSERT INTO users (nome, cognome, email, password, punteggio, img, sesso, peso, eta, attivita, monitoraggio, gruppo, sfide, running, escursione, biking, camminata, seguiti, seguaci)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19),
        ($20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38),
        ($39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57),
        ($58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76),
        ($77, $78, $79, $80, $81, $82, $83, $84, $85, $86, $87, $88, $89, $90, $91, $92, $93, $94, $95),
        ($96, $97, $98, $99, $100, $101, $102, $103, $104, $105, $106, $107, $108, $109, $110, $111, $112, $113, $114),
        ($115, $116, $117, $118, $119, $120, $121, $122, $123, $124, $125, $126, $127, $128, $129, $130, $131, $132, $133),
        ($134, $135, $136, $137, $138, $139, $140, $141, $142, $143, $144, $145, $146, $147, $148, $149, $150, $151, $152)
      `,
      [
        "Luca",
        "Rossi",
        "luca.rossi@email.com",
        "Pass123!",
        12.5,
        readImage(avatars.luca),
        "M",
        75,
        28,
        "2",
        "si",
        "gruppo",
        "si",
        true,
        false,
        false,
        true,
        [2, 3],
        [5, 6, 7],
        "Giulia",
        "Bianchi",
        "giulia.bianchi@email.com",
        "Pass123",
        24.3,
        readImage(avatars.giulia),
        "F",
        60,
        32,
        "4",
        "si",
        "entrambi",
        "si",
        false,
        true,
        false,
        true,
        [1, 4],
        [3, 8],
        "Sara",
        "Neri",
        "sara.neri@email.com",
        "Pass123",
        17.8,
        readImage(avatars.sara),
        "F",
        55,
        25,
        "5",
        "si",
        "solo",
        "si",
        false,
        false,
        false,
        true,
        [2, 5],
        [6, 7, 9],
        "Davide",
        "Gialli",
        "davide.gialli@email.com",
        "Pass123",
        29.4,
        readImage(avatars.davide),
        "M",
        85,
        40,
        "2",
        "si",
        "entrambi",
        "si",
        true,
        false,
        false,
        false,
        [1, 3, 4],
        [8, 9, 10],
        "Elisa",
        "Blu",
        "elisa.blu@email.com",
        "Pass123",
        8.9,
        readImage(avatars.elisa),
        "F",
        68,
        35,
        "4",
        "si",
        "gruppo",
        "si",
        false,
        true,
        false,
        false,
        [2, 7, 9],
        [1, 3, 5],
        "Antonio",
        "Viola",
        "antonio.viola@email.com",
        "Pass123",
        21.7,
        readImage(avatars.antonio),
        "M",
        90,
        50,
        "2",
        "si",
        "gruppo",
        "si",
        false,
        false,
        true,
        false,
        [5, 6],
        [1, 2, 10],
        "Federico",
        "Marrone",
        "federico.marrone@email.com",
        "Pass123",
        14.2,
        readImage(avatars.federico),
        "M",
        78,
        45,
        "2",
        "si",
        "solo",
        "si",
        true,
        false,
        false,
        false,
        [2, 4, 6],
        [1, 3, 5, 7],
        "Chiara",
        "Grigio",
        "chiara.grigio@email.com",
        "Pass123",
        26.8,
        readImage(avatars.chiara),
        "F",
        62,
        31,
        "4",
        "si",
        "solo",
        "si",
        false,
        true,
        false,
        true,
        [3, 8],
        [4, 6, 9],
      ]
    );

    await db.none(`      
      CREATE TABLE IF NOT EXISTS eventi (
        id_evento SERIAL PRIMARY KEY,
        id_creatore INTEGER,
        FOREIGN KEY (id_creatore) REFERENCES users(id),
        nome_evento TEXT,
        start TEXT,
        finish TEXT,
        map_img BYTEA,
        distanza DECIMAL(10,2),
        orario TIME,
        data DATE,
        partecipanti INTEGER[] DEFAULT ARRAY[]::INTEGER[],
        privacy CHAR(1),
        difficolta CHAR(1)
      );
    `);
    // await db.none(
    //   `INSERT INTO eventi (id_creatore, nome_evento, start, finish, map_img, distanza, orario, data, partecipanti, privacy, difficolta) VALUES
    //   ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11),
    //   ($12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22),
    //   ($23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33)`,
    //   [
    //     1,
    //     "corsetta mattutina",
    //     "Via della Moscova, Milano",
    //     "Corso Como, Milano",
    //     readImage("../assets/placeholder-mappa/map-placeholder.png"),
    //     12.2,
    //     "16:00",
    //     "2025-02-24",
    //     [2, 3],
    //     "1",
    //     null,
    //     2,
    //     "corsetta pomeridiana",
    //     "Via del Corso, Roma",
    //     "Via dei Condotti, Roma",
    //     readImage("../assets/placeholder-mappa/map-placeholder(2).png"),
    //     8.1,
    //     "15:00",
    //     "2025-01-18",
    //     [4, 5],
    //     "1",
    //     null,
    //     3,
    //     "passeggiata notturna",
    //     "Via Roma, Torino",
    //     "Via Trinchese, Torino",
    //     readImage("../assets/placeholder-mappa/map-placeholder(3).png"),
    //     4.4,
    //     "10:00",
    //     "2025-04-05",
    //     [6, 7, 8],
    //     "1",
    //     null,
    //   ]
    // );

    console.log("Tabelle create correttamente");
  } catch (error) {
    console.error("Errore durante la creazione delle tabelle:", error.message);
  }
};

setupDb();
