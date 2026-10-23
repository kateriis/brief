/* =========================================================
   Cloudflare Worker — приймач брифів.
   Отримує відповіді з сайту і пересилає їх у Telegram
   повідомленнями (не файлом).

   Змінні середовища (Worker → Settings → Variables and Secrets):
     BOT_TOKEN        — токен бота від @BotFather (тип Secret)
     CHAT_ID          — id чату, куди надсилати брифи
     ALLOWED_ORIGINS  — необов'язково: адреси сайту через кому,
                        наприклад https://login.github.io
                        Якщо не задано — приймаються запити з будь-якого сайту.

   Два види запитів (обидва POST на ту саму адресу):
     application/json     — текст брифу
     multipart/form-data  — один файл (поля briefId, name, file)
   ========================================================= */

const TG_LIMIT = 4096;               // ліміт Telegram на одне повідомлення
const PIECE_LIMIT = 3000;            // максимальний шматок відповіді до екранування
const MAX_JSON = 300000;             // захист від надто великих запитів
const MAX_FILE = 18 * 1024 * 1024;   // як на сайті
const PAUSE_MS = 350;                // пауза між повідомленнями, щоб не впертися в ліміти Telegram

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ ok: false, error: 'Метод не підтримується' }, 405, cors);
    if (!isAllowed(origin, env)) return json({ ok: false, error: 'Сайт не дозволений' }, 403, cors);
    if (!env.BOT_TOKEN || !env.CHAT_ID) return json({ ok: false, error: 'Не задано BOT_TOKEN або CHAT_ID' }, 500, cors);

    try {
      const type = request.headers.get('Content-Type') || '';
      if (type.includes('multipart/form-data')) return await handleFile(request, env, cors);
      return await handleBrief(request, env, cors);
    } catch (err) {
      return json({ ok: false, error: String((err && err.message) || err) }, 500, cors);
    }
  }
};

/* ---------- Текст брифу ---------- */
async function handleBrief(request, env, cors) {
  const raw = await request.text();
  if (raw.length > MAX_JSON) return json({ ok: false, error: 'Завеликий запит' }, 413, cors);
  const data = JSON.parse(raw);

  const messages = [summaryMessage(data)];
  for (const stage of Array.isArray(data.stages) ? data.stages : []) {
    messages.push(...stageMessages(stage));
  }

  let sent = 0;
  for (const html of messages) {
    const ok = await sendMessage(env, html);
    if (!ok) return json({ ok: false, error: 'Telegram не прийняв повідомлення', sent }, 502, cors);
    sent++;
    await sleep(PAUSE_MS);
  }
  return json({ ok: true, sent }, 200, cors);
}

// Перше повідомлення — коротке зведення
function summaryMessage(data) {
  const lines = [`<b>Новий бриф #${esc(clip(data.id, 20))}</b>`];
  for (const row of Array.isArray(data.summary) ? data.summary : []) {
    const value = clip(row.value, 500);
    if (!value.trim()) continue;
    lines.push(`<b>${esc(clip(row.label, 60))}:</b> ${esc(value)}`);
  }
  if (data.createdAt) {
    const d = new Date(data.createdAt);
    if (!isNaN(d)) lines.push('', `<i>${esc(d.toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' }))}</i>`);
  }
  let text = lines.join('\n');
  if (text.length > TG_LIMIT) text = text.slice(0, TG_LIMIT - 1);   // на практиці не трапляється: рядки обрізано вище
  return text;
}

// Кожен етап — окреме повідомлення (або кілька, якщо відповіді довгі)
function stageMessages(stage) {
  const header = `<b>${esc(clip(stage.num, 4))} · ${esc(clip(stage.title, 80)).toUpperCase()}</b>`;
  const blocks = [];
  for (const item of Array.isArray(stage.items) ? stage.items : []) {
    const value = String(item.value == null ? '' : item.value).trim();
    if (!value) continue;                       // незаповнені питання не показуємо
    const pieces = safePieces(value);
    blocks.push(`<b>${esc(clip(item.label, 300))}</b>\n${pieces[0]}`);
    for (const p of pieces.slice(1)) blocks.push(p);
  }
  if (!blocks.length) return [];
  return pack(header, blocks);
}

// Ріжемо відповідь на шматки і екрануємо кожен окремо, щоб не розірвати HTML-сутність
function safePieces(text) {
  const out = [];
  for (const piece of splitText(text, PIECE_LIMIT)) {
    const html = esc(piece);
    if (html.length <= TG_LIMIT - 400) out.push(html);
    else splitText(piece, 700).forEach(p => out.push(esc(p)));
  }
  return out;
}

// Складаємо блоки в повідомлення, не перевищуючи ліміт
function pack(header, blocks) {
  const messages = [];
  let current = header;
  for (const block of blocks) {
    const candidate = current + '\n\n' + block;
    if (candidate.length <= TG_LIMIT) { current = candidate; continue; }
    messages.push(current);
    current = header + ' <i>(продовження)</i>\n\n' + block;
  }
  messages.push(current);
  return messages;
}

// Ділимо текст: спершу за абзацами, потім за рядками, реченнями, словами
const SEPARATORS = [
  { re: /\n\s*\n/, join: '\n\n' },
  { re: /\n/, join: '\n' },
  { re: /(?<=[.!?…])\s+/, join: ' ' },
  { re: /\s+/, join: ' ' }
];
function splitText(text, max, level = 0) {
  if (text.length <= max) return [text];
  if (level >= SEPARATORS.length) {
    // одне «слово» довше за ліміт (наприклад, дуже довге посилання) — ріжемо жорстко
    const out = [];
    for (let i = 0; i < text.length; i += max) out.push(text.slice(i, i + max));
    return out;
  }
  const { re, join } = SEPARATORS[level];
  const parts = text.split(re).filter(p => p !== '');
  const out = [];
  let buf = '';
  for (const part of parts) {
    if (part.length > max) {
      if (buf) { out.push(buf); buf = ''; }
      out.push(...splitText(part, max, level + 1));
      continue;
    }
    const next = buf ? buf + join + part : part;
    if (next.length > max) { out.push(buf); buf = part; } else buf = next;
  }
  if (buf) out.push(buf);
  return out;
}

/* ---------- Файли ---------- */
async function handleFile(request, env, cors) {
  const form = await request.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') return json({ ok: false, error: 'Немає файлу' }, 400, cors);
  if (file.size > MAX_FILE) return json({ ok: false, error: 'Файл більший за 18 МБ' }, 413, cors);

  const id = clip(form.get('briefId'), 20);
  const name = clip(form.get('name'), 80);
  const fd = new FormData();
  fd.append('chat_id', env.CHAT_ID);
  fd.append('document', file, file.name || 'file');
  fd.append('caption', `Файл до брифу #${id}${name ? ' · ' + name : ''}`);

  const res = await callTelegram(env, 'sendDocument', fd, true);
  if (!res.ok) return json({ ok: false, error: res.description || 'Telegram не прийняв файл' }, 502, cors);
  return json({ ok: true }, 200, cors);
}

/* ---------- Telegram ---------- */
async function sendMessage(env, html) {
  let res = await callTelegram(env, 'sendMessage', {
    chat_id: env.CHAT_ID, text: html, parse_mode: 'HTML', disable_web_page_preview: true
  });
  // якщо розмітка не пройшла — надсилаємо те саме простим текстом, щоб нічого не загубити
  if (!res.ok && res.error_code === 400) {
    res = await callTelegram(env, 'sendMessage', {
      chat_id: env.CHAT_ID, text: stripHtml(html).slice(0, TG_LIMIT), disable_web_page_preview: true
    });
  }
  return !!res.ok;
}

async function callTelegram(env, method, body, isForm = false) {
  const url = `https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, isForm
      ? { method: 'POST', body }
      : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({ ok: false }));
    if (data.ok) return data;
    // забагато запитів — чекаємо стільки, скільки просить Telegram
    if (data.error_code === 429) {
      const wait = ((data.parameters && data.parameters.retry_after) || 2) + 1;
      await sleep(wait * 1000);
      continue;
    }
    if (res.status >= 500) { await sleep(1000 * (attempt + 1)); continue; }
    return data;
  }
  return { ok: false };
}

/* ---------- Допоміжне ---------- */
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}
function clip(s, n) {
  const str = String(s == null ? '' : s);
  return str.length > n ? str.slice(0, n) + '…' : str;
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function allowedList(env) {
  return String(env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim().replace(/\/$/, '')).filter(Boolean);
}
function isAllowed(origin, env) {
  const list = allowedList(env);
  return !list.length || list.includes(origin);
}
function corsHeaders(origin, env) {
  const list = allowedList(env);
  return {
    'Access-Control-Allow-Origin': list.length ? (list.includes(origin) ? origin : list[0]) : '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}
function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status, headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, headers)
  });
}
