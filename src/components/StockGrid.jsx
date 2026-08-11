import React, { useState } from 'react';
import StockCard from './StockCard';
import { LayoutGrid, List, ArrowUpDown, FilterX, Sparkles } from 'lucide-react';

export default function StockGrid({
  stocks,
  onSelectStock,
  watchlist,
  onToggleWatchlist,
  compareList,
  onToggleCompare,
  onResetFilters
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [sortBy, setSortBy] = useState('matchScore'); // 'matchScore' | 'yield' | 'pe' | 'roe' | 'revenueGrowth'

  // Sort logic
  const sortedStocks = [...stocks].sort((a, b) => {
    if (sortBy === 'matchScore') return (b.matchScore || 0) - (a.matchScore || 0);
    if (sortBy === 'yield') return b.yield - a.yield;
    if (sortBy === 'pe') return a.pe - b.pe; // Lowest P/E first
    if (sortBy === 'roe') return b.roe - a.roe;
    if (sortBy === 'revenueGrowth') return b.revenueGrowth - a.revenueGrowth;
    return 0;
  });

  const isWatchlisted = (ticker) => watchlist.some(s => s.ticker === ticker);
  const isCompared = (ticker) => compareList.some(s => s.ticker === ticker);

  return (
    <div style={{ marginTop: '1.25rem' }}>
      
      {/* Header bar: Count, Sorting & Grid/Table toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
            篩選結果標的
          </h2>
          <span className="pill-badge pill-emerald" style={{ fontSize: '0.78rem' }}>
            共 {stocks.length} 檔符合
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* Sort dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <ArrowUpDown size={14} color="var(--accent-cyan)" /> 排序：
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.6rem',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="matchScore">🎯 AI 匹配度高至低</option>
              <option value="yield">💰 股利殖利率高至低</option>
              <option value="pe">💎 本益比低至高 (估值便宜)</option>
              <option value="roe">⚡ ROE 獲利能力高至低</option>
              <option value="revenueGrowth">🚀 營收年增率高至低</option>
            </select>
          </div>

          {/* View mode toggle */}
          <div style={{
            background: 'var(--bg-input)',
            padding: '2px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '2px'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none',
                padding: '0.3rem 0.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                background: viewMode === 'table' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                color: viewMode === 'table' ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none',
                padding: '0.3rem 0.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <List size={15} />
            </button>
          </div>

        </div>
      </div>

      {/* Empty State */}
      {stocks.length === 0 && (
        <div className="glass-panel" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'rgba(244, 63, 94, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: 'var(--accent-rose)'
          }}>
            <FilterX size={30} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>未找到符合所有條件的股票標的</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            您可以試著放寬篩選條件或點擊重置回預設全市場股票。
          </p>
          <button onClick={onResetFilters} className="btn-primary">
            重置所有篩選條件
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && stocks.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}>
          {sortedStocks.map(stock => (
            <StockCard
              key={stock.ticker}
              stock={stock}
              onSelect={onSelectStock}
              isWatchlisted={isWatchlisted(stock.ticker)}
              onToggleWatchlist={onToggleWatchlist}
              isCompared={isCompared(stock.ticker)}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && stocks.length > 0 && (
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.7)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem' }}>標的名稱</th>
                <th style={{ padding: '0.75rem 1rem' }}>現價 (變動)</th>
                <th style={{ padding: '0.75rem 1rem' }}>AI 匹配度</th>
                <th style={{ padding: '0.75rem 1rem' }}>殖利率</th>
                <th style={{ padding: '0.75rem 1rem' }}>本益比</th>
                <th style={{ padding: '0.75rem 1rem' }}>ROE</th>
                <th style={{ padding: '0.75rem 1rem' }}>營收 YoY</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {sortedStocks.map(stock => (
                <tr
                  key={stock.ticker}
                  style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s ease' }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{stock.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{stock.ticker} • {stock.market}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {stock.currency === 'USD' ? '$' : 'NT$'}{stock.price.toLocaleString()}
                    <span style={{ fontSize: '0.75rem', marginLeft: '0.4rem', color: stock.changePercent >= 0 ? '#34d399' : '#f87171' }}>
                      ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%)
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="pill-badge pill-emerald" style={{ fontWeight: 800 }}>
                      <Sparkles size={10} /> {stock.matchScore}%
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: stock.yield >= 4.5 ? '#34d399' : 'inherit' }}>{stock.yield}%</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: stock.pe <= 18 ? '#38bdf8' : 'inherit' }}>{stock.pe} 倍</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{stock.roe}%</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{stock.revenueGrowth}%</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button onClick={() => onSelectStock(stock)} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                      詳細分析
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
