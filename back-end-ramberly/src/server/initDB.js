import pgPromise from "pg-promise";
import dotenv from "dotenv";

dotenv.config();
const url = process.env.URL; // da inizializzare

const db = pgPromise()("postgres://<USERNAME>:<PASSWORD>@localhost:5432/<DATABASE>");
const setupDb = async () => {
  await db.none(
    ``)
};
setupDb();