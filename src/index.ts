import dotenv from "dotenv";
dotenv.config();

import Database from "./db/database";
import TikTokService from "./services/TikTokService";
import DownloaderService from "./services/DownloaderService";
import TelegramService from "./services/TelegramService";
import System from "./core/System";
import BotService from "./services/BotService";
import MessageHandler from "./handlers/MessageHandler";

// Commands
import GetIdCommand from "./commands/GetIdCommand";
import AddClientCommand from "./commands/AddClientCommand";
import SetupCommand from "./commands/SetupCommand";
import ListCommand from "./commands/ListCommand";
import DeleteCommand from "./commands/DeleteCommand";
import SetLimitCommand from "./commands/SetLimitCommand";
import HelpCommand from "./commands/HelpCommand";

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = Number(process.env.ADMIN_ID);

if (!BOT_TOKEN) {
  console.error("❌ Falta BOT_TOKEN en .env");
  process.exit(1);
}

if (!ADMIN_ID) {
  console.error("❌ Falta ADMIN_ID en .env");
  process.exit(1);
}

async function start(): Promise<void> {
  try {
    console.log("🚀 Iniciando sistema...");

    // 1. Database
    const db = new Database();
    await db.dbPromise;

    // 2. Services
    const tiktok = new TikTokService();
    const downloader = new DownloaderService();
    const telegram = new TelegramService(BOT_TOKEN!);

    // 3. System (Workers)
    const system = new System(db, tiktok, downloader, telegram);

    // 4. Commands & Handlers
    const messageHandler = new MessageHandler(db);
    const commandsList = [
      new GetIdCommand(db, ADMIN_ID),
      new AddClientCommand(db, ADMIN_ID),
      new SetupCommand(db, ADMIN_ID),
      new ListCommand(db, ADMIN_ID),
      new DeleteCommand(db, ADMIN_ID),
      new SetLimitCommand(db, ADMIN_ID),
      new HelpCommand(db, ADMIN_ID),
    ];

    // 5. Bot
    const botService = new BotService(BOT_TOKEN!, db, commandsList, messageHandler);

    botService.launch();
    console.log("🤖 Bot de comandos activo");

    system.start();
    console.log("⚙️ Worker activo");
  } catch (err) {
    console.error("🔥 Error al iniciar:", err);
  }
}

start();

process.on("uncaughtException", (err: Error) => {
  console.error("💥 Error no controlado:", err);
});

process.on("unhandledRejection", (err: any) => {
  console.error("💥 Promesa rechazada:", err);
});
