import { TelegramBot, TelegramUpdate, TelegramMessage } from './telegram';
import enLocale from '../locales/en.json';
import idLocale from '../locales/id.json';

export interface Env {
    DB: D1Database;
    TELEGRAM_BOT_TOKEN: string;
    ADMIN_TELEGRAM_ID: string;
}

const locales: Record<string, any> = {
    en: enLocale,
    id: idLocale
};

export class BotHandler {
    private bot: TelegramBot;
    private env: Env;

    constructor(bot: TelegramBot, env: Env) {
        this.bot = bot;
        this.env = env;
    }

    async handleUpdate(update: TelegramUpdate): Promise<void> {
        if (update.message) {
            await this.handleMessage(update.message);
        }
    }

    private async getLocale(userId: number): Promise<any> {
        try {
            const stmt = this.env.DB.prepare('SELECT language FROM users WHERE telegram_id = ?').bind(userId);
            const result = await stmt.first<{ language: string }>();
            const lang = result?.language || 'id';
            return locales[lang] || locales['id'];
        } catch (error) {
            console.error('Database Query Error in getLocale:', error);
            return locales['id'];
        }
    }

    private async handleMessage(message: TelegramMessage): Promise<void> {
        const chatId = message.chat.id;
        const text = message.text || '';
        const userId = message.from?.id;

        if (!userId) return;

        try {
            await this.env.DB.prepare(
                'INSERT INTO users (telegram_id, language) VALUES (?, ?) ON CONFLICT(telegram_id) DO NOTHING'
            ).bind(userId, 'id').run();
        } catch (error) {
            console.error('Database Insert Error in handleMessage (User):', error);
        }

        const t = await this.getLocale(userId);
        const isAdmin = userId.toString() === this.env.ADMIN_TELEGRAM_ID;

        if (text.startsWith('/start')) {

            const webAppUrl = 'https://bibleonbot-testing-webapp.pages.dev/';

            const replyMarkup = {
                inline_keyboard: [[
                    { text: t.open_webapp, web_app: { url: webAppUrl } }
                ]]
            };
            await this.bot.sendMessage(chatId, t.welcome, replyMarkup);
            return;
        }

        if (text.startsWith('/lang')) {
            const newLang = text.split(' ')[1];
            if (newLang === 'en' || newLang === 'id') {
                try {
                    await this.env.DB.prepare('UPDATE users SET language = ? WHERE telegram_id = ?').bind(newLang, userId).run();
                    const newT = locales[newLang];
                    await this.bot.sendMessage(chatId, newT.language_changed);
                } catch (error) {
                    console.error('Database Update Error in handleMessage (Language):', error);
                    await this.bot.sendMessage(chatId, t.error_general);
                }
            } else {
                await this.bot.sendMessage(chatId, 'Usage: /lang en | /lang id');
            }
            return;
        }

        if (text.startsWith('/admin')) {
            if (!isAdmin) {
                await this.bot.sendMessage(chatId, t.unauthorized);
                return;
            }

            const replyMarkup = {
                keyboard: [
                    [{ text: t.admin_btn_daily_verse }],
                    [{ text: t.admin_btn_community }, { text: t.admin_btn_channels }],
                    [{ text: t.admin_btn_news }, { text: t.admin_btn_close }]
                ],
                resize_keyboard: true,
                one_time_keyboard: false
            };
            await this.bot.sendMessage(chatId, t.admin_welcome, replyMarkup);
            return;
        }

        if (isAdmin) {
            if (text === t.admin_btn_close) {
                const replyMarkup = { remove_keyboard: true };
                await this.bot.sendMessage(chatId, t.admin_closed, replyMarkup);
                return;
            }

            if (text === t.admin_btn_daily_verse) {
                await this.bot.sendMessage(chatId, t.admin_prompt_verse);
                return;
            }

            if (text.includes('|') && text.split('|').length === 2) {
                const [verseText, verseRef] = text.split('|').map(s => s.trim());
                try {
                    await this.env.DB.prepare(
                        'INSERT INTO daily_verse (verse_text, verse_reference) VALUES (?, ?)'
                    ).bind(verseText, verseRef).run();
                    await this.bot.sendMessage(chatId, t.admin_success);
                } catch (error) {
                    console.error('Database Insert Error in handleMessage (Daily Verse):', error);
                    await this.bot.sendMessage(chatId, t.error_general);
                }
                return;
            }
        }
    }
}