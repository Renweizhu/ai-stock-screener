import React from 'react';
import { X, Bookmark, Trash2, Download, TrendingUp, DollarSign } from 'lucide-react';

export default function WatchlistDrawer({ watchlist, isOpen, onClose, onRemove, onSelectStock }) {
  if (!isOpen) return null;

  // Calculate average portfolio metrics
  const avgYield = watchlist.length > 0 
    ? (watchlist.reduce((sum, s) => sum + s.yield, 0) / watchlist.length).toFixed(2)
    : 0;
  const avgPe = watchlist.length > 0
    ? (watchlist.reduce((sum, s) => sum + s.pe, 0) / watchlist.length).toFixed(1)
    : 0;

  // Export Watchlist as CSV
  const handleExportCSV = () => {
    if (watchlist.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8,代號,名稱,市場,產業,現價,殖利率(%),本益比,ROE(%)\n";
    watchlist.forEach(s => {
      csvContent += `${s.ticker},${s.name},${s.market},${s.sector},${s.price},${s.yield},${s.pe},${s.roe}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `watchlist_stocks_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 16, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '420px',
        height: '100%',
        borderRadius: 0,
        borderLeft: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.7)'
      }}>
        
        {/* Drawer Header */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bookmark size={20} color="var(--accent-gold)" fill="var(--accent-gold)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>自訂觀察名單</h2>
            <span className="pill-badge pill-gold">
              {watchlist.length} 檔
            </span>
          </div>

          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Portfolio Stats Bar */}
        {watchlist.length > 0 && (
          <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>組合平均殖利率</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{avgYield}%</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>組合平均本益比</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{avgPe} 倍</div>
            </div>
          </div>
        )}

        {/* Watchlist Items */}
        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {watchlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Bookmark size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '0.85rem' }}>目前尚未加入任何觀察股票。</p>
              <p style={{ fontSize: '0.75rem', marginTop: '0.3rem' }}>點擊股票卡片上的書籤圖示即可收藏！</p>
            </div>
          ) : (
            watchlist.map(stock => (
              <div
                key={stock.ticker}
                className="glass-panel"
                style={{
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease'
                }}
                onClick={() => { onSelectStock(stock); onClose(); }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{stock.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{stock.ticker}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem', display: 'flex', gap: '0.6rem' }}>
                    <span>殖利率: <strong style={{ color: 'var(--accent-emerald)' }}>{stock.yield}%</strong></span>
                    <span>P/E: <strong style={{ color: 'var(--accent-cyan)' }}>{stock.pe}x</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{stock.currency === 'USD' ? '$' : 'NT$'}{stock.price}</div>
                    <div style={{ fontSize: '0.72rem', color: stock.changePercent >= 0 ? '#34d399' : '#f87171' }}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                    </div>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(stock.ticker); }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem' }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-rose)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Actions */}
        {watchlist.length > 0 && (
          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-panel)' }}>
            <button onClick={handleExportCSV} className="btn-primary" style={{ width: '100%' }}>
              <Download size={15} /> 匯出觀察名單 (CSV)
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
