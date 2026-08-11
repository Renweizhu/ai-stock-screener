import React from 'react';
import { Bookmark, ArrowLeftRight, ChevronRight, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';

export default function StockCard({
  stock,
  onSelect,
  isWatchlisted,
  onToggleWatchlist,
  isCompared,
  onToggleCompare
}) {
  const isPositive = stock.changePercent >= 0;

  // Match score color gradient
  const getScoreColor = (score) => {
    if (score >= 85) return 'var(--accent-emerald)';
    if (score >= 70) return 'var(--accent-cyan)';
    if (score >= 50) return 'var(--accent-gold)';
    return 'var(--text-muted)';
  };

  return (
    <div
      className="glass-panel-interactive animate-fade-in"
      style={{
        padding: '1.2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Match Score subtle glow */}
      {stock.matchScore >= 85 && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
      )}

      {/* Card Header: Ticker, Name, Market & Match Score */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {stock.ticker}
              </span>
              <span className={`pill-badge ${stock.market === 'TW' ? 'pill-emerald' : 'pill-cyan'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                {stock.market === 'TW' ? '🇹🇼 台股' : '🇺🇸 美股'}
              </span>
              <span className="pill-badge pill-purple" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                {stock.sector}
              </span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
              {stock.name}
            </h3>
          </div>

          {/* AI Match score badge */}
          {stock.matchScore !== undefined && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: `1px solid ${getScoreColor(stock.matchScore)}`,
              borderRadius: '10px',
              padding: '0.35rem 0.6rem',
              textAlign: 'center',
              boxShadow: `0 0 12px ${getScoreColor(stock.matchScore)}33`
            }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'center' }}>
                <Sparkles size={9} color={getScoreColor(stock.matchScore)} /> 匹配度
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: getScoreColor(stock.matchScore) }}>
                {stock.matchScore}%
              </div>
            </div>
          )}
        </div>

        {/* Price & Change */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', margin: '0.75rem 0 1rem' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {stock.currency === 'USD' ? '$' : 'NT$'}{stock.price.toLocaleString()}
          </span>
          <span style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.15rem',
            color: isPositive ? '#34d399' : '#f87171',
            background: isPositive ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
            padding: '0.15rem 0.45rem',
            borderRadius: '6px'
          }}>
            {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </span>
        </div>

        {/* Key Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          padding: '0.6rem 0.75rem',
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1rem'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>股利殖利率</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: stock.yield >= 4.5 ? '#34d399' : 'var(--text-primary)' }}>
              {stock.yield}%
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>本益比 (P/E)</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: stock.pe <= 18 ? '#38bdf8' : 'var(--text-primary)' }}>
              {stock.pe} 倍
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>資產報酬 ROE</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: stock.roe >= 15 ? '#c084fc' : 'var(--text-primary)' }}>
              {stock.roe}%
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>營收成長 YoY</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: stock.revenueGrowth >= 15 ? '#fbbf24' : 'var(--text-primary)' }}>
              {stock.revenueGrowth > 0 ? `+${stock.revenueGrowth}%` : `${stock.revenueGrowth}%`}
            </span>
          </div>
        </div>

        {/* Short Summary */}
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, height: '2.8em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {stock.summary}
        </p>
      </div>

      {/* Card Footer Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.1rem', pt: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {/* Watchlist button */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleWatchlist(stock); }}
            className="btn-icon"
            title={isWatchlisted ? "移除觀察名單" : "加入觀察名單"}
            style={{ color: isWatchlisted ? 'var(--accent-gold)' : 'var(--text-secondary)' }}
          >
            <Bookmark size={15} fill={isWatchlisted ? 'var(--accent-gold)' : 'none'} />
          </button>

          {/* Compare button */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCompare(stock); }}
            className="btn-icon"
            title={isCompared ? "取消對比" : "加入個股對比"}
            style={{ color: isCompared ? 'var(--accent-cyan)' : 'var(--text-secondary)', background: isCompared ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.05)' }}
          >
            <ArrowLeftRight size={15} />
          </button>
        </div>

        {/* View detail modal */}
        <button
          onClick={() => onSelect(stock)}
          className="btn-primary"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
        >
          查看分析 <ChevronRight size={14} />
        </button>
      </div>

    </div>
  );
}
