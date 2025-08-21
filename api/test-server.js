const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuração do servidor
const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  // Configurar cabeçalhos CORS para desenvolvimento
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Se for uma requisição OPTIONS (preflight), respondemos com sucesso
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Roteamento básico
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(path.join(__dirname, '..', 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro ao carregar o arquivo index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  } else if (req.url.startsWith('/api/proxy')) {
    // Parse the URL
    const parsedUrl = url.parse(req.url, true);
    const { host, username, password } = parsedUrl.query;

    if (!host || !username || !password) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Parâmetros ausentes' }));
      return;
    }

    // Construir a URL do painel
    const targetUrl = `http://${host}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    try {
      // Fazer a requisição para o painel IPTV
      const response = await fetch(targetUrl);
      const data = await response.json();

      // Retornar os dados para o frontend
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro ao fazer requisição' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Página não encontrada');
  }
});

// Iniciar servidor
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Pressione Ctrl+C para encerrar o servidor');
  });
}

// Exportar como função serverless para Vercel
module.exports = (req, res) => {
  // Vercel serverless function
  server.emit('request', req, res);
};
