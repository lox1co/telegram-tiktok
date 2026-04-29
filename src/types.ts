import { Context } from "telegraf";

export interface SessionData {
  step: string | null;
  temp: {
    username?: string;
    channel?: string;
  };
}

export interface BotContext extends Context {
  session: SessionData;
}

export interface Client {
  id: number;
  name: string;
  account_limit: number;
}

export interface Account {
  id: number;
  client_id: number;
  username: string;
  channel_id: string;
}

export interface Command {
  name: string;
  execute(ctx: BotContext): Promise<void>;
}
