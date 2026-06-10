'use client';

import { useState } from 'react';

export default function ChatbotPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: { role: 'user' | 'bot'; content: string } = { role: 'user', content: input };
setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          userId: 'user-123',
        }),
      });

      const data = await response.json();
      const botMessage: { role: 'user' | 'bot'; content: string } = { role: 'bot', content: data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'Error procesando tu pregunta. Intenta de nuevo.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>💬 Consultor Contable GeoTax</h1>

      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        height: '400px',
        overflowY: 'auto',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#f9f9f9'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            marginBottom: '12px',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f1f8e9',
            textAlign: msg.role === 'user' ? 'right' : 'left'
          }}>
            <strong>{msg.role === 'user' ? 'Tú' : 'Bot'}:</strong> {msg.content}
          </div>
        ))}
        {loading && <p style={{ fontStyle: 'italic', color: '#999' }}>Bot escribiendo...</p>}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Escribe tu pregunta contable..."
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading}
          style={{
            padding: '12px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Esperando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}
