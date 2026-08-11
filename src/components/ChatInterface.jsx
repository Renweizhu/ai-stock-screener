import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Filter, RefreshCw, Zap, Lightbulb } from 'lucide-react';
import { strategyPresets } from '../data/stocksData';

export default function ChatInterface({ onAIScreen, activeParsedTags, isProcessing }) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: '你好！我是你的 AI 投資特助。請用自然對話告訴我你想找什麼樣的股票？例如：\n• 「幫我找殖利率大於 5%、本益比便宜的科技股」\n• 「適合退休族的穩健高股息低波動股票」\n• 「營收年增率超過 20% 的台股 AI 飆股」',
      timestamp: '剛剛'
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || isProcessing) return;

    // Add user message
    const userMsg = {
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Trigger AI screening logic
    onAIScreen(text, (aiResult) => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiResult.reply,
          recommendedStocks: aiResult.recommendedStocks,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    });
  };

  const handleKeyPress = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '560px' }}>
      
      {/* Header */}
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(13, 19, 34, 0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '0.4rem',
            borderRadius: '8px',
            color: 'var(--accent-emerald)'
          }}>
            <Bot size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>AI 對話交談選股</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>智慧提取條件 & 即時過濾標的</p>
          </div>
        </div>

        <span className="pill-badge pill-cyan" style={{ fontSize: '0.7rem' }}>
          <Zap size={10} /> NLP 解析中
        </span>
      </div>

      {/* Preset Quick Strategy Pills */}
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.4)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Lightbulb size={12} color="var(--accent-gold)" /> 熱門投資策略速選：
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
          {strategyPresets.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleSend(preset.prompt)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '99px',
                padding: '0.25rem 0.65rem',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-emerald)';
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              <span>{preset.icon}</span>
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Extracted Constraints Box */}
      {activeParsedTags && activeParsedTags.length > 0 && (
        <div style={{
          padding: '0.6rem 1rem',
          background: 'rgba(6, 182, 212, 0.08)',
          borderBottom: '1px solid rgba(6, 182, 212, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Filter size={11} /> AI 已套用條件：
          </span>
          {activeParsedTags.map((tag, idx) => (
            <span key={idx} className="pill-badge pill-cyan" style={{ fontSize: '0.7rem' }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Message Stream */}
      <div style={{
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              animation: 'fadeIn 0.25s ease-out'
            }}
          >
            <div style={{
              maxWidth: '85%',
              padding: '0.8rem 1rem',
              borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
              background: msg.sender === 'user' 
                ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' 
                : 'rgba(21, 29, 48, 0.9)',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
              boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
            }}>
              {msg.text}

              {/* Recommended stocks pills inside AI response */}
              {msg.recommendedStocks && msg.recommendedStocks.length > 0 && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>🎯 符合最佳標的：</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {msg.recommendedStocks.map(stk => (
                      <span key={stk.ticker} className="pill-badge pill-emerald">
                        {stk.name} ({stk.ticker}) • {stk.matchScore}% 匹配
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem', padding: '0 0.3rem' }}>
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isProcessing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', fontSize: '0.8rem', padding: '0.5rem' }}>
            <RefreshCw size={14} className="spinSlow" style={{ animation: 'spinSlow 1.5s linear infinite' }} />
            <span>AI 正在檢索全球標的與比對財務指標...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-panel)' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="請輸入您的選股訴求（如：殖利率 > 5%、低本益比...）"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isProcessing}
            style={{
              flex: 1,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem 0.85rem',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={isProcessing || !inputText.trim()}
            className="btn-primary"
            style={{ padding: '0.65rem 1rem' }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>

    </div>
  );
}
