// Al Brooks 价格行为测验 —— 本地服务器 + AI 批改代理
// 用法: node server.js  然后浏览器打开 http://localhost:8137
// 静态托管 index.html;并提供 /api/proxy 转发到你自己的 AI 服务商(避开浏览器 CORS,
// 支持任意 OpenAI 兼容接口:DeepSeek / Kimi / 通义 / GLM / OpenAI / 本地 Ollama,以及 Claude 原生)。
// 密钥由浏览器逐次传给本机代理再转发到服务商,不写入磁盘、不发往任何第三方。
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = +(process.env.PORT || process.argv[2] || 8137);
const ROOT = __dirname;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

function send(res, code, body, type) {
  res.writeHead(code, { 'Content-Type': type || 'application/json; charset=utf-8' });
  res.end(body);
}

async function proxy(req, res) {
  let raw = '', tooBig = false;
  req.on('data', c => { if (tooBig) return; raw += c; if (raw.length > 1e6) { tooBig = true; send(res, 413, JSON.stringify({ error: 'request too large' })); req.destroy(); } });
  req.on('end', async () => {
    if (tooBig) return;
    let cfg;
    try { cfg = JSON.parse(raw); } catch (e) { return send(res, 400, JSON.stringify({ error: 'bad json' })); }
    const { kind, base, key, model, system, user } = cfg;
    if (!base || !key || !model) return send(res, 400, JSON.stringify({ error: 'missing base/key/model' }));
    try {
      let url, headers, payload;
      if (kind === 'anthropic') {
        url = String(base).replace(/\/$/, '') + '/v1/messages';
        headers = { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' };
        payload = { model, max_tokens: 1024, system, messages: [{ role: 'user', content: user }] };
      } else {
        url = String(base).replace(/\/$/, '') + '/chat/completions';
        headers = { 'content-type': 'application/json', authorization: 'Bearer ' + key };
        payload = { model, max_tokens: 1024, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] };
      }
      const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) });
      const body = await r.text();
      let j = null; try { j = JSON.parse(body); } catch (e) {}
      if (!r.ok) return send(res, r.status, JSON.stringify({ error: (j && j.error && (j.error.message || j.error)) || (j && j.message) || ('HTTP ' + r.status + ' ' + body.slice(0, 200)) }));
      if (!j) return send(res, 502, JSON.stringify({ error: 'non-JSON response: ' + body.slice(0, 200) }));
      const text = kind === 'anthropic'
        ? (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('')
        : (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
      send(res, 200, JSON.stringify({ text }));
    } catch (e) {
      send(res, 502, JSON.stringify({ error: String(e && e.message || e) }));
    }
  });
}

http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/api/health') return send(res, 200, JSON.stringify({ ok: true }));
  if (url === '/api/proxy' && req.method === 'POST') return proxy(req, res);
  let p = decodeURIComponent(url);
  if (p === '/') p = '/index.html';
  const fp = path.join(ROOT, path.normalize(p));
  if (fp !== ROOT && !fp.startsWith(ROOT + path.sep)) return send(res, 403, 'forbidden', 'text/plain');
  fs.readFile(fp, (e, b) => {
    if (e) return send(res, 404, 'not found', 'text/plain');
    send(res, 200, b, TYPES[path.extname(fp)] || 'application/octet-stream');
  });
}).listen(PORT, '127.0.0.1', () => console.log('Brooks 测验运行中 →  http://localhost:' + PORT));
