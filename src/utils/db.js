import { openDatabaseAsync } from "expo-sqlite";

let dbPromise;
export function getDb() {
  if (!dbPromise) dbPromise = openDatabaseAsync("fish.db");
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
      imageUri TEXT,
      fishObj TEXT
    );
  `);
}

// db.js
export async function createData(name, email, imageUri, fishObject) {
  const db = await getDb();
  try {
    // make sure fishObject is JSON-safe
    let fishJson = null;
    try {
      fishJson = JSON.stringify(fishObject ?? null);
    } catch {
      fishJson = null; // fallback if circular
    }

    await db.runAsync(
      "INSERT INTO users (name, email, imageUri, fishObj) VALUES (?, ?, ?, ?);",
      [name ?? null, email ?? null, imageUri ?? null, fishJson]
    );
  } catch (e) {
    console.warn("createData failed:", e);
    throw e;
  }
}

export async function fetchData() {
  const db = await getDb();
  try {
    const rows = await db.getAllAsync("SELECT * FROM users ORDER BY id DESC;");
    // Convert TEXT -> object (and handle legacy null/empty rows)
    return rows.map((r) => ({
      ...r,
      fish: r.fishObj ? JSON.parse(r.fishObj) : null,
    }));
  } catch (e) {
    console.warn("Error fetching data:", e);
    return [];
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

export async function getAllData() {
  const db = await getDb();
  return await db.getAllAsync("SELECT * FROM users");
}

