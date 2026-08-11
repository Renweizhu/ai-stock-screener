import React, { useState } from 'react';
import { X, Sparkles, TrendingUp, ShieldCheck, AlertTriangle, Bookmark, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function StockDetailModal({
  stock,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  isCompared,
  onToggleCompare
}) {
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'radar' | 'ai'

  if (!stock) return null;

  // Radar metrics normalization (scale 0-100)
  const radarData = [
    { subject: '股利殖利率', value: Math.min(100, (stock.yield / 7) * 100), fullMark: 100 },
    { subject: '本益比優越度', value: Math.min(100, Math.max(10, (1 - stock.pe / 45) * 100)), fullMark: 100 },
    { subject: '獲利能力 (ROE)', value: Math.min(100, (stock.roe / 35) * 100), fullMark: 100 },
    { subject: '營收爆發力', value: Math.min(100, (Math.max(0, stock.revenueGrowth) / 50) * 100), fullMark: 100 },
    { subject: '抗跌防禦力', value: Math.min(100, Math.max(10, (1.8 - stock.beta) * 60)), fullMark: 100 }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 16, 0.82)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '840px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
      }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: 'var(--text-secondary)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              {stock.ticker}
            </span>
            <span className={`pill-badge ${stock.market === 'TW' ? 'pill-emerald' : 'pill-cyan'}`}>
              {stock.market === 'TW' ? '🇹🇼 台股上市' : '🇺🇸 美股上市'}
            </span>
            <span className="pill-badge pill-purple">{stock.sector}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
                {stock.name}
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {stock.summary}
              </p>
            </div>

            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
                {stock.currency === 'USD' ? '$' : 'NT$'}{stock.price.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: stock.changePercent >= 0 ? '#34d399' : '#f87171' }}>
                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}% (24H)
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Price Chart / Radar Analysis / AI Insight */}
        <div style={{ display: 'flex', gap: '1rem', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.4)' }}>
          {[
            { id: 'chart', label: '📈 近半年走勢圖' },
            { id: 'radar', label: '🕸 五維能力雷達' },
            { id: 'ai', label: '🤖 AI 深度點評' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent-emerald)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                padding: '0.4rem 0.2rem',
                fontSize: '0.85rem',
                fontWeight: activeTab === tab.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div style={{ padding: '1.5rem' }}>
          
          {/* Chart Tab */}
          {activeTab === 'chart' && (
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>歷史價格走勢 (單位: {stock.currency})</h4>
              <div style={{ width: '100%', height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stock.historyData}>
                    <defs>
                      <linearGradient id="priceColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                      formatter={(val) => [`${stock.currency === 'USD' ? '$' : 'NT$'}${val}`, '價格']}
                    />
                    <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#priceColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Radar Tab */}
          {activeTab === 'radar' && (
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textAlign: 'center' }}>個股基本面綜合評分雷達</h4>
              <div style={{ width: '100%', height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" fontSize={10} />
                    <Radar name={stock.name} dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* AI Insight Tab */}
          {activeTab === 'ai' && (
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent-emerald)' }}>
                <Sparkles size={18} />
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>AI 智能觀點與策略結論</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                {stock.aiCommentary}
              </p>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.75rem',
            margin: '1.5rem 0'
          }}>
            <div className="glass-panel" style={{ padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>殖利率 (Yield)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{stock.yield}%</div>
            </div>
            <div className="glass-panel" style={{ padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>本益比 (P/E)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{stock.pe} 倍</div>
            </div>
            <div className="glass-panel" style={{ padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>資產報酬 (ROE)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{stock.roe}%</div>
            </div>
            <div className="glass-panel" style={{ padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>營收年增 (YoY)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{stock.revenueGrowth}%</div>
            </div>
            <div className="glass-panel" style={{ padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>波動度 (Beta)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: stock.beta <= 1 ? '#34d399' : '#fb7185' }}>{stock.beta}</div>
            </div>
          </div>

          {/* Strengths vs Risks */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={15} /> 投資護城河與優勢
              </div>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {stock.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fb7185', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertTriangle size={15} /> 潛在風險與留意事項
              </div>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {stock.risks.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-panel)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onToggleWatchlist(stock)}
              className="btn-secondary"
              style={{ fontSize: '0.82rem' }}
            >
              <Bookmark size={15} fill={isWatchlisted ? 'var(--accent-gold)' : 'none'} color={isWatchlisted ? 'var(--accent-gold)' : 'currentColor'} />
              {isWatchlisted ? '已加入觀察' : '加入觀察名單'}
            </button>
            <button
              onClick={() => onToggleCompare(stock)}
              className="btn-secondary"
              style={{ fontSize: '0.82rem' }}
            >
              <ArrowLeftRight size={15} color={isCompared ? 'var(--accent-cyan)' : 'currentColor'} />
              {isCompared ? '已加入對比' : '加入個股對比'}
            </button>
          </div>

          <button onClick={onClose} className="btn-primary">
            關閉視窗
          </button>
        </div>

      </div>
    </div>
  );
}
