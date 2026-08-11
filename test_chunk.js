function test_block() {
                        h('div', { style: { height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' } },
                          h('div', { style: { width: `${item.score}%`, height: '100%', background: item.color } })
                        )
                      )
                    )
                  ),

                  // 20+ Indicators Interactive Checklist
                  h('div', { className: 'glass-panel', style: { padding: '1rem' } },
                    h('h4', { style: { fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-purple)', marginBottom: '0.75rem' } }, '🔍 玩股網 20+ 指標即時檢核：'),
                    h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', fontSize: '0.75rem' } },
                      [
                        { label: '均線多頭排列', pass: selectedStock.maAlign !== false },
                        { label: '突破 60日季線', pass: selectedStock.breakMa60 !== false },
                        { label: '突破 20日月線', pass: selectedStock.breakMa20 !== false },
                        { label: '成交量爆發2倍', pass: selectedStock.volumeBurst !== false },
                        { label: '三大法人同買超', pass: selectedStock.institutionalBuy !== false },
                        { label: '主力籌碼高度集中', pass: selectedStock.mainConcentration !== false }
                      ].map((chk, idx) =>
                        h('div', { key: idx, style: { display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.03)', padding: '0.3rem 0.5rem', borderRadius: '6px' } },
                          h('span', { style: { color: chk.pass ? '#10b981' : '#ef4444', fontWeight: 900 } }, chk.pass ? '🟢' : '🔴'),
                          h('span', { style: { color: chk.pass ? '#e2e8f0' : 'var(--text-muted)' } }, chk.label)
                        )
                      )
                    )
                  )
                ),

                // 4. Quick Action Toolbar
                h('div', { style: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' } },
                  h('div', { style: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' } },
                    h('button', {
                      onClick: () => { setSelectedStock(null); handleSend(`深度拆解與建議配置標的 ${selectedStock.name} (${selectedStock.ticker})`); },
                      className: 'btn-primary',
                      style: { fontSize: '0.8rem', padding: '0.45rem 1rem' }
                    }, '💬 連線 AI 深度對話追問'),
                    h('button', {
                      onClick: () => { toggleCompare(selectedStock); },
                      className: 'btn-secondary',
                      style: { fontSize: '0.8rem' }
                    }, `⚖️ ${compareList.some(s => s.ticker === selectedStock.ticker) ? '取消對比' : '加入對比'}`),
                    h('button', {
                      onClick: () => { toggleWatchlist(selectedStock); },
                      className: 'btn-secondary',
                      style: { fontSize: '0.8rem' }
                    }, `⭐ ${watchlist.some(s => s.ticker === selectedStock.ticker) ? '取消觀察' : '加入觀察名單'}`)
                  ),
                  h('button', { onClick: () => setSelectedStock(null), className: 'btn-secondary', style: { padding: '0.45rem 1.25rem' } }, '關閉分析視窗')
                )
              )
            )
          );
        }

        ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
      })();
    
}