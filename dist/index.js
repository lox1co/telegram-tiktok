"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const database_1 = __importDefault(require("./db/database"));
const TikTokService_1 = __importDefault(require("./services/TikTokService"));
const DownloaderService_1 = __importDefault(require("./services/DownloaderService"));
const TelegramService_1 = __importDefault(require("./services/TelegramService"));
const System_1 = __importDefault(require("./core/System"));
const BotService_1 = __importDefault(require("./services/BotService"));
const MessageHandler_1 = __importDefault(require("./handlers/MessageHandler"));
// Commands
const GetIdCommand_1 = __importDefault(require("./commands/GetIdCommand"));
const AddClientCommand_1 = __importDefault(require("./commands/AddClientCommand"));
const SetupCommand_1 = __importDefault(require("./commands/SetupCommand"));
const ListCommand_1 = __importDefault(require("./commands/ListCommand"));
const DeleteCommand_1 = __importDefault(require("./commands/DeleteCommand"));
const SetLimitCommand_1 = __importDefault(require("./commands/SetLimitCommand"));
const HelpCommand_1 = __importDefault(require("./commands/HelpCommand"));
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
        const db = new database_1.default();
        await db.dbPromise;
        // 2. Services
        const tiktok = new TikTokService_1.default();
        const downloader = new DownloaderService_1.default();
        const telegram = new TelegramService_1.default(BOT_TOKEN);
        // 3. System (Workers)
        const system = new System_1.default(db, tiktok, downloader, telegram);
        // 4. Commands & Handlers
        const messageHandler = new MessageHandler_1.default(db);
        const commandsList = [
            new GetIdCommand_1.default(db, ADMIN_ID),
            new AddClientCommand_1.default(db, ADMIN_ID),
            new SetupCommand_1.default(db, ADMIN_ID),
            new ListCommand_1.default(db, ADMIN_ID),
            new DeleteCommand_1.default(db, ADMIN_ID),
            new SetLimitCommand_1.default(db, ADMIN_ID),
            new HelpCommand_1.default(db, ADMIN_ID),
        ];
        // 5. Bot
        const botService = new BotService_1.default(BOT_TOKEN, db, commandsList, messageHandler);
        botService.launch();
        console.log("🤖 Bot de comandos activo");
        system.start();
        console.log("⚙️ Worker activo");
    }
    catch (err) {
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
