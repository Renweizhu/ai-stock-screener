import React from 'react';
import { TrendingUp, Sparkles, Bookmark, ArrowLeftRight, Search, PieChart, RefreshCw, Radio } from 'lucide-react';

export default function Header({
  searchTerm,
  setSearchTerm,
  activeMarket,
  setActiveMarket,
  watchlistCount,
  onOpenWatchlist,
  compareCount,
  onOpenCompare,
  onOpenPortfolioBuilder,
  onSyncRealtimeData,
  isSyncing,
  lastSyncTime
}) {
  return (
    <header className="glass-panel" style={{ padding: '0.85rem 1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo & Title & Live Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            padding: '0.55rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
          }}>
            <TrendingUp size={24} color="#090d16" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }} className="gradient-text">
                StockMind AI
              </h1>
              <span className="pill-badge pill-emerald">
                <Sparkles size={11} /> 智能對話篩選
              </span>
              
              {/* Real-time API Connection Pill */}
              <span className="pill-badge pill-cyan" style={{ fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Radio size={10} color="#34d399" className="animate-pulse-glow" /> 證交所 API 連線行情 {lastSyncTime && `(${lastSyncTime})`}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              透過 AI 對話交談，秒速解構即時財務條件與配比資產組合
            </p>
          </div>
        </div>

        {/* Center Controls: Market Segment Filter & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Market selector tabs */}
          <div style={{
            background: 'var(--bg-input)',
            padding: '3px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '2px'
          }}>
            {[
              { id: 'ALL', label: '全市場' },
              { id: 'TW', label: '🇹🇼 台股' },
              { id: 'US', label: '🇺🇸 美股' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setActiveMarket(m.id)}
                style={{
                  background: activeMarket === m.id ? 'var(--accent-emerald)' : 'transparent',
                  color: activeMarket === m.id ? '#090d16' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: activeMarket === m.id ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{ position: 'relative', width: '180px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="搜尋代號 / 名稱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.5rem 0.4rem 2rem',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Action Buttons: Live Refresh, Portfolio Builder, Compare & Watchlist */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          
          <button
            onClick={onSyncRealtimeData}
            disabled={isSyncing}
            className="btn-secondary"
            title="從台灣證券交易所與國際市場更新最新行情數據"
            style={{ fontSize: '0.82rem' }}
          >
            <RefreshCw size={14} style={{ animation: isSyncing ? 'spinSlow 1s linear infinite' : 'none' }} />
            {isSyncing ? '更新中...' : '更新即時行情'}
          </button>

          <button
            onClick={onOpenPortfolioBuilder}
            className="btn-secondary"
            style={{
              fontSize: '0.82rem',
              borderColor: 'rgba(16, 185, 129, 0.4)',
              background: 'rgba(16, 185, 129, 0.1)'
            }}
          >
            <PieChart size={15} color="var(--accent-emerald)" />
            💼 AI 組合配置
          </button>

          <button
            onClick={onOpenCompare}
            className="btn-secondary"
            style={{ position: 'relative', fontSize: '0.82rem' }}
          >
            <ArrowLeftRight size={15} color="var(--accent-cyan)" />
            個股對比
            {compareCount > 0 && (
              <span style={{
                background: 'var(--accent-cyan)',
                color: '#090d16',
                borderRadius: '99px',
                padding: '0.1rem 0.45rem',
                fontSize: '0.7rem',
                fontWeight: 800
              }}>
                {compareCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenWatchlist}
            className="btn-primary"
            style={{ position: 'relative', fontSize: '0.82rem' }}
          >
            <Bookmark size={15} />
            自訂觀察名單
            {watchlistCount > 0 && (
              <span style={{
                background: '#fff',
                color: 'var(--accent-emerald)',
                borderRadius: '99px',
                padding: '0.1rem 0.45rem',
                fontSize: '0.7rem',
                fontWeight: 800
              }}>
                {watchlistCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
