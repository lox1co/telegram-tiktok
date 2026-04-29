require("dotenv").config();

const Database = require("./db/database");
const TikTokService = require("./services/TikTokService");
const DownloaderService = require("./services/DownloaderService");
const TelegramService = require("./services/TelegramService");
const System = require("./core/System");
const BotService = require("./services/CommandService");
const MessageHandler = require("./handlers/MessageHandler");

// Commands
const GetIdCommand = require("./commands/GetIdCommand");
const AddClientCommand = require("./commands/AddClientCommand");
const SetupCommand = require("./commands/SetupCommand");
const ListCommand = require("./commands/ListCommand");
const DeleteCommand = require("./commands/DeleteCommand");
const SetLimitCommand = require("./commands/SetLimitCommand");
const HelpCommand = require("./commands/HelpCommand");

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

async function start() {
  try {
    console.log("🚀 Iniciando sistema...");

    // 1. Database
    const db = new Database();
    await db.dbPromise;

    // 2. Services
    const tiktok = new TikTokService();
    const downloader = new DownloaderService();
    const telegram = new TelegramService(BOT_TOKEN);

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
    const botService = new BotService(BOT_TOKEN, db, commandsList, messageHandler);

    botService.launch();
    console.log("🤖 Bot de comandos activo");

    system.start();
    console.log("⚙️ Worker activo");
  } catch (err) {
    console.error("🔥 Error al iniciar:", err);
  }
}

start();

process.on("uncaughtException", (err) => {
  console.error("💥 Error no controlado:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Promesa rechazada:", err);
});
