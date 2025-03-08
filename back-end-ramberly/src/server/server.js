import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  aggiornaCaratteristiche,
  getAllEvents,
  getEventParticipants,
  getAllUsers,
  // getUserById,
  getLoggedUser,
  login,
  registrazione,
  scegliAvatar,
  sportPreferito,
  updateEventUser,
  deleteEventUser,
  logout,
} from "./controllers/controllers.js";
import passport from "passport";
import "./passport.js";
import { authorize } from "./authorize.js";

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
app.put("/scegliAvatar/:userId", scegliAvatar);
// ------------

// flusso login/logout
app.post("/login", login);
app.get("/logout", authorize, logout);

//flusso home
app.get(
  "/home",
  passport.authenticate("jwt", { session: false }),
  getLoggedUser
);
app.get("/users", getAllUsers);
app.get("/events", getAllEvents);
app.put("/events", updateEventUser);
app.delete("/events", deleteEventUser);
app.get("/events/:id_evento", getEventParticipants);
// app.get("/users/:id", getUserById);

// LISTEN
app.listen(PORT, () => {
  console.log(`server in ascolto su http://localhost:${PORT}`);
});
