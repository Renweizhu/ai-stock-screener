import React from 'react';
import { X, ArrowLeftRight, Trash2, Trophy } from 'lucide-react';

export default function StockCompareModal({ compareList, onClose, onRemoveFromCompare, onClearCompare }) {
  if (!compareList || compareList.length === 0) return null;

  // Find winners for each metric
  const highestYield = Math.max(...compareList.map(s => s.yield));
  const lowestPe = Math.min(...compareList.map(s => s.pe));
  const highestRoe = Math.max(...compareList.map(s => s.roe));
  const highestGrowth = Math.max(...compareList.map(s => s.revenueGrowth));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 16, 0.85)',
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
        maxWidth: '960px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
      }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ArrowLeftRight size={20} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>個股多維度橫向對比</h2>
            <span className="pill-badge pill-cyan">
              已選擇 {compareList.length} 檔標的
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button onClick={onClearCompare} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
              <Trash2 size={12} /> 清空對比
            </button>
            <button onClick={onClose} className="btn-icon">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-subtle)', textAlign: 'center' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>對比指標</th>
                {compareList.map(stock => (
                  <th key={stock.ticker} style={{ padding: '1rem', width: `${80 / compareList.length}%` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{stock.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{stock.ticker} • {stock.market}</div>
                      </div>
                      <button
                        onClick={() => onRemoveFromCompare(stock.ticker)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              
              {/* Price */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>最新股價</td>
                {compareList.map(stock => (
                  <td key={stock.ticker} style={{ padding: '0.85rem 1rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {stock.currency === 'USD' ? '$' : 'NT$'}{stock.price.toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* Yield */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>股利殖利率 (%)</td>
                {compareList.map(stock => {
                  const isWinner = stock.yield === highestYield;
                  return (
                    <td key={stock.ticker} style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: isWinner ? '#34d399' : 'inherit' }}>
                      {stock.yield}% {isWinner && <Trophy size={12} color="#fbbf24" style={{ marginLeft: '4px' }} />}
                    </td>
                  );
                })}
              </tr>

              {/* P/E */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>本益比 P/E (倍)</td>
                {compareList.map(stock => {
                  const isWinner = stock.pe === lowestPe;
                  return (
                    <td key={stock.ticker} style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: isWinner ? '#38bdf8' : 'inherit' }}>
                      {stock.pe} 倍 {isWinner && <Trophy size={12} color="#fbbf24" style={{ marginLeft: '4px' }} />}
                    </td>
                  );
                })}
              </tr>

              {/* ROE */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>資產報酬 ROE (%)</td>
                {compareList.map(stock => {
                  const isWinner = stock.roe === highestRoe;
                  return (
                    <td key={stock.ticker} style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: isWinner ? '#c084fc' : 'inherit' }}>
                      {stock.roe}% {isWinner && <Trophy size={12} color="#fbbf24" style={{ marginLeft: '4px' }} />}
                    </td>
                  );
                })}
              </tr>

              {/* Revenue Growth */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>營收年增 YoY (%)</td>
                {compareList.map(stock => {
                  const isWinner = stock.revenueGrowth === highestGrowth;
                  return (
                    <td key={stock.ticker} style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: isWinner ? '#fbbf24' : 'inherit' }}>
                      {stock.revenueGrowth}% {isWinner && <Trophy size={12} color="#fbbf24" style={{ marginLeft: '4px' }} />}
                    </td>
                  );
                })}
              </tr>

              {/* Beta */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>波動度 (Beta)</td>
                {compareList.map(stock => (
                  <td key={stock.ticker} style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 600 }}>
                    {stock.beta}
                  </td>
                ))}
              </tr>

              {/* Sector */}
              <tr>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>產業類別</td>
                {compareList.map(stock => (
                  <td key={stock.ticker} style={{ padding: '0.85rem 1rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {stock.sector}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
