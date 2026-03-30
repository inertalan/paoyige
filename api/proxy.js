export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, anthropic-version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const target = req.query.target;
  let apiUrl, headers;

  if (target === 'claude') {
    apiUrl = 'https://api.anthropic.com/v1/messages';
    headers = {
      'Content-Type': 'application/json',
      'x-api-key': req.headers['x-api-key'],
      'anthropic-version': '2023-06-01',
    };
  } else {
    apiUrl = 'https://api.moonshot.cn/v1/chat/completions';
    headers = {
      'Content-Type': 'application/json',
      'Authorization': req.headers['authorization'],
    };
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
