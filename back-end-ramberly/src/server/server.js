import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  aggiornaCaratteristiche,
  getAllEvents,
  getEventParticipants,
  getAllUsers,
  getLoggedUser,
  login,
  registrazione,
  scegliAvatar,
  sportPreferito,
  followUser,
  updateEventUser,
  deleteEventUser,
  logout,
  getEventiPreferiti,
  getAvatar,
} from "./controllers/controllers.js";
import passport from "passport";
import "./passport.js";
import { authorize } from "./authorize.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// middleware
app.use(json());
app.use(cors());
app.use(passport.initialize());
// -----------
// flusso registrazione
app.post("/registrazione", registrazione);
app.put("/caratteristiche/:userId", aggiornaCaratteristiche);
app.put("/scegliSport/:userId", sportPreferito);
app.put("/potrestiConoscere/:userId", followUser);
app.put("/scegliAvatar/:userId", upload.single("img"), scegliAvatar);
app.get('/avatar/:userId', getAvatar)
// ------------

// flusso login/logout
app.post("/login", login);
app.get("/logout", authorize, logout);

//flusso home
app.get("/home", authorize, getLoggedUser);
app.get("/users", getAllUsers);
app.get("/events", getAllEvents);
app.put("/events", updateEventUser);
app.delete("/events", deleteEventUser);
app.get("/events/:id_evento", getEventParticipants);

// Eventi preferiti
app.get("/eventiPreferiti/:userId", getEventiPreferiti);
// LISTEN
app.listen(PORT, () => {
  console.log(`server in ascolto su http://localhost:${PORT}`);
});
