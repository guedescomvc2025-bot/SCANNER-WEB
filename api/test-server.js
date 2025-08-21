const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuração do servidor
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Configurar cabeçalhos CORS para desenvolvimento
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
module.exports = server;