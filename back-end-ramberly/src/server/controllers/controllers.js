import { db } from "../initDB.js";

export const registrazione = async (req, res) => {
  const {
    nome,
    cognome,
    email,
    password,
  } = req.body;

 
  const user = await db.oneOrNone(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  );

  if (user) {
    
    res.status(409).json({ message: "L'utente è già registrato" });
  } else {
    try {
      
      const step1 = await db.one(
        `INSERT INTO users (nome, cognome, email, password) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id`, 
        [nome, cognome, email, password]
      );

       const userId = step1.id;
       
      res.status(201).json({ message: "Utente creato con successo", userId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Errore durante la registrazione" });
    }
    
  }
};

export const aggiornaCaratteristiche = async (req, res) => {
  const {
    sesso,
    peso,
    eta,
    attivita,
    monitoraggio,
    gruppo,
    sfide,
  } = req.body;
const {userId}=req.params

  try {
    await db.none(
      `UPDATE users 
       SET sesso=$1, peso=$2, eta=$3, attivita=$4, monitoraggio=$5, gruppo=$6, sfide=$7 
       WHERE id=$8`,
      [sesso, peso, eta, attivita, monitoraggio, gruppo, sfide, userId]
    );

    // Rispondi con successo
    res.status(200).json({ message: "Dati aggiornati con successo" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore durante l'aggiornamento dei dati" });
  }
};
