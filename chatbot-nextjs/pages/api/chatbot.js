export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { model, systemPrompt, userPrompt, maxTokens, temperature, conversationHistory } = req.body;

  const apiKey = process.env.TOGETHER_API_KEY;

  try {
    const randomModel = model[Math.floor(Math.random() * model.length)];
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: randomModel,
        messages: conversationHistory,
        max_tokens: maxTokens,
        temperature: temperature,
      }),
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta de la API');
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content.trim();

    res.status(200).json({ message: botResponse });
  } catch (error) {
    console.error('Error:', error
