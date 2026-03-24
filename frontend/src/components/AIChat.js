import React, { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
  "What's the best course for beginners?",
  "Help me understand async/await",
  "What should I learn after JavaScript?",
  "Explain React hooks with examples",
];

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function formatMessage(text) {
  return text
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
      `<pre class="code-block"><code>${escHtml(code.trim())}</code></pre>`)
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`chat-message ${isUser?'user':'assistant'}`}>
      <div className="chat-avatar">{isUser?'👤':'🤖'}</div>
      <div className="chat-bubble">
        <div className="chat-text" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
        <div className="chat-time">{new Date(msg.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
      </div>
    </div>
  );
}

export default function AIChat({ open, onClose, courseContext, API }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: courseContext
        ? `Hi! I'm your AI tutor for **${courseContext.title}**. Ask me anything about the course! 🎓`
        : "Hi! I'm your AI learning assistant. I can help you find courses, explain concepts, and guide your learning journey! 🚀",
      ts: Date.now(),
    }]);
  }, [courseContext]);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

  const send = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput('');
    const newMessages = [...messages, { role:'user', content:userMsg, ts:Date.now() }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch(`${API}/chat`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role:m.role, content:m.content })),
          courseContext: courseContext || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setMessages(prev => [...prev, { role:'assistant', content:data.reply, ts:Date.now() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role:'assistant', content:`⚠️ ${err.message}`, ts:Date.now() }]);
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="chat-overlay">
      <div className="chat-panel">
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-header-icon">🤖</div>
            <div>
              <div className="chat-header-title">AI Learning Assistant</div>
              <div className="chat-header-sub">{courseContext ? `📚 ${courseContext.title}` : '✨ Powered by Groq AI'}</div>
            </div>
          </div>
          <button className="chat-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="chat-messages">
          {messages.map((msg,i) => <Message key={i} msg={msg} />)}
          {loading && (
            <div className="chat-message assistant">
              <div className="chat-avatar">🤖</div>
              <div className="chat-bubble typing"><span/><span/><span/></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        {messages.length <= 1 && (
          <div className="chat-suggestions">
            {SUGGESTIONS.map(s => (
              <button key={s} className="suggestion-chip" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}
        <div className="chat-input-area">
          <input
            ref={inputRef} className="chat-input"
            placeholder="Ask anything about your courses..."
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key==='Enter' && !e.shiftKey && send()}
            disabled={loading}
          />
          <button className="chat-send-btn" onClick={() => send()} disabled={!input.trim()||loading}>
            {loading?'⏳':'➤'}
          </button>
        </div>
      </div>
    </div>
  );
}
