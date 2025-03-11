import { db } from "../initDB.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const { SECRET = "" } = process.env;

//flusso registrazione
export const registrazione = async (req, res) => {
  const { nome, cognome, email, password } = req.body;
  const userExist = await db.oneOrNone(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (userExist) {
    res.status(409).json({ message: "L'utente è già registrato" });
  } else {
    try {
      const user = await db.one(
        `INSERT INTO users (nome, cognome, email, password) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id`,
        [nome, cognome, email, password]
      );

      res
        .status(201)
        .json({ message: "Utente creato con successo", userId: user.id });
    } catch (err) {
      console.error("Errore durante la registrazione:", err);
      res.status(500).json({ message: "Errore durante la registrazione" });
    }
  }
};

export const aggiornaCaratteristiche = async (req, res) => {
  const { sesso, peso, eta, attivita, monitoraggio, gruppo, sfide } = req.body;
  const { userId } = req.params;

  try {
    await db.none(
      `UPDATE users 
       SET sesso=$1, peso=$2, eta=$3, attivita=$4, monitoraggio=$5, gruppo=$6, sfide=$7 
       WHERE id=$8`,
      [sesso, peso, eta, attivita, monitoraggio, gruppo, sfide, userId]
    );

    res.status(200).json({ message: "Dati aggiornati con successo" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Errore durante l'aggiornamento dei dati" });
  }
};

export const sportPreferito = async (req, res) => {
  const { running, escursione, biking, camminata } = req.body;
  const { userId } = req.params;

  try {
    await db.none(
      `UPDATE users 
       SET running=$1, escursione=$2, biking=$3, camminata=$4
       WHERE id=$5`,
      [running, escursione, biking, camminata, userId]
    );

    res.status(200).json({ message: "Dati aggiornati con successo" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Errore durante l'aggiornamento dei dati" });
  }
};

export const followUser = async (req, res) => {
  const { userId } = req.params;
  const { targetUserId } = req.body;
  try {
    for (const targetId of targetUserId) {
      await db.none(
        `UPDATE users 
         SET seguiti = array_append(seguiti, $2) 
         WHERE id = $1 AND NOT ($2 = ANY(seguiti))`,
        [userId, targetId]
      );
    }
    res.status(200).json({ message: "Utenti seguiti aggiornati con successo" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Errore durante l'aggiornamento dei dati" });
  }
};

export const scegliAvatar = async (req, res) => {
  const { userId } = req.params;
  const avatarBuffer = req.file.buffer;

  try {
    await db.oneOrNone(
      `UPDATE users
      SET img = $1
      WHERE id = $2
      RETURNING id;
    `,
      [avatarBuffer, userId]
    );

    res.status(200).json({ message: "Avatar aggiornato con successo" });
  } catch (error) {
    console.error("Errore aggiornamento avatar:", error.message);
    res
      .status(500)
      .json({ message: "Errore durante l'aggiornamento dell'avatar." });
  }
};

export const getAvatar = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await db.oneOrNone(
      `SELECT encode(img, 'base64') AS img FROM users WHERE id = $1;`,
      [userId]
    );

    if (!user || !user.img) {
      return res.status(404).json({ message: "Avatar non trovato" });
    }

    res.json({ img: `data:image/png;base64,${user.img}` });
  } catch (error) {
    console.error(
      "Errore nel recupero dell'avatar:",
      error.message,
      error.stack
    );
    res
      .status(500)
      .json({ message: "Errore durante il recupero dell'avatar." });
  }
};

// flusso login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.oneOrNone(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);
    if (!user && !user.password === password) {
      return res
        .status(400)
        .json({ message: "credenziali errate o user non esistente" });
    } else {
      const payload = { id: user.id, email };
      const token = jwt.sign(payload, SECRET);
      await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user.id, token]);
      res.status(200).json({ id: user.id, email, token });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//flusso home
export const getLoggedUser = async (req, res) => {
  try {
    const userId = req.user.id; // Ottieni l'ID utente dal token
    const userLogged = await db.oneOrNone(
      "SELECT id, nome, email, img, livello, sesso, peso, eta, attivita, monitoraggio, gruppo, sfide e FROM users WHERE id = $1",
      [userId]
    );
    if (userLogged) {
      return res.status(200).json(userLogged);
    }
    return res.status(404).json({ message: "utente non trovato" });
  } catch (error) {
    res.status(500).json({ message: "errore nella richiesta", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await db.many(`SELECT * FROM users`);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "errore nella richiesta", error });
  }
};

export const getUsersAvatar = async (req, res) => {
  try {
    const result = await db.manyOrNone(`
      SELECT 
        id AS user_id, 
        encode(img, 'base64') AS user_avatar_base64
      FROM users;
    `);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: `Errore nella richiesta`, error });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events =
      await db.many(`SELECT eventi.*, users.nome,  COALESCE(encode(eventi.map_img, 'base64'), '') AS map_img_base64, users.livello 
      FROM eventi 
      JOIN users ON eventi.id_creatore = users.id`);
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: "errore nella richiesta", error });
  }
};

export const getEventiPreferiti = async (req, res) => {
  const { userId } = req.params;
  try {
    const eventiPreferiti = await db.any(
      `SELECT eventi.*, users.nome, users.livello, users.img 
FROM eventi
JOIN users ON eventi.id_creatore = users.id  
WHERE $1 = ANY(eventi.partecipanti)`,
      [userId]
    );
    res.status(200).json(eventiPreferiti);
    return eventiPreferiti;
  } catch (error) {
    console.error("Errore nel recupero degli eventi preferiti:", error);
    res.status(400).json({ message: "non trovato" });

    throw error;
  }
};

export const insertEvents = async (req, res) => {
  const { userId } = req.params;
  try {
    const { nome_evento, start, finish,  distanza, orario, data } =
      req.body;
      const map_img = req.file.buffer
     await db.none(
      `INSERT INTO eventi (id_creatore, nome_evento, start, finish, map_img, distanza, orario, data ) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)`,
      [userId, nome_evento, start, finish, map_img, distanza, orario, data]
    );
    return res.status(200).json({ message: "Evento aggiunto" });
  } catch (err) {
    console.error("Errore nei dati inseriti");
    res.status(500).json({ message: "Errore nel server" });
  }
};


export const updateEventUser = async (req, res) => {
  const { id, event_id } = req.body;
  try {
    await db.none(
      `UPDATE eventi SET partecipanti = CASE WHEN NOT ($1 = ANY(partecipanti)) THEN array_append(partecipanti, $1) ELSE partecipanti END WHERE id_evento = $2`,
      [id, event_id]
    );
    const updatedEvent = await db.one(
      `SELECT eventi.*, users.nome, users.img, users.livello 
       FROM eventi 
       JOIN users ON eventi.id_creatore = users.id
       WHERE eventi.id_evento = $1`,
      [event_id]
    );
    return res.status(200).json({
      message: `utente aggiunto correttamente o già esistente`,
      updatedEvent,
    });
  } catch (error) {
    return res.status(500).json({ message: `errore nella richiesta`, error });
  }
};

export const deleteEventUser = async (req, res) => {
  const { id, event_id } = req.body;
  try {
    await db.none(
      `UPDATE eventi  SET partecipanti=array_remove(partecipanti, $1)  WHERE id_evento=$2`,
      [id, event_id]
    );
    const updatedEvent = await db.one(
      `SELECT eventi.*, users.nome, users.img, users.livello 
       FROM eventi 
       JOIN users ON eventi.id_creatore = users.id
       WHERE eventi.id_evento = $1`,
      [event_id]
    );
    return res
      .status(200)
      .json({ message: `eliminato con successo`, updatedEvent });
  } catch (error) {
    return res.status(500).json({ message: `errore nella richiesta`, error });
  }
};

export const getEventParticipants = async (req, res) => {
  const { id_evento } = req.params;
  try {
    const partecipanti = await db.any(
      `SELECT users.nome
       FROM eventi
       JOIN LATERAL unnest(eventi.partecipanti) AS partecipante_id ON true
       JOIN users ON users.id = partecipante_id
       WHERE eventi.id_evento = $1;`,
      [id_evento]
    );
    return res.json(partecipanti);
  } catch (error) {
    return res.status(500).json({ message: `errore nella richiesta`, error });
  }
};

export const getEventsAvatar = async (req, res) => {
  try {
    const result = await db.manyOrNone(`SELECT 
    eventi.id_evento,  
    users.id AS user_id, 
    encode(users.img, 'base64') AS user_avatar_base64
    FROM eventi
    JOIN users ON eventi.id_creatore = users.id;`);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: `errore nella richiesta`, error });
  }
};

export const logout = async (req, res) => {
  const user = req.user;
  try {
    await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user?.id, null]);
    res.status(200).json({ message: "logout successfull" });
  } catch (error) {
    console.error("logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
