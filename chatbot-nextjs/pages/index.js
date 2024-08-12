import { useState } from 'react';

export default function Home() {
  const [chatbotTitle, setChatbotTitle] = useState('');
  const [model, setModel] = useState([]);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [maxTokens, setMaxTokens] = useState(2048);
  const [temperature, setTemperature] = useState(0.7);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [messages, setMessages] = useState([]);

  const handleModelChange = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    setModel(value);
  };

  const sendMessage = async (userInput) => {
    if (!userInput) return;

    const newMessages = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);

    setConversationHistory([
      ...conversationHistory,
      { role: 'user', content: userInput }
    ]);

    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        systemPrompt,
        userPrompt,
        maxTokens,
        temperature,
        conversationHistory: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
          ...newMessages,
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error: No se pudo obtener una respuesta del chatbot.' }]);
    } else {
      setMessages([...newMessages, { role: 'assistant', content: data.message }]);
      setConversationHistory([...conversationHistory, { role: 'assistant', content: data.message }]);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f8ff', padding: '20px', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', maxWidth: '800px', margin: '0 auto', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#4a4a4a', textAlign: 'center', marginBottom: '30px' }}>Generador de Chatbots con Together AI</h1>
        <label>Título del Chatbot:</label>
        <input type="text" value={chatbotTitle} onChange={(e) => setChatbotTitle(e.target.value)} required />

        <label>Modelo de Lenguaje para Chat:</label>
        <select multiple size="10" value={model} onChange={handleModelChange}>
          <option value="togethercomputer/llama-2-70b-chat">Llama-2-70B-Chat</option>
          <option value="togethercomputer/llama-2-13b-chat">Llama-2-13B-Chat</option>
          <option value="togethercomputer/llama-2-7b-chat">Llama-2-7B-Chat</option>
          <option value="mistralai/Mixtral-8x7B-Instruct-v0.1">Mixtral-8x7B-Instruct</option>
          <option value="meta-llama/Llama-2-70b-chat-hf">Meta Llama-2-70B-Chat</option>
          <option value="openchat/openchat-3.5-0106">OpenChat 3.5</option>
          <option value="01-ai/Yi-34B-Chat">Yi-34B-Chat</option>
          <option value="NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO">Nous-Hermes-2-Mixtral-8x7B-DPO</option>
          <option value="upstage/SOLAR-0-70b-16bit">SOLAR-0-70b</option>
          <option value="Qwen/Qwen1.5-72B-Chat">Qwen1.5-72B-Chat</option>
          <option value="HuggingFaceH4/zephyr-7b-beta">Zephyr-7B-Beta</option>
          <option value="teknium/OpenHermes-2p5-Mistral-7B">OpenHermes-2p5-Mistral-7B</option>
          <option value="EleutherAI/llemma_34b">LLeMMA-34B</option>
          <option value="mosaicml/mpt-30b-chat">MPT-30B-Chat</option>
          <option value="WizardLM/WizardLM-70B-V1.0">WizardLM-70B-V1.0</option>
        </select>

        <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
          <div style={{ flex: 1 }}>
            <label>System Prompt:</label>
            <textarea rows="4" value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} required></textarea>
          </div>
          <div style={{ flex: 1 }}>
            <label>User Prompt:</label>
            <textarea rows="4" value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} required></textarea>
          </div>
        </div>

        <label>Número máximo de tokens:</label>
        <input type="number" value={maxTokens} onChange={(e) => setMaxTokens(e.target.value)} min="1" max="4096" required />

        <label>Temperatura:</label>
        <input type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} min="0" max="1" step="0.1" required />

        <button onClick={() => sendMessage(document.getElementById('user-input').value)} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '25px', width: '100%', fontSize: '16px' }}>
          Enviar
        </button>

        <div id="chat-messages" style={{ marginTop: '30px', backgroundColor: '#f8f8f8', border: '1px solid #ddd', borderRadius: '5px', padding: '15px', maxHeight: '300px', overflowY: 'auto', fontFamily: 'Courier New, Courier, monospace', fontSize: '14px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: '10px', padding: '5px 10px', borderRadius: '5px', backgroundColor: msg.role === 'user' ? '#e6f3ff' : '#f0f0f0', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
              <strong>{msg.role === 'user' ? 'Usuario:' : 'Asistente:'}</strong> {msg.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
