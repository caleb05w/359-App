import { openDatabaseAsync } from "expo-sqlite";

let dbPromise;
export function getDb() {
  if (!dbPromise) dbPromise = openDatabaseAsync("appv2.db");
  return dbPromise;
}

//create DB
export async function initDb() {
  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      imageUri TEXT
    );
  `);
}

export async function createData(name, email, imageUri) {
  const db = await getDb();
  try {
    await db.runAsync(
      //inserts into table (users) [x] values, then VALUES (number of values)
      "INSERT INTO users (name, email, imageUri) VALUES (?, ?, ?);",
      [name, email, imageUri]
    );
    console.log("data saved");
  } catch (e) {
    console.warn(`failed to save`, e);
  }
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

export async function deleteData() {
  const db = await getDb();
  try {
    await db.runAsync("DELETE FROM users;");
    console.log("all data deleted");
  } catch (e) {
    console.warn("Error deleting data", e);
  }
}

export async function deleteById(id) {
  const db = await getDb();
  await db.runAsync("DELETE FROM users WHERE id = ?;", [id]);
}
