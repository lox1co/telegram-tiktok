const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

class Database {
  constructor() {
    this.dbPromise = open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    }).then(async (db) => {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY,
            name TEXT,
            account_limit INTEGER DEFAULT 1
        );
        CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER,
            username TEXT,
            channel_id TEXT
        );
        CREATE TABLE IF NOT EXISTS sent_videos (
            video_id TEXT,
            client_id INTEGER,
            PRIMARY KEY (video_id, client_id)
        );
        CREATE INDEX IF NOT EXISTS idx_sent_videos_client_id ON sent_videos(client_id);
        
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            session_data TEXT
        );
      `);
      return db;
    });
  }

  async isSent(videoId, clientId) {
    const db = await this.dbPromise;
    const row = await db.get("SELECT 1 FROM sent_videos WHERE video_id=? AND client_id=?", [videoId, clientId]);
    return !!row;
  }

  async markSent(videoId, clientId) {
    const db = await this.dbPromise;
    await db.run("INSERT OR IGNORE INTO sent_videos VALUES (?, ?)", [videoId, clientId]);
  }

  async addClientWithId(id, name) {
    const db = await this.dbPromise;
    await db.run("INSERT OR IGNORE INTO clients (id, name, account_limit) VALUES (?, ?, 1)", [id, name]);
  }

  async getClients() {
    const db = await this.dbPromise;
    return await db.all("SELECT * FROM clients");
  }

  async getClientById(id) {
    const db = await this.dbPromise;
    return await db.get("SELECT * FROM clients WHERE id=?", [id]);
  }

  async deleteClient(id) {
    const db = await this.dbPromise;
    await db.run("DELETE FROM clients WHERE id=?", [id]);
  }

  async setLimit(userId, limit) {
    const db = await this.dbPromise;
    await db.run("UPDATE clients SET account_limit=? WHERE id=?", [limit, userId]);
  }

  async addAccount({ username, channel_id, client_id }) {
    const db = await this.dbPromise;
    await db.run(
      "INSERT INTO accounts (username, channel_id, client_id) VALUES (?, ?, ?)",
      [username, channel_id, client_id]
    );
  }

  async getAccounts(clientId) {
    const db = await this.dbPromise;
    return await db.all("SELECT * FROM accounts WHERE client_id=?", [clientId]);
  }

  async deleteAccount(username, clientId) {
    const db = await this.dbPromise;
    await db.run("DELETE FROM accounts WHERE username=? AND client_id=?", [username, clientId]);
  }

  async getSession(id) {
    const db = await this.dbPromise;
    const row = await db.get("SELECT session_data FROM sessions WHERE id=?", [id]);
    return row ? JSON.parse(row.session_data) : null;
  }

  async saveSession(id, data) {
    const db = await this.dbPromise;
    await db.run(
      "INSERT INTO sessions (id, session_data) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET session_data=excluded.session_data",
      [id, JSON.stringify(data)]
    );
  }
}

module.exports = Database;
