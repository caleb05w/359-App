import { openDatabaseAsync } from "expo-sqlite";

let dbPromise;
export function getDb() {
  if (!dbPromise) dbPromise = openDatabaseAsync("app.db");
  return dbPromise;
}

//create DB
export async function initDb() {
  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT
    );
  `);
}

export async function createData(name, email) {
  const db = await getDb();
  await db.runAsync("INSERT INTO users (name, email) VALUES (?, ?);", [
    name,
    email,
  ]);
}

export async function fetchData() {
  const db = await getDb();
  try {
    return await db.getAllAsync("SELECT * FROM users ORDER BY id DESC;");
  } catch (e) {
    console.warn("Error fetching data:", e);
    return []; // <- so data.map doesn't explode
  }
}

export async function deleteById(id) {
  const db = await getDb();
  await db.runAsync("DELETE FROM users WHERE id = ?;", [id]);
}
