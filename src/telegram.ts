export interface TelegramUpdate {
    update_id: number;
    message?: TelegramMessage;
    callback_query?: TelegramCallbackQuery;
}

export interface TelegramMessage {
    message_id: number;
    from?: TelegramUser;
    chat: TelegramChat;
    text?: string;
    date: number;
}

export interface TelegramUser {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
}

export interface TelegramChat {
    id: number;
    type: string;
}

export interface TelegramCallbackQuery {
    id: string;
    from: TelegramUser;
    message?: TelegramMessage;
    data?: string;
}

export class TelegramBot {
    private token: string;
    private apiUrl: string;

    constructor(token: string) {
        this.token = token;
        this.apiUrl = `https://api.telegram.org/bot${this.token}`;
    }

    async sendMessage(chatId: number, text: string, replyMarkup?: any): Promise<void> {
        const url = `${this.apiUrl}/sendMessage`;
        const payload: any = {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
        };

        if (replyMarkup) {
            payload.reply_markup = replyMarkup;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Telegram API sendMessage Error:', errorData);
            }
        } catch (error) {
            console.error('Fetch Exception in sendMessage:', error);
        }
    }

    async setWebhook(webhookUrl: string): Promise<void> {
        const url = `${this.apiUrl}/setWebhook`;
        const payload = { url: webhookUrl };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Telegram API setWebhook Error:', errorData);
            }
        } catch (error) {
            console.error('Fetch Exception in setWebhook:', error);
        }
    }
}