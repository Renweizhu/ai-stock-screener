import os

html_content = """<!DOCTYPE html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>StockMind AI - 全台股即時對話篩選與配置系統</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📈</text></svg>" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Noto+Sans+TC:wght@400;700&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="./src/index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script>
      if (typeof React === 'undefined') {
        document.write('<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"><\\/script>');
        document.write('<script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"><\\/script>');
      }
    </script>
    <script>
      const { useState, useMemo, useEffect, useRef, createElement: h } = React;

      function formatNum(val) {
        if (val === null || val === undefined || isNaN(val)) return '0';
        return Number(val).toLocaleString();
      }

      const INITIAL_STOCKS = [
        {
          ticker: "2330",
          name: "台積電 (TSMC)",
          market: "TW",
          currency: "NTD",
          sector: "電子/半導體/AI",
          price: 2380.0,
          changePercent: 0.42,
          pe: 31.86,
          pb: 10.43,
          yield: 0.93,
          roe: 28.5,
          revenueGrowth: 24.8,
          summary: "全球晶圓代工龍頭，掌握最先進 3nm/2nm 製程與 CoWoS 先進封裝霸權。",
          aiCommentary: "台積電為全球 AI 算力基礎設施的最大受益者，營收與 EPS 均維持強勁成長。"
        },
        {
          ticker: "2317",
          name: "鴻海 (Foxconn)",
          market: "TW",
          currency: "NTD",
          sector: "電子/半導體/AI",
          price: 264.5,
          changePercent: 1.73,
          pe: 18.47,
          pb: 2.05,
          yield: 2.76,
          roe: 11.2,
          revenueGrowth: 18.5,
          summary: "全球電子代工巨擘，全力搶進 GB200 AI 伺服器頂規機櫃組裝。",
          aiCommentary: "鴻海受惠於 Blackwell AI 伺服器強勁需求，本益比約 18 倍具估值優勢。"
        },
        {
          ticker: "2454",
          name: "聯發科 (MediaTek)",
          market: "TW",
          currency: "NTD",
          sector: "電子/半導體/AI",
          price: 3960.0,
          changePercent: 1.54,
          pe: 64.41,
          pb: 14.67,
          yield: 1.37,
          roe: 22.1,
          revenueGrowth: 15.2,
          summary: "手機晶片巨頭，拓展天璣 9400 AI 手機晶片與 ASIC 客製化晶片。",
          aiCommentary: "聯發科具備高技術壁壘與 AI 手機換機潮題材。"
        },
        {
          ticker: "2881",
          name: "富邦金 (Fubon)",
          market: "TW",
          currency: "NTD",
          sector: "金融保險",
          price: 128.5,
          changePercent: 1.18,
          pe: 17.47,
          pb: 1.94,
          yield: 3.35,
          roe: 14.8,
          revenueGrowth: 28.4,
          summary: "台灣金控獲利王，旗下富邦人壽與富邦銀行獲利創新高。",
          aiCommentary: "富邦金獲利穩健，適合追求穩定領息與防禦的投資人。"
        },
        {
          ticker: "2882",
          name: "國泰金 (Cathay)",
          market: "TW",
          currency: "NTD",
          sector: "金融保險",
          price: 101.0,
          changePercent: 1.61,
          pe: 15.08,
          pb: 1.99,
          yield: 3.52,
          roe: 12.5,
          revenueGrowth: 22.1,
          summary: "台灣資產規模第一大金控，兼具銀行與壽險投資收益。",
          aiCommentary: "保守防禦型優質股，波動度低、配息穩定。"
        },
        {
          ticker: "2382",
          name: "廣達 (Quanta)",
          market: "TW",
          currency: "NTD",
          sector: "電子/半導體/AI",
          price: 313.5,
          changePercent: 5.20,
          pe: 14.98,
          pb: 5.54,
          yield: 5.23,
          roe: 24.6,
          revenueGrowth: 32.5,
          summary: "全球筆電與 AI 伺服器龍頭，握有美系雲端巨頭龐大 AI 伺服器訂單。",
          aiCommentary: "廣達本益比低於 15 倍，兼具 AI 高爆發成長與價值防禦。"
        },
        {
          ticker: "0056",
          name: "元大高股息 (ETF)",
          market: "TW",
          currency: "NTD",
          sector: "ETF 基金",
          price: 52.45,
          changePercent: 2.74,
          pe: 12.8,
          pb: 1.45,
          yield: 6.8,
          roe: 13.4,
          revenueGrowth: 8.5,
          summary: "老牌高股息 ETF 始祖，嚴選股息殖利率最高的 50 檔台股優質企業。",
          aiCommentary: "高達 6.8% 的高殖利率與極低波動度，是退休存股族的熱門選擇。"
        },
        {
          ticker: "NVDA",
          name: "英偉達 (NVIDIA)",
          market: "US",
          currency: "USD",
          sector: "美股 / 半導體與AI",
          price: 223.96,
          changePercent: 2.27,
          pe: 45.2,
          pb: 38.0,
          yield: 0.08,
          roe: 62.4,
          revenueGrowth: 122.5,
          summary: "全球 AI 革命總司令，GPU 晶片與 CUDA 壟斷全球 85%+ AI 數據中心。",
          aiCommentary: "極致的 AI 高成長飆股，最新價 223.96 美元。"
        }
      ];

      const strategyPresets = [
        { id: "high-dividend", icon: "💰", title: "高股息存股", prompt: "幫我篩選全台股殖利率 4.5% 以上適合存股的股票" },
        { id: "value-investing", icon: "💎", title: "價值投資", prompt: "我想找本益比低於 15 倍的高獲利低估值股票" },
        { id: "ai-growth", icon: "🚀", title: "AI 成長飆股", prompt: "幫我挑選電子半導體受惠 AI 趨勢的爆發股" },
        { id: "shipping-steel", icon: "🚢", title: "航運鋼鐵族", prompt: "幫我看航運與鋼鐵產業中高殖利率標的" }
      ];

      function parseQuery(text) {
        const query = (text || "").toLowerCase();
        const filters = {};
        const tags = [];

        if (query.includes("高股息") || query.includes("存股") || query.includes("領息")) {
          filters.minYield = 4.0;
          tags.push("殖利率 4.0% 以上");
        }
        if (query.includes("便宜") || query.includes("低估") || query.includes("價值")) {
          filters.maxPe = 18.0;
          tags.push("本益比 18 以下");
        }
        if (query.includes("高獲利") || query.includes("roe")) {
          filters.minRoe = 15.0;
          tags.push("ROE 15% 以上");
        }
        if (query.includes("飆股") || query.includes("成長") || query.includes("營收")) {
          filters.minRevenueGrowth = 12.0;
          tags.push("營收成長 12% 以上");
        }
        if (query.includes("美股")) {
          filters.market = "US";
          tags.push("市場: 美股");
        } else if (query.includes("台股")) {
          filters.market = "TW";
          tags.push("市場: 台股");
        }

        if (query.includes("半導體") || query.includes("電子") || query.includes("ai") || query.includes("科技")) {
          filters.sector = "電子/半導體/AI";
          tags.push("產業: 電子/半導體/AI");
        } else if (query.includes("金融") || query.includes("金控") || query.includes("銀行")) {
          filters.sector = "金融保險";
          tags.push("產業: 金融保險");
        } else if (query.includes("etf")) {
          filters.sector = "ETF 基金";
          tags.push("產業: ETF 基金");
        }

        return { filters, tags };
      }

      function calculateMatchScore(stock, filters) {
        let score = 100;
        if (filters.market && filters.market !== "ALL" && stock.market !== filters.market) return 0;
        if (filters.sector && filters.sector !== "ALL" && stock.sector !== filters.sector) return 0;

        if (filters.minYield > 0 && stock.yield < filters.minYield) score -= (filters.minYield - stock.yield) * 12;
        if (filters.maxPe > 0 && stock.pe > filters.maxPe) score -= (stock.pe - filters.maxPe) * 3;
        if (filters.minRoe > 0 && stock.roe < filters.minRoe) score -= (filters.minRoe - stock.roe) * 2;
        if (filters.minRevenueGrowth > 0 && stock.revenueGrowth < filters.minRevenueGrowth) score -= (filters.minRevenueGrowth - stock.revenueGrowth) * 1.5;
        return Math.max(15, Math.min(99, Math.round(score)));
      }

      function App() {
        const [currentStocks, setCurrentStocks] = useState(INITIAL_STOCKS);
        const [stockCount, setStockCount] = useState(INITIAL_STOCKS.length);
        const [lastSync, setLastSync] = useState("連線中...");
        const [activeMarket, setActiveMarket] = useState('ALL');
        const [searchTerm, setSearchTerm] = useState('');
        const [filters, setFilters] = useState({ minYield: 0, maxPe: null, minRoe: 0, minRevenueGrowth: 0, sector: 'ALL' });
        const [parsedTags, setParsedTags] = useState([]);
        const [displayLimit, setDisplayLimit] = useState(36);
        const [isChatMinimized, setIsChatMinimized] = useState(false);

        const [messages, setMessages] = useState([
          {
            sender: 'ai',
            text: '你好！我是你的 AI 股票特助。已連線全台股 1,300+ 上市公司與熱門 ETF！\\n請隨意輸入選股訴求，如：「幫我找殖利率 4% 以上的電子股」或「幫我配 100 萬投資組合」。'
          }
        ]);
        const [inputText, setInputText] = useState('');
        const [isProcessing, setIsProcessing] = useState(false);

        const [selectedStock, setSelectedStock] = useState(null);

        // Persistent Watchlist in LocalStorage
        const [watchlist, setWatchlist] = useState(() => {
          try {
            const saved = localStorage.getItem('stockmind_watchlist');
            if (saved) {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
          } catch (e) {
            console.warn("Failed to load watchlist:", e);
          }
          return [INITIAL_STOCKS[0], INITIAL_STOCKS[3]];
        });

        useEffect(() => {
          try {
            localStorage.setItem('stockmind_watchlist', JSON.stringify(watchlist));
          } catch (e) {
            console.warn("Failed to save watchlist:", e);
          }
        }, [watchlist]);

        const [compareList, setCompareList] = useState([]);
        const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
        const [isCompareOpen, setIsCompareOpen] = useState(false);
        const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);

        const [sortBy, setSortBy] = useState('matchScore');
        const messagesEndRef = useRef(null);

        const fetchLiveStocks = async () => {
          try {
            const res = await fetch('/api/stocks');
            if (res.ok) {
              const data = await res.json();
              if (data.stocks && Array.isArray(data.stocks) && data.stocks.length > 0) {
                setCurrentStocks(data.stocks);
                setStockCount(data.count || data.stocks.length);
                setLastSync(data.last_sync || new Date().toLocaleTimeString());
              }
            }
          } catch (e) {}
        };

        useEffect(() => {
          fetchLiveStocks();
          const timer = setInterval(fetchLiveStocks, 15000);
          return () => clearInterval(timer);
        }, []);

        useEffect(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, [messages, isProcessing, isChatMinimized]);

        const screenedStocks = useMemo(() => {
          let list = currentStocks;
          if (activeMarket !== 'ALL') list = list.filter(s => s.market === activeMarket);
          if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(s => s.name.toLowerCase().includes(q) || s.ticker.toLowerCase().includes(q) || (s.sector && s.sector.toLowerCase().includes(q)));
          }

          const scored = list.map(s => ({ ...s, matchScore: calculateMatchScore(s, { ...filters, market: activeMarket }) })).filter(s => s.matchScore > 0);

          return scored.sort((a, b) => {
            if (sortBy === 'matchScore') return b.matchScore - a.matchScore;
            if (sortBy === 'yield') return b.yield - a.yield;
            if (sortBy === 'pe') return a.pe - b.pe;
            if (sortBy === 'roe') return b.roe - a.roe;
            return 0;
          });
        }, [currentStocks, activeMarket, searchTerm, filters, sortBy]);

        const displayedStocks = useMemo(() => {
          return screenedStocks.slice(0, displayLimit);
        }, [screenedStocks, displayLimit]);

        const handleSend = (textOverride) => {
          const query = textOverride || inputText;
          if (!query.trim() || isProcessing) return;

          const userMsg = { sender: 'user', text: query };
          setMessages(prev => [...prev, userMsg]);
          if (!textOverride) setInputText('');
          setIsProcessing(true);

          setTimeout(() => {
            if (query.includes("組合") || query.includes("配置") || query.includes("比例") || query.includes("萬")) {
              setIsPortfolioOpen(true);
            }

            const { filters: extracted, tags } = parseQuery(query);
            setFilters(prev => ({ ...prev, ...extracted }));
            setParsedTags(tags);

            const matched = currentStocks
              .map(s => ({ ...s, matchScore: calculateMatchScore(s, { ...filters, ...extracted }) }))
              .filter(s => s.matchScore > 0)
              .sort((a, b) => b.matchScore - a.matchScore);

            const top3 = matched.slice(0, 3);
            let replyText = `根據您的指令「${query}」，AI 於全台股 ${stockCount} 檔標的中篩選：【${tags.length > 0 ? tags.join(" | ") : "全市場優質標的"}】。\\n\\n`;
            if (top3.length > 0) {
              replyText += `首選推薦為 ${top3.map(s => `${s.name} (${s.ticker})`).join("、")}。\\n其中 ${top3[0].name} 匹配度達 ${top3[0].matchScore}%！最新成交價 ${top3[0].price} 元。`;
            } else {
              replyText += "目前全市場暫無符合所有條件的標的，建議可適度放寬條件。";
            }

            setMessages(prev => [...prev, { sender: 'ai', text: replyText, topStocks: top3 }]);
            setIsProcessing(false);
          }, 400);
        };

        const toggleWatchlist = (stock) => {
          setWatchlist(prev => prev.some(s => s.ticker === stock.ticker) ? prev.filter(s => s.ticker !== stock.ticker) : [...prev, stock]);
        };

        const toggleCompare = (stock) => {
          setCompareList(prev => {
            if (prev.some(s => s.ticker === stock.ticker)) return prev.filter(s => s.ticker !== stock.ticker);
            if (prev.length >= 4) { alert("最多對比 4 檔標的"); return prev; }
            return [...prev, stock];
          });
        };

        return h('div', { className: 'app-container' },
          // Header
          h('header', { className: 'glass-panel', style: { padding: '0.85rem 1.5rem', marginBottom: '1.5rem' } },
            h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' } },
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' } },
                h('div', { style: { background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', padding: '0.55rem', borderRadius: '12px', color: '#090d16', fontWeight: 900 } }, '📈'),
                h('div', null,
                  h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' } },
                    h('h1', { className: 'gradient-text', style: { fontSize: '1.3rem', fontWeight: 800 } }, 'StockMind AI 智能對話股票篩選器'),
                    h('span', { className: 'pill-badge pill-emerald' }, `全台股 ${stockCount} 檔連線 (${lastSync})`)
                  ),
                  h('p', { style: { fontSize: '0.78rem', color: 'var(--text-secondary)' } }, '玩股網三大面向（基本面/技術面/籌碼面）全台股 1,300+ 檔標的即時對話篩選系統')
                )
              ),
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' } },
                h('div', { style: { background: 'var(--bg-input)', padding: '3px', borderRadius: '8px', display: 'flex', gap: '2px' } },
                  [{ id: 'ALL', label: '全市場' }, { id: 'TW', label: '台股 (1,300+)' }, { id: 'US', label: '美股' }].map(m =>
                    h('button', {
                      key: m.id,
                      onClick: () => setActiveMarket(m.id),
                      style: {
                        background: activeMarket === m.id ? 'var(--accent-emerald)' : 'transparent',
                        color: activeMarket === m.id ? '#090d16' : 'var(--text-secondary)',
                        border: 'none', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: activeMarket === m.id ? 700 : 500, cursor: 'pointer'
                      }
                    }, m.label)
                  )
                ),
                h('input', {
                  type: 'text',
                  placeholder: '搜尋代號 / 名稱 (2330)...',
                  value: searchTerm,
                  onChange: (e) => setSearchTerm(e.target.value),
                  style: { background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.4rem 0.75rem', color: '#fff', fontSize: '0.82rem', width: '170px', outline: 'none' }
                }),
                h('button', { onClick: () => setIsPortfolioOpen(true), className: 'btn-secondary', style: { fontSize: '0.8rem', border: '1px solid rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.12)' } }, '💼 AI 組合配置'),
                h('button', { onClick: () => { if(compareList.length===0) alert('請先在卡片點擊對比按鈕'); else setIsCompareOpen(true); }, className: 'btn-secondary', style: { fontSize: '0.8rem' } }, `⚖️ 對比 (${compareList.length})`),
                h('button', { onClick: () => setIsWatchlistOpen(true), className: 'btn-primary', style: { fontSize: '0.8rem' } }, `⭐ 觀察名單 (${watchlist.length})`)
              )
            )
          ),

          // Main Layout
          h('div', null,

            // Floating Chat Window - Always visible on bottom left
            h('div', { className: `floating-chat-widget ${isChatMinimized ? 'minimized' : ''}` },
              h('div', {
                style: {
                  padding: '0.75rem 1rem',
                  background: 'rgba(15, 23, 42, 0.95)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  cursor: 'pointer'
                },
                onClick: () => setIsChatMinimized(!isChatMinimized)
              },
                h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
                  h('span', { style: { fontSize: '1rem' } }, '🤖'),
                  h('strong', { style: { fontSize: '0.9rem', color: 'var(--text-primary)' } }, 'AI 投資特助選股'),
                  h('span', { className: 'pill-badge pill-emerald', style: { fontSize: '0.65rem' } }, '畫面常駐')
                ),
                h('button', {
                  onClick: (e) => { e.stopPropagation(); setIsChatMinimized(!isChatMinimized); },
                  style: { background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }
                }, isChatMinimized ? '展開對話' : '縮小視窗')
              ),

              !isChatMinimized && h(React.Fragment, null,
                h('div', { style: { padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '0.35rem', overflowX: 'auto', background: 'rgba(15, 23, 42, 0.6)' } },
                  strategyPresets.map(p =>
                    h('button', {
                      key: p.id,
                      onClick: () => handleSend(p.prompt),
                      style: { background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', borderRadius: '99px', padding: '0.2rem 0.55rem', color: '#fff', fontSize: '0.72rem', whiteSpace: 'nowrap', cursor: 'pointer' }
                    }, `${p.icon} ${p.title}`)
                  )
                ),

                parsedTags.length > 0 && h('div', { style: { padding: '0.4rem 0.75rem', background: 'rgba(6, 182, 212, 0.12)', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', fontSize: '0.72rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' } },
                  h('span', { style: { color: 'var(--accent-cyan)', fontWeight: 700 } }, '解析條件：'),
                  parsedTags.map((t, idx) => h('span', { key: idx, className: 'pill-badge pill-cyan' }, t))
                ),

                h('div', { style: { flex: 1, padding: '0.85rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' } },
                  messages.map((m, i) =>
                    h('div', { key: i, style: { alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%' } },
                      h('div', {
                        style: {
                          padding: '0.65rem 0.85rem',
                          borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                          background: m.sender === 'user' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'rgba(21, 29, 48, 0.95)',
                          border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                          fontSize: '0.82rem', lineHeight: 1.5, whiteSpace: 'pre-line', color: '#fff'
                        }
                      },
                        m.text,
                        m.topStocks && h('div', { style: { marginTop: '0.4rem', paddingTop: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.3rem', flexWrap: 'wrap' } },
                          m.topStocks.map(s => h('span', { key: s.ticker, className: 'pill-badge pill-emerald' }, `${s.name} (${s.ticker}) • ${s.matchScore}%`))
                        )
                      )
                    )
                  ),
                  isProcessing && h('div', { style: { color: 'var(--accent-emerald)', fontSize: '0.78rem' } }, 'AI 正在分析大數據中...'),
                  h('div', { ref: messagesEndRef })
                ),

                h('div', { style: { padding: '0.65rem 0.75rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(13, 19, 34, 0.95)', display: 'flex', gap: '0.4rem' } },
                  h('textarea', {
                    rows: 2,
                    placeholder: '輸入選股訴求（按右側「送出」按鈕進行篩選）...',
                    value: inputText,
                    onChange: (e) => setInputText(e.target.value),
                    onKeyDown: (e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                        e.preventDefault();
                        handleSend();
                      }
                    },
                    style: { flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.5rem 0.75rem', color: '#fff', fontSize: '0.82rem', outline: 'none', resize: 'none' }
                  }),
                  h('button', { onClick: () => handleSend(), className: 'btn-primary', style: { padding: '0.5rem 0.85rem', fontSize: '0.8rem', alignSelf: 'flex-end', height: 'fit-content' } }, '送出')
                )
              )
            ),

            // Right Main Column
            h('div', null,
              h('div', { className: 'glass-panel', style: { padding: '1.2rem', marginBottom: '1.25rem' } },
                h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' } },
                  h('span', { style: { fontWeight: 700, fontSize: '0.95rem' } }, '⚙️ 玩股網飆股選股模型 (三大面向)'),
                  h('button', { onClick: () => setFilters({ minYield: 0, maxPe: null, minRoe: 0, minRevenueGrowth: 0, sector: 'ALL' }), style: { background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' } }, '重置所有條件')
                ),
                h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' } },
                  h('div', null,
                    h('div', { style: { fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between' } },
                      h('span', null, '最低殖利率:'),
                      h('strong', { style: { color: 'var(--accent-emerald)' } }, filters.minYield > 0 ? `${filters.minYield}%` : '不限')
                    ),
                    h('input', { type: 'range', min: '0', max: '8', step: '0.5', value: filters.minYield || 0, onChange: (e) => setFilters(f => ({ ...f, minYield: parseFloat(e.target.value) })) })
                  ),
                  h('div', null,
                    h('div', { style: { fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between' } },
                      h('span', null, '最高本益比:'),
                      h('strong', { style: { color: 'var(--accent-cyan)' } }, filters.maxPe ? `${filters.maxPe} 倍以下` : '不限')
                    ),
                    h('input', { type: 'range', min: '8', max: '60', step: '2', value: filters.maxPe || 60, onChange: (e) => setFilters(f => ({ ...f, maxPe: parseFloat(e.target.value) === 60 ? null : parseFloat(e.target.value) })) })
                  ),
                  h('div', null,
                    h('div', { style: { fontSize: '0.78rem', marginBottom: '0.2rem' } }, '產業類別篩選:'),
                    h('select', {
                      value: filters.sector || 'ALL',
                      onChange: (e) => setFilters(f => ({ ...f, sector: e.target.value })),
                      style: { width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#fff', fontSize: '0.8rem' }
                    },
                      h('option', { value: 'ALL' }, `全部產業 (${currentStocks.length} 檔)`),
                      h('option', { value: '電子/半導體/AI' }, '電子 / 半導體 / AI'),
                      h('option', { value: '金融保險' }, '金融保險'),
                      h('option', { value: 'ETF 基金' }, 'ETF 基金'),
                      h('option', { value: '一般產業' }, '一般綜合產業')
                    )
                  ),
                  h('div', null,
                    h('div', { style: { fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between' } },
                      h('span', null, '最低 ROE:'),
                      h('strong', { style: { color: 'var(--accent-purple)' } }, filters.minRoe > 0 ? `${filters.minRoe}%` : '不限')
                    ),
                    h('input', { type: 'range', min: '0', max: '30', step: '2', value: filters.minRoe || 0, onChange: (e) => setFilters(f => ({ ...f, minRoe: parseFloat(e.target.value) })) })
                  )
                )
              ),

              h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' } },
                h('span', { style: { fontWeight: 700 } }, `篩選結果：共 ${screenedStocks.length} 檔符合條件`),
                h('select', { value: sortBy, onChange: (e) => setSortBy(e.target.value), style: { background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' } },
                  h('option', { value: 'matchScore' }, '🎯 AI 匹配度最高'),
                  h('option', { value: 'yield' }, '💰 殖利率最高'),
                  h('option', { value: 'pe' }, '💎 本益比最低'),
                  h('option', { value: 'roe' }, '⚡ ROE 最高')
                )
              ),

              // Stock Grid
              h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1rem' } },
                displayedStocks.map(stock =>
                  h('div', { key: stock.ticker, className: 'glass-panel-interactive', style: { padding: '1.1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } },
                    h('div', null,
                      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } },
                        h('div', null,
                          h('span', { style: { fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' } }, stock.ticker),
                          h('span', { className: 'pill-badge pill-emerald', style: { marginLeft: '0.4rem', fontSize: '0.65rem' } }, stock.market),
                          h('span', { className: 'pill-badge pill-purple', style: { marginLeft: '0.2rem', fontSize: '0.65rem' } }, stock.sector || '台股'),
                          h('h3', { style: { fontSize: '1.05rem', fontWeight: 800, marginTop: '0.2rem' } }, stock.name)
                        ),
                        h('span', { className: 'pill-badge pill-cyan', style: { fontSize: '0.85rem', fontWeight: 800 } }, `${stock.matchScore}% 匹配`)
                      ),
                      h('div', { style: { fontSize: '1.35rem', fontWeight: 800, margin: '0.6rem 0 0.8rem', fontFamily: 'var(--font-mono)' } },
                        `${stock.currency === 'USD' ? '$' : 'NT$'}${formatNum(stock.price)}`,
                        h('span', { style: { fontSize: '0.78rem', marginLeft: '0.4rem', color: (stock.changePercent || 0) >= 0 ? '#34d399' : '#f87171' } }, `(${(stock.changePercent || 0) >= 0 ? '+' : ''}${stock.changePercent || 0}%)`)
                      ),
                      h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', padding: '0.5rem', background: 'rgba(15,23,42,0.7)', borderRadius: '6px', fontSize: '0.75rem', marginBottom: '0.75rem' } },
                        h('div', null, '殖利率: ', h('strong', { style: { color: 'var(--accent-emerald)' } }, `${stock.yield || '-'}%`)),
                        h('div', null, '本益比: ', h('strong', { style: { color: 'var(--accent-cyan)' } }, `${stock.pe || '-'}x`)),
                        h('div', null, 'ROE: ', h('strong', { style: { color: 'var(--accent-purple)' } }, `${stock.roe || '-'}%`)),
                        h('div', null, 'P/B: ', h('strong', { style: { color: 'var(--accent-gold)' } }, `${stock.pb || '-'}x`))
                      ),
                      h('p', { style: { fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, height: '2.8em', overflow: 'hidden' } }, stock.summary || `${stock.name} 今日最新成交價 ${stock.price} 元。`)
                    ),
                    h('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-subtle)' } },
                      h('div', { style: { display: 'flex', gap: '0.3rem' } },
                        h('button', { onClick: () => toggleWatchlist(stock), className: 'btn-icon', title: '收藏' }, watchlist.some(s => s.ticker === stock.ticker) ? '⭐' : '☆'),
                        h('button', { onClick: () => toggleCompare(stock), className: 'btn-icon', title: '對比' }, '⚖️')
                      ),
                      h('button', { onClick: () => setSelectedStock(stock), className: 'btn-primary', style: { padding: '0.35rem 0.75rem', fontSize: '0.75rem' } }, '詳細分析')
                    )
                  )
                )
              ),

              screenedStocks.length > displayLimit && h('div', { style: { textAlign: 'center', marginTop: '1.5rem' } },
                h('button', { onClick: () => setDisplayLimit(prev => prev + 36), className: 'btn-secondary', style: { padding: '0.6rem 2rem', fontSize: '0.85rem' } }, `載入更多標的 (還有 ${screenedStocks.length - displayLimit} 檔)...`)
              )
            )
          ),

          // Watchlist Drawer Modal
          isWatchlistOpen && h('div', { style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,8,16,0.75)', backdropFilter: 'blur(8px)', zIndex: 1200, display: 'flex', justifyContent: 'flex-end' } },
            h('div', { className: 'glass-panel', style: { width: '380px', height: '100%', borderRadius: 0, padding: '1.5rem', display: 'flex', flexDirection: 'column' } },
              h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' } },
                h('h3', { style: { fontWeight: 800, fontSize: '1.1rem' } }, `⭐ 我的自訂觀察名單 (${watchlist.length})`),
                h('button', { onClick: () => setIsWatchlistOpen(false), className: 'btn-icon' }, '✕')
              ),
              watchlist.length === 0 ? h('div', { style: { color: 'var(--text-muted)', textAlign: 'center', marginTop: '3rem', fontSize: '0.9rem' } }, '目前尚未收藏任何標的') :
              h('div', { style: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' } },
                watchlist.map(s =>
                  h('div', { key: s.ticker, className: 'glass-panel', style: { padding: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                    h('div', null,
                      h('div', { style: { fontWeight: 700, fontSize: '0.92rem' } }, `${s.name} (${s.ticker})`),
                      h('div', { style: { fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' } }, `現價: ${s.currency==='USD'?'$':'NT$'}${formatNum(s.price)} • PE: ${s.pe || '-'}x • 殖利率: ${s.yield || '-'}%`)
                    ),
                    h('button', { onClick: () => toggleWatchlist(s), style: { background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#fb7185', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer' } }, '移除')
                  )
                )
              ),
              h('div', { style: { marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' } },
                h('button', { onClick: () => { if(confirm('確定要清空觀察名單嗎？')) setWatchlist([]); }, className: 'btn-secondary', style: { fontSize: '0.75rem' } }, '清空名單'),
                h('button', { onClick: () => setIsWatchlistOpen(false), className: 'btn-primary', style: { fontSize: '0.8rem' } }, '關閉')
              )
            )
          ),

          // Compare Modal
          isCompareOpen && h('div', { style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '1rem' } },
            h('div', { className: 'glass-panel', style: { width: '100%', maxWidth: '800px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' } },
              h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' } },
                h('h2', { style: { fontSize: '1.2rem', fontWeight: 800 } }, `⚖️ 多股指標橫向對比 (${compareList.length} 檔)`),
                h('button', { onClick: () => setIsCompareOpen(false), className: 'btn-icon' }, '✕')
              ),
              h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'center' } },
                h('thead', null,
                  h('tr', { style: { borderBottom: '1px solid var(--border-subtle)', background: 'rgba(15,23,42,0.7)' } },
                    h('th', { style: { textAlign: 'left', padding: '0.6rem' } }, '指標'),
                    compareList.map(s => h('th', { key: s.ticker, style: { padding: '0.6rem' } }, s.name))
                  )
                ),
                h('tbody', null,
                  h('tr', { style: { borderBottom: '1px solid var(--border-subtle)' } },
                    h('td', { style: { textAlign: 'left', padding: '0.6rem' } }, '股價'),
                    compareList.map(s => h('td', { key: s.ticker, style: { fontWeight: 800 } }, `${s.currency==='USD'?'$':'NT$'}${formatNum(s.price)}`))
                  ),
                  h('tr', { style: { borderBottom: '1px solid var(--border-subtle)' } },
                    h('td', { style: { textAlign: 'left', padding: '0.6rem' } }, '殖利率'),
                    compareList.map(s => h('td', { key: s.ticker, style: { color: 'var(--accent-emerald)', fontWeight: 700 } }, `${s.yield || '-'}%`))
                  ),
                  h('tr', { style: { borderBottom: '1px solid var(--border-subtle)' } },
                    h('td', { style: { textAlign: 'left', padding: '0.6rem' } }, '本益比'),
                    compareList.map(s => h('td', { key: s.ticker, style: { color: 'var(--accent-cyan)', fontWeight: 700 } }, `${s.pe || '-'} 倍`))
                  ),
                  h('tr', { style: { borderBottom: '1px solid var(--border-subtle)' } },
                    h('td', { style: { textAlign: 'left', padding: '0.6rem' } }, 'ROE'),
                    compareList.map(s => h('td', { key: s.ticker, style: { color: 'var(--accent-purple)', fontWeight: 700 } }, `${s.roe || '-'}%`))
                  )
                )
              ),
              h('div', { style: { marginTop: '1.2rem', textAlign: 'right' } },
                h('button', { onClick: () => setIsCompareOpen(false), className: 'btn-secondary' }, '關閉視窗')
              )
            )
          ),

          // Detail Modal
          selectedStock && h('div', { style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' } },
            h('div', { className: 'glass-panel', style: { width: '100%', maxWidth: '640px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' } },
              h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' } },
                h('div', null,
                  h('span', { style: { fontSize: '0.8rem', color: 'var(--accent-cyan)' } }, `${selectedStock.ticker} • ${selectedStock.market} • ${selectedStock.sector}`),
                  h('h2', { style: { fontSize: '1.4rem', fontWeight 800 } }, selectedStock.name)
                ),
                h('button', { onClick: () => setSelectedStock(null), className: 'btn-icon' }, '✕')
              ),
              h('div', { style: { background: 'rgba(15,23,42,0.8)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(16,185,129,0.3)' } },
                h('h4', { style: { color: 'var(--accent-emerald)', fontSize: '0.9rem', marginBottom: '0.4rem' } }, '🤖 AI 投資點評：'),
                h('p', { style: { fontSize: '0.85rem', lineHeight: 1.6 } }, selectedStock.aiCommentary || `${selectedStock.name} 今日成交價 ${selectedStock.price} 元。`)
              ),
              h('button', { onClick: () => setSelectedStock(null), className: 'btn-primary', style: { width: '100%' } }, '關閉視窗')
            )
          )
        );
      }

      ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
    </script>
  </body>
</html>"""

with open('index.html', 'wb') as f:
    f.write(html_content.encode('utf-8'))

print('Clean index.html created successfully!')
