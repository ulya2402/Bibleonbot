export class ApiHandler {
    env: any;
    constructor(env: any) { this.env = env; }

    async handleRequest(request: Request): Promise<Response> {
        const url = new URL(request.url);
        
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        };

        if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

        // 1. GET HOME DATA
        if (request.method === 'GET' && url.pathname === '/api/home') {
            try {
                const dailyVerse = await this.env.DB.prepare("SELECT * FROM daily_verse WHERE id = 1").first();
                const news = await this.env.DB.prepare("SELECT * FROM news ORDER BY id DESC LIMIT 50").all();
                const communities = await this.env.DB.prepare("SELECT * FROM communities WHERE is_channel = 0 ORDER BY id DESC LIMIT 50").all();
                const channels = await this.env.DB.prepare("SELECT * FROM communities WHERE is_channel = 1 ORDER BY id DESC LIMIT 50").all();

                return new Response(JSON.stringify({
                    dailyVerse: { verse_reference: dailyVerse?.reference || 'Yohanes 3:16', verse_text: dailyVerse?.text || 'Ayat belum diatur.' },
                    news: news.results || [], communities: communities.results || [], channels: channels.results || []
                }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
            } catch (error: any) { return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders }); }
        }

        // 2. SIMPAN AYAT HARI INI
        if (request.method === 'POST' && url.pathname === '/api/admin/daily-verse') {
            try {
                const body: any = await request.json();
                await this.env.DB.prepare("UPDATE daily_verse SET reference = ?, text = ? WHERE id = 1").bind(body.reference, body.text).run();
                return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
            } catch (error: any) { return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders }); }
        }

        // ==========================================
        // ROUTE BERITA (POST, PUT, DELETE)
        // ==========================================
        if (url.pathname === '/api/admin/news') {
            try {
                if (request.method === 'POST') {
                    const body: any = await request.json();
                    await this.env.DB.prepare("INSERT INTO news (title, category, image_url, link) VALUES (?, ?, ?, ?)").bind(body.title, body.category, body.image_url, body.link).run();
                    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
                }
                if (request.method === 'PUT') {
                    const body: any = await request.json();
                    await this.env.DB.prepare("UPDATE news SET title=?, category=?, image_url=?, link=? WHERE id=?").bind(body.title, body.category, body.image_url, body.link, body.id).run();
                    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
                }
                if (request.method === 'DELETE') {
                    const id = url.searchParams.get('id');
                    await this.env.DB.prepare("DELETE FROM news WHERE id=?").bind(id).run();
                    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
                }
            } catch (error: any) { return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders }); }
        }

        // ==========================================
        // ROUTE KOMUNITAS/CHANNEL (POST, PUT, DELETE)
        // ==========================================
        if (url.pathname === '/api/admin/community') {
            try {
                if (request.method === 'POST') {
                    const body: any = await request.json();
                    await this.env.DB.prepare("INSERT INTO communities (name, member_count, category, link, is_channel) VALUES (?, ?, ?, ?, ?)").bind(body.name, body.member_count, body.category, body.link, body.is_channel).run();
                    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
                }
                if (request.method === 'PUT') {
                    const body: any = await request.json();
                    await this.env.DB.prepare("UPDATE communities SET name=?, member_count=?, category=?, link=?, is_channel=? WHERE id=?").bind(body.name, body.member_count, body.category, body.link, body.is_channel, body.id).run();
                    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
                }
                if (request.method === 'DELETE') {
                    const id = url.searchParams.get('id');
                    await this.env.DB.prepare("DELETE FROM communities WHERE id=?").bind(id).run();
                    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
                }
            } catch (error: any) { return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders }); }
        }

        // ==========================================
        // ROUTE AYAT TERSIMPAN (GET, POST, DELETE)
        // ==========================================
        if (url.pathname === '/api/saved-verses') {
            try {
                if (request.method === 'GET') {
                    const userId = url.searchParams.get('userId');
                    const saved = await this.env.DB.prepare("SELECT * FROM saved_verses WHERE user_id = ? ORDER BY created_at DESC").bind(userId).all();
                    return new Response(JSON.stringify(saved.results || []), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
                }
                if (request.method === 'POST') {
                    const body: any = await request.json();
                    
                    // Cek apakah ayat ini sudah pernah disimpan sebelumnya
                    const existing = await this.env.DB.prepare("SELECT id FROM saved_verses WHERE user_id = ? AND book = ? AND chapter = ? AND verse = ?")
                        .bind(body.user_id, body.book, body.chapter, body.verse).first();

                    if (existing) {
                        // Jika sudah ada, cukup update warnanya
                        await this.env.DB.prepare("UPDATE saved_verses SET color = ?, content = ? WHERE id = ?")
                            .bind(body.color, body.content, existing.id).run();
                    } else {
                        // Jika belum ada, simpan sebagai ayat baru
                        await this.env.DB.prepare("INSERT INTO saved_verses (user_id, book, chapter, verse, content, color) VALUES (?, ?, ?, ?, ?, ?)")
                            .bind(body.user_id, body.book, body.chapter, body.verse, body.content, body.color).run();
                    }
                    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
                }
                if (request.method === 'DELETE') {
                    const id = url.searchParams.get('id');
                    await this.env.DB.prepare("DELETE FROM saved_verses WHERE id = ?").bind(id).run();
                    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
                }
            } catch (error: any) { return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders }); }
        }

        return new Response('Not Found', { status: 404, headers: corsHeaders });
    }
}