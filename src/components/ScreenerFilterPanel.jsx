import React, { useState } from 'react';
import { SlidersHorizontal, RotateCcw, ShieldCheck, DollarSign, Percent, TrendingUp, Cpu, BarChart2, Zap, Layers, Award } from 'lucide-react';

export default function ScreenerFilterPanel({ filters, setFilters, onResetFilters }) {
  const [activeFacingTab, setActiveFacingTab] = useState('fundamental'); // 'fundamental' | 'technical' | 'chips'

  const handleChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleCheckbox = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      
      {/* WantGoo Style Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.4rem', borderRadius: '8px', color: 'var(--accent-cyan)' }}>
            <Layers size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800 }}>玩股網飆股篩選模型 (三大面向)</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>自訂基本面、技術面與籌碼面指標組合</p>
          </div>
        </div>

        <button
          onClick={onResetFilters}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            transition: 'color 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-rose)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <RotateCcw size={12} /> 重置所有指標
        </button>
      </div>

      {/* Facing Tabs Selector (基本面 / 技術面 / 籌碼面) */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
        {[
          { id: 'fundamental', label: '📊 基本面 (財務/估值)', icon: <BarChart2 size={13} /> },
          { id: 'technical', label: '📈 技術面 (均線/突破/KD)', icon: <TrendingUp size={13} /> },
          { id: 'chips', label: '💰 籌碼面 (法人連買/大戶)', icon: <Zap size={13} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFacingTab(tab.id)}
            style={{
              flex: 1,
              background: activeFacingTab === tab.id ? 'var(--accent-cyan)' : 'transparent',
              color: activeFacingTab === tab.id ? '#090d16' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.45rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: activeFacingTab === tab.id ? 800 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: 基本面 (Fundamental) */}
      {activeFacingTab === 'fundamental' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
          
          {/* Min Yield */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <DollarSign size={13} color="var(--accent-emerald)" /> 最低殖利率 (%)
              </span>
              <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                {filters.minYield > 0 ? `${filters.minYield.toFixed(1)}%` : '不限'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="7.5"
              step="0.5"
              value={filters.minYield || 0}
              onChange={(e) => handleChange('minYield', parseFloat(e.target.value))}
            />
          </div>

          {/* Max P/E */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Percent size={13} color="var(--accent-cyan)" /> 最高本益比 (P/E)
              </span>
              <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                {filters.maxPe ? `≤ ${filters.maxPe} 倍` : '不限'}
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="60"
              step="2"
              value={filters.maxPe || 60}
              onChange={(e) => handleChange('maxPe', parseFloat(e.target.value) === 60 ? null : parseFloat(e.target.value))}
            />
          </div>

          {/* Min ROE */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={13} color="var(--accent-purple)" /> 最低 ROE (%)
              </span>
              <span style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>
                {filters.minRoe > 0 ? `≥ ${filters.minRoe}%` : '不限'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="2"
              value={filters.minRoe || 0}
              onChange={(e) => handleChange('minRoe', parseFloat(e.target.value))}
            />
          </div>

          {/* Sector */}
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Cpu size={13} color="#94a3b8" /> 產業細分
            </div>
            <select
              value={filters.sector || 'ALL'}
              onChange={(e) => handleChange('sector', e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.6rem',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              <option value="ALL">全部產業</option>
              <option value="電子/半導體/AI">電子 / 半導體 / AI</option>
              <option value="金融保險">金融保險</option>
              <option value="ETF 基金">ETF 基金</option>
              <option value="航運物流">航運物流</option>
              <option value="鋼鐵金屬">鋼鐵金屬</option>
              <option value="生技醫療">生技醫療</option>
              <option value="塑膠化學">塑膠化學</option>
              <option value="建材營造">建材營造</option>
              <option value="食品工業">食品工業</option>
              <option value="觀光餐飲">觀光餐飲</option>
              <option value="一般產業">一般綜合產業</option>
            </select>
          </div>

        </div>
      )}

      {/* Tab 2: 技術面 (Technical - WantGoo Style) */}
      {activeFacingTab === 'technical' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-primary)', cursor: 'pointer', background: 'rgba(15,23,42,0.6)', padding: '0.6rem 0.85rem', borderRadius: '8px', border: filters.aboveQuarterlyMa ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)' }}>
            <input
              type="checkbox"
              checked={!!filters.aboveQuarterlyMa}
              onChange={() => toggleCheckbox('aboveQuarterlyMa')}
              style={{ accentColor: 'var(--accent-emerald)' }}
            />
            🚀 股價突破/站上 60日季線
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-primary)', cursor: 'pointer', background: 'rgba(15,23,42,0.6)', padding: '0.6rem 0.85rem', borderRadius: '8px', border: filters.maBullishAlignment ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)' }}>
            <input
              type="checkbox"
              checked={!!filters.maBullishAlignment}
              onChange={() => toggleCheckbox('maBullishAlignment')}
              style={{ accentColor: 'var(--accent-cyan)' }}
            />
            📈 均線多頭排列 (5MA > 20MA > 60MA)
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-primary)', cursor: 'pointer', background: 'rgba(15,23,42,0.6)', padding: '0.6rem 0.85rem', borderRadius: '8px', border: filters.volumeSurge ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)' }}>
            <input
              type="checkbox"
              checked={!!filters.volumeSurge}
              onChange={() => toggleCheckbox('volumeSurge')}
              style={{ accentColor: 'var(--accent-gold)' }}
            />
            ⚡ 成交量爆發 ( > 5日均量 2倍)
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-primary)', cursor: 'pointer', background: 'rgba(15,23,42,0.6)', padding: '0.6rem 0.85rem', borderRadius: '8px', border: filters.kdGoldenCross ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)' }}>
            <input
              type="checkbox"
              checked={!!filters.kdGoldenCross}
              onChange={() => toggleCheckbox('kdGoldenCross')}
              style={{ accentColor: 'var(--accent-purple)' }}
            />
            🎯 日 KD 黃金交叉 (K 上穿 D)
          </label>

        </div>
      )}

      {/* Tab 3: 籌碼面 (Chips - WantGoo Style) */}
      {activeFacingTab === 'chips' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-primary)', cursor: 'pointer', background: 'rgba(15,23,42,0.6)', padding: '0.6rem 0.85rem', borderRadius: '8px', border: filters.institutionalConsecutiveBuy ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)' }}>
            <input
              type="checkbox"
              checked={!!filters.institutionalConsecutiveBuy}
              onChange={() => toggleCheckbox('institutionalConsecutiveBuy')}
              style={{ accentColor: 'var(--accent-cyan)' }}
            />
            🏛 三大法人 (外資/投信) 連續買超
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-primary)', cursor: 'pointer', background: 'rgba(15,23,42,0.6)', padding: '0.6rem 0.85rem', borderRadius: '8px', border: filters.bigHoldersIncrease ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)' }}>
            <input
              type="checkbox"
              checked={!!filters.bigHoldersIncrease}
              onChange={() => toggleCheckbox('bigHoldersIncrease')}
              style={{ accentColor: 'var(--accent-gold)' }}
            />
            👑 千張大戶持股比例增加
          </label>

        </div>
      )}

    </div>
  );
}
