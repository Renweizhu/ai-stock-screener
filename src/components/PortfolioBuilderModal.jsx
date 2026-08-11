import React, { useState } from 'react';
import { X, PieChart, Sparkles, DollarSign, Calculator, Download, Bookmark, ArrowRight, Shield, Zap, Scale } from 'lucide-react';
import { generatePortfolioAllocation } from '../services/aiScreenerEngine';

export default function PortfolioBuilderModal({ isOpen, onClose, onAddAllToWatchlist }) {
  const [userPrompt, setUserPrompt] = useState('我有 100 萬台幣，希望以穩健領息為主，適度配一點科技股成長');
  const [budget, setBudget] = useState(1000000);
  const [portfolio, setPortfolio] = useState(() => generatePortfolioAllocation(userPrompt, budget));

  if (!isOpen) return null;

  const handleGenerate = (promptText = userPrompt, budgetVal = budget) => {
    const result = generatePortfolioAllocation(promptText, budgetVal);
    setPortfolio(result);
  };

  const handleBudgetChange = (newBudget) => {
    setBudget(newBudget);
    handleGenerate(userPrompt, newBudget);
  };

  const handleExportPortfolio = () => {
    let text = `=== StockMind AI 投資組合配置企劃書 ===\n`;
    text += `配置策略：${portfolio.profileName}\n`;
    text += `總投資預算：NT$ ${portfolio.budgetAmount.toLocaleString()}\n`;
    text += `預估年化殖利率：${portfolio.portfolioYield}%\n`;
    text += `預估每年可領股息：NT$ ${portfolio.totalAnnualDividend.toLocaleString()}\n`;
    text += `組合平均本益比：${portfolio.portfolioPe} 倍 | Beta 波動度：${portfolio.portfolioBeta}\n\n`;
    text += `--- 標的佔比與金額明細 ---\n`;
    portfolio.portfolioItems.forEach(item => {
      text += `[${item.ticker}] ${item.name} (${item.sector}) - 佔比 ${item.weight}%\n`;
      text += `  - 預估配置金額：NT$ ${item.allocatedAmount.toLocaleString()}\n`;
      text += `  - 預估可買股數：${item.estimatedShares} 股\n`;
      text += `  - 預估年股息：NT$ ${item.expectedAnnualDividend.toLocaleString()}\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `investment_portfolio_${new Date().toISOString().slice(0,10)}.txt`;
    link.click();
  };

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
      zIndex: 1100,
      padding: '1.5rem',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '900px',
        maxHeight: '92vh',
        overflowY: 'auto',
        position: 'relative',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
      }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.4rem', borderRadius: '8px', color: 'var(--accent-emerald)' }}>
              <PieChart size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>AI 智能投資組合配置助手</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>依據個人風險偏好與預算，自動試算權重比與預期領息</p>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Input & Quick Presets Bar */}
        <div style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                💬 請輸入您的理財目標或偏好描述：
              </label>
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="例如：我有 100 萬，想兼顧領息與科技股成長..."
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.85rem',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                💵 總投資金額 (NTD)：
              </label>
              <input
                type="number"
                step="50000"
                value={budget}
                onChange={(e) => handleBudgetChange(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.85rem',
                  color: 'var(--accent-emerald)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Quick Persona Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>快速套用範本：</span>
            {[
              { label: "🛡 保守高股息防禦", prompt: "保守退休族，偏好高股息與極低波動度", icon: <Shield size={12} /> },
              { label: "⚖️ 穩健全天候均衡", prompt: "穩健均衡型，兼顧科技成長與高股息現金流", icon: <Scale size={12} /> },
              { label: "🚀 積極 AI 高成長", prompt: "積極飆股型，重押全球 AI 算力與科技龍頭", icon: <Zap size={12} /> }
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUserPrompt(p.prompt);
                  handleGenerate(p.prompt, budget);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '99px',
                  padding: '0.3rem 0.75rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                {p.icon} {p.label}
              </button>
            ))}

            <button
              onClick={() => handleGenerate()}
              className="btn-primary"
              style={{ marginLeft: 'auto', padding: '0.45rem 1rem', fontSize: '0.8rem' }}
            >
              <Sparkles size={14} /> 重新分析配置
            </button>
          </div>
        </div>

        {/* Portfolio Analysis Output */}
        <div style={{ padding: '1.5rem' }}>
          
          {/* Strategy Rationale Banner */}
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-emerald)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} /> 配置策略：{portfolio.profileName}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {portfolio.strategyRationale}
            </p>
          </div>

          {/* Portfolio Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>預估組合殖利率</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>
                {portfolio.portfolioYield}%
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>預估每年可領股息</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent-gold)' }}>
                NT$ {portfolio.totalAnnualDividend.toLocaleString()}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>組合平均本益比 (P/E)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
                {portfolio.portfolioPe} 倍
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>組合 Beta 波動度</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-purple)' }}>
                {portfolio.portfolioBeta}
              </div>
            </div>
          </div>

          {/* Stacked Allocation Progress Bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>資產佔比比例分佈 (總計 100%)</span>
              <span>總資產：NT$ {budget.toLocaleString()}</span>
            </div>
            <div style={{ height: '14px', borderRadius: '7px', overflow: 'hidden', display: 'flex', background: '#1e293b' }}>
              {portfolio.portfolioItems.map((item, i) => {
                const colors = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'];
                return (
                  <div
                    key={item.ticker}
                    style={{
                      width: `${item.weight}%`,
                      background: colors[i % colors.length],
                      transition: 'width 0.4s ease'
                    }}
                    title={`${item.name}: ${item.weight}%`}
                  />
                );
              })}
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="glass-panel" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.7)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>配置標的</th>
                  <th style={{ padding: '0.75rem 1rem' }}>配置定位</th>
                  <th style={{ padding: '0.75rem 1rem' }}>權重佔比</th>
                  <th style={{ padding: '0.75rem 1rem' }}>預估金額</th>
                  <th style={{ padding: '0.75rem 1rem' }}>預估股數</th>
                  <th style={{ padding: '0.75rem 1rem' }}>預估年股息</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.portfolioItems.map((item, i) => (
                  <tr key={item.ticker} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.ticker} • {item.market}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="pill-badge pill-cyan" style={{ fontSize: '0.72rem' }}>{item.role}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      {item.weight}%
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)' }}>
                      NT$ {item.allocatedAmount.toLocaleString()}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)' }}>
                      {item.estimatedShares.toLocaleString()} 股
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                      NT$ {item.expectedAnnualDividend.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-panel)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={handleExportPortfolio} className="btn-secondary" style={{ fontSize: '0.82rem' }}>
            <Download size={15} /> 匯出配置企劃書 (.TXT)
          </button>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() => {
                onAddAllToWatchlist(portfolio.portfolioItems);
                alert("已成功將投資組合中所有標的加入觀察名單！");
              }}
              className="btn-primary"
              style={{ fontSize: '0.82rem' }}
            >
              <Bookmark size={15} /> 一鍵全部加入觀察名單
            </button>
            <button onClick={onClose} className="btn-secondary">
              關閉視窗
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
