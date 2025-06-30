export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, model = 'gpt-3.5-turbo', maxTokens = 50, temperature = 0.8 } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not set in environment' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are a fun party game assistant. Generate creative Truth or Dare questions that are engaging and appropriate for friends.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature
      })
    });

    if (!openaiRes.ok) {
      const error = await openaiRes.text();
      return res.status(openaiRes.status).json({ error });
    }

    const data = await openaiRes.json();
    const result = data.choices[0].message.content.trim();
    return res.status(200).json({ result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
} 