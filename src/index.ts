import dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import fs from "node:fs";
import Database from "./db/database";
import TikTokService from "./services/TikTokService";
import DownloaderService from "./services/DownloaderService";
import TelegramService from "./services/TelegramService";
import System from "./core/System";
import BotService from "./services/BotService";
import MessageHandler from "./handlers/MessageHandler";

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

    const db = new Database();
    await db.dbPromise;

    const tiktok = new TikTokService();
    const downloader = new DownloaderService();
    const telegram = new TelegramService(BOT_TOKEN!);

    const system = new System(db, tiktok, downloader, telegram);

    const messageHandler = new MessageHandler(db);

    // Dynamic Command Loading
    const commandsList: any[] = [];
    const commandsDir = path.join(__dirname, "commands");

    const loadCommands = async (dir: string) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          await loadCommands(fullPath);
        } else if ((file.endsWith(".ts") || file.endsWith(".js")) && !file.startsWith("BaseCommand")) {
          try {
            const { default: CommandClass } = await import(fullPath);
            if (CommandClass && typeof CommandClass === "function") {
              const cmd = new CommandClass();
              cmd.db = db;
              commandsList.push(cmd);
            }
          } catch (err) {
            console.error(`❌ Error cargando comando ${file}:`, err);
          }
        }
      }
    };

    await loadCommands(commandsDir);

    const helpCmd = commandsList.find((c) => c.name === "help") as any;
    if (helpCmd) {
      helpCmd.allCommands = commandsList;
    }

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
