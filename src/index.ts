import { TelegramBot, TelegramUpdate } from './telegram';
import { BotHandler, Env } from './handlers';
import { ApiHandler } from './api';

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        // 1. TANGKAP RUTE ALKITAB LEBIH DULU
        if (request.method === 'GET' && url.pathname === '/api/bible') {
            const book = url.searchParams.get('book') || 'Kej';
            const chapter = url.searchParams.get('chapter') || '1';
            
            try {
                const { results } = await env.DB.prepare(
                    "SELECT * FROM bible_verses WHERE book = ? AND chapter = ? ORDER BY verse ASC"
                ).bind(book, chapter).all();

                // Kembalikan sebagai array langsung agar React mudah membacanya
                return new Response(JSON.stringify(results), {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*' // Wajib untuk mengizinkan Web App
                    }
                });
            } catch (error: any) {
                return new Response(JSON.stringify({ error: error.message }), { 
                    status: 500, 
                    headers: { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*' 
                    } 
                });
            }
        }

        // 2. RUTE API LAINNYA (/api/home dll)
        if (url.pathname.startsWith('/api')) {
            const api = new ApiHandler(env);
            return api.handleRequest(request);
        }

        // 3. RUTE WEBHOOK TELEGRAM
        if (request.method === 'POST' && url.pathname === '/webhook') {
            try {
                const update: TelegramUpdate = await request.json();
                const bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN);
                const handler = new BotHandler(bot, env);
                
                ctx.waitUntil(handler.handleUpdate(update));
                
                return new Response('OK', { status: 200 });
            } catch (error) {
                console.error('Webhook Processing Error:', error);
                return new Response('Internal Server Error', { status: 500 });
            }
        }

        if (request.method === 'GET' && url.pathname === '/setWebhook') {
            const bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN);
            const webhookUrl = `${url.origin}/webhook`;
            await bot.setWebhook(webhookUrl);
            return new Response(`Webhook configured successfully to: ${webhookUrl}`, { status: 200 });
        }

        return new Response('BibleonBot Engine is running smoothly.', { status: 200 });
    }
};