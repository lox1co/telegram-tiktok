import sqlite3 from "sqlite3";
import { open, Database as SQLiteDatabase } from "sqlite";
import { Client, Account, SessionData } from "../types";

class Database {
  public dbPromise: Promise<SQLiteDatabase>;

  constructor() {
    this.dbPromise = open({
      filename: "./database.sqlite",
      driver: sqlite3.Database,
    }).then(async (db) => {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY,
            name TEXT,
            account_limit INTEGER DEFAULT 1,
            template TEXT
        );
        -- Ensure template column exists if table was already created
        ALTER TABLE clients ADD COLUMN template TEXT;
        CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER,
            username TEXT,
            channel_id TEXT,
            thread_id TEXT
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

  async isSent(videoId: string, clientId: number): Promise<boolean> {
    const db = await this.dbPromise;
    const row = await db.get("SELECT 1 FROM sent_videos WHERE video_id=? AND client_id=?", [videoId, clientId]);
    return !!row;
  }

  async markSent(videoId: string, clientId: number): Promise<void> {
    const db = await this.dbPromise;
    await db.run("INSERT OR IGNORE INTO sent_videos VALUES (?, ?)", [videoId, clientId]);
  }

  async addClientWithId(id: number, name: string): Promise<void> {
    const db = await this.dbPromise;
    await db.run("INSERT OR IGNORE INTO clients (id, name, account_limit) VALUES (?, ?, 1)", [id, name]);
  }

  async getClients(): Promise<Client[]> {
    const db = await this.dbPromise;
    return await db.all<Client[]>("SELECT * FROM clients");
  }

  async getClientById(id: number): Promise<Client | undefined> {
    const db = await this.dbPromise;
    return await db.get<Client>("SELECT * FROM clients WHERE id=?", [id]);
  }

  async deleteClient(id: number): Promise<void> {
    const db = await this.dbPromise;
    await db.run("DELETE FROM clients WHERE id=?", [id]);
  }

  async setLimit(userId: number | string, limit: number | string): Promise<void> {
    const db = await this.dbPromise;
    await db.run("UPDATE clients SET account_limit=? WHERE id=?", [limit, userId]);
  }

  async setTemplate(clientId: number, template: string): Promise<void> {
    const db = await this.dbPromise;
    await db.run("UPDATE clients SET template=? WHERE id=?", [template, clientId]);
  }

  async getTemplate(clientId: number): Promise<string | undefined> {
    const db = await this.dbPromise;
    const row = await db.get<{ template: string }>("SELECT template FROM clients WHERE id=?", [clientId]);
    return row?.template;
  }

  async getStats(clientId: number): Promise<{ accounts: number; videos: number }> {
    const db = await this.dbPromise;
    const accounts = await db.get<{ count: number }>("SELECT COUNT(*) as count FROM accounts WHERE client_id=?", [
      clientId,
    ]);
    const videos = await db.get<{ count: number }>("SELECT COUNT(*) as count FROM sent_videos WHERE client_id=?", [
      clientId,
    ]);
    return {
      accounts: accounts?.count || 0,
      videos: videos?.count || 0,
    };
  }

  async addAccount(data: {
    username: string;
    channel_id: string;
    thread_id?: string;
    client_id: number;
  }): Promise<void> {
    const db = await this.dbPromise;
    await db.run("INSERT INTO accounts (username, channel_id, thread_id, client_id) VALUES (?, ?, ?, ?)", [
      data.username,
      data.channel_id,
      data.thread_id,
      data.client_id,
    ]);
  }

  async getAccounts(clientId: number): Promise<Account[]> {
    const db = await this.dbPromise;
    return await db.all<Account[]>("SELECT * FROM accounts WHERE client_id=?", [clientId]);
  }

  async deleteAccount(username: string, clientId: number): Promise<void> {
    const db = await this.dbPromise;
    await db.run("DELETE FROM accounts WHERE username=? AND client_id=?", [username, clientId]);
  }

  async getSession(id: string): Promise<SessionData | null> {
    const db = await this.dbPromise;
    const row = await db.get<{ session_data: string }>("SELECT session_data FROM sessions WHERE id=?", [id]);
    return row ? (JSON.parse(row.session_data) as SessionData) : null;
  }

  async saveSession(id: string, data: SessionData): Promise<void> {
    const db = await this.dbPromise;
    await db.run(
      "INSERT INTO sessions (id, session_data) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET session_data=excluded.session_data",
      [id, JSON.stringify(data)],
    );
  }

  async getGlobalStats(): Promise<{ totalClients: number; totalAccounts: number; totalVideos: number }> {
    const db = await this.dbPromise;
    const clients = await db.get<{ count: number }>("SELECT COUNT(*) as count FROM clients");
    const accounts = await db.get<{ count: number }>("SELECT COUNT(*) as count FROM accounts");
    const videos = await db.get<{ count: number }>("SELECT COUNT(*) as count FROM sent_videos");
    return {
      totalClients: clients?.count || 0,
      totalAccounts: accounts?.count || 0,
      totalVideos: videos?.count || 0,
    };
  }
}

export default Database;
