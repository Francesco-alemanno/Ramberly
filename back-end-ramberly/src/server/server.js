import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { aggiornaCaratteristiche, registrazione } from "./controllers/controllers.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// middleware
app.use(json());
app.use(cors());
// -----------
app.post("/registrazione", registrazione);
app.put('/caratteristiche/:userId', aggiornaCaratteristiche)
// LISTEN
app.listen(PORT, () => {
  console.log(`server in ascolto su http://localhost:${PORT}`);
});
