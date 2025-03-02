import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  aggiornaCaratteristiche,
  login,
  registrazione,
  scegliAvatar,
  sportPreferito,
} from "./controllers/controllers.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT;

// middleware
app.use(json());
app.use(cors());
// -----------
// flusso registrazione
app.post("/registrazione", registrazione);
app.put("/caratteristiche/:userId", aggiornaCaratteristiche);
app.put("/scegliSport/:userId", sportPreferito);
app.put('/scegliAvatar/:userId', scegliAvatar )
// ------------

// flusso login
app.post('/login', login )
// LISTEN
app.listen(PORT, () => {
  console.log(`server in ascolto su http://localhost:${PORT}`);
});
