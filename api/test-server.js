// api/test-server.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL não fornecida' });
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao acessar o servidor' });
    }

    const json = await response.json();
    
    if (json.user_info && json.user_info.status === 'Active') {
      const ts = parseInt(json.user_info.exp_date);
      let expDate = 'Data não disponível';
      
      if (!isNaN(ts)) {
        const dt = new Date(ts * 1000);
        expDate = dt.toISOString().slice(0, 19).replace('T', ' ');
      }
      
      return res.status(200).json({ expDate });
    } else {
      return res.status(200).json({ expDate: false });
    }
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
