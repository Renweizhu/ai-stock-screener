
      (function() {
        const { useState, useMemo, useEffect, useRef, createElement: h } = React;

        // GLOBAL FULL-WIDTH TO HALF-WIDTH TEXT NORMALIZER
        function normalizeText(str) {
          if (!str) return "";
          return str
            .replace(/[\uFF01-\uFF5E]/g, function(ch) {
              return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
            })
            .replace(/\u3000/g, ' ')
            .toLowerCase();
        }

        function formatNum(val) {
          if (val === null || val === undefined || isNaN(val)) return '0';
          return Number(val).toLocaleString();
        }

        const INITIAL_STOCKS = [
          // ETFs
          {
            ticker: "0050",
            name: "元大台灣50 (ETF)",
            market: "TW",
            currency: "NTD",
            sector: "ETF 基金",
            price: 195.5,
            changePercent: 1.25,
            pe: 22.4,
            pb: 2.85,
            yield: 3.2,
            roe: 18.5,
            revenueGrowth: 15.4,
            eps: 8.5,
            maAlign: true,
            breakMa60: true,
            breakMa20: true,
            volumeBurst: true,
            kdCross: true,
            rsiStrong: true,
            macdRed: true,
            institutionalBuy: true,
            foreignBuy: true,
            investmentTrustBuy: true,
            largeHolders: true,
            mainConcentration: true,
            summary: "台灣市值型 ETF 龍頭，涵蓋全台前 50 大市值藍籌龍頭企業。",
            aiCommentary: "長期投資首選，參與台灣核心半導體與科技股成長動能。"
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
            eps: 3.5,
            maAlign: true,
            breakMa60: true,
            breakMa20: true,
            volumeBurst: false,
            kdCross: true,
            rsiStrong: false,
            macdRed: true,
            institutionalBuy: true,
            foreignBuy: false,
            investmentTrustBuy: true,
            largeHolders: true,
            mainConcentration: true,
            summary: "高股息 ETF 始祖，嚴選預估未來殖利率最高優質標的。",
            aiCommentary: "殖利率高達 6.8%，三大法人長期穩定增持，現金流避風港。"
          },
          {
            ticker: "00878",
            name: "國泰永續高股息 (ETF)",
            market: "TW",
            currency: "NTD",
            sector: "ETF 基金",
            price: 23.85,
            changePercent: 0.84,
            pe: 14.2,
            pb: 1.55,
            yield: 6.5,
            roe: 14.2,
            revenueGrowth: 9.2,
            eps: 1.65,
            maAlign: true,
            breakMa60: true,
            breakMa20: true,
            volumeBurst: false,
            kdCross: true,
            rsiStrong: false,
            macdRed: true,
            institutionalBuy: true,
            foreignBuy: true,
            investmentTrustBuy: true,
            largeHolders: true,
            mainConcentration: true,
            summary: "國民人氣高股息 ETF，結合 ESG 永續篩選與季配息機制。",
            aiCommentary: "成分股兼具金融與電腦周邊，波動度相對低且股息穩健。"
          },
          {
            ticker: "00919",
            name: "群益台灣精選高息 (ETF)",
            market: "TW",
            currency: "NTD",
            sector: "ETF 基金",
            price: 25.10,
            changePercent: 1.15,
            pe: 11.5,
            pb: 1.38,
            yield: 9.8,
            roe: 16.8,
            revenueGrowth: 18.2,
            eps: 2.2,
            maAlign: true,
            breakMa60: true,
            breakMa20: true,
            volumeBurst: true,
            kdCross: true,
            rsiStrong: true,
            macdRed: true,
            institutionalBuy: true,
            foreignBuy: true,
            investmentTrustBuy: true,
            largeHolders: true,
            mainConcentration: true,
            summary: "精準宣告股利高息 ETF，連續多季維持高年化配息率。",
            aiCommentary: "年化殖利率接近 10%，深受領息族與退休族喜愛。"
          },
          // Individual TW & US Stocks
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
            eps: 42.5,
            maAlign: true,
            breakMa60: true,
            breakMa20: true,
            volumeBurst: true,
            kdCross: true,
            rsiStrong: true,
            macdRed: true,
            institutionalBuy: true,
            foreignBuy: true,
            investmentTrustBuy: true,
            largeHolders: true,
            mainConcentration: true,
            summary: "全球晶圓代工霸主，握有 3nm/2nm 先進製程與 CoWoS 封裝霸權。",
            aiCommentary: "基本面極強 ROE>28%，技術面均線多頭排列且三大法人連續買超。"
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
            eps: 12.3,
            maAlign: true,
            breakMa60: true,
            breakMa20: true,
            volumeBurst: true,
            kdCross: true,
            rsiStrong: true,
            macdRed: true,
            institutionalBuy: true,
            foreignBuy: true,
            investmentTrustBuy: true,
            largeHolders: true,
            mainConcentration: true,
            summary: "全球電子代工巨擘，全力搶進 GB200 AI 伺服器頂規機櫃組裝。",
            aiCommentary: "Blackwell 伺服器出貨放量，本益比約 18 倍具估值與籌碼優勢。"
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
            eps: 69.4,
            maAlign: true,
            breakMa60: true,
            breakMa20: true,
            volumeBurst: false,
            kdCross: true,
            rsiStrong: true,
            macdRed: true,
            institutionalBuy: true,
            foreignBuy: true,
            investmentTrustBuy: false,
            largeHolders: false,
            mainConcentration: true,
            summary: "手機晶片巨頭，拓展天璣 AI 晶片與 ASIC 客製化晶片。",
            aiCommentary: "技術面突破季線，受惠邊緣 AI 與手機換機潮。"
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
            eps: 9.04,
            maAlign: true,
            breakMa60: true,
            breakMa20: true,
            volumeBurst: false,
            kdCross: false,
            rsiStrong: false,
            macdRed: true,
            institutionalBuy: true,
            foreignBuy: true,
            investmentTrustBuy: true,
            largeHolders: true,
            mainConcentration: true,
            summary: "台灣金控獲利王，富邦人壽與銀行獲利創新高。",
            aiCommentary: "低波防禦屬性強，獲利穩定適合避險與存股。"
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
            eps: 6.3,
            maAlign: true,
            breakMa60: true,
            breakMa20: true,
            volumeBurst: false,
            kdCross: true,
            rsiStrong: false,
            macdRed: true,
            institutionalBuy: true,
            foreignBuy: true,
            investmentTrustBuy: true,
            largeHolders: true,
            mainConcentration: true,
            summary: "資產規模第一大金控，兼具銀行淨利息與壽險收益。",
            aiCommentary: "法人持續買超加碼，配息穩定。"
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
            eps: 13.2,
            maAlign: true,
            breakMa60: true,
            breakMa20: true,
            volumeBurst: true,
            kdCross: true,
            rsiStrong: true,
            macdRed: true,
            institutionalBuy: true,
            foreignBuy: true,
            investmentTrustBuy: true,
            largeHolders: true,
            mainConcentration: true,
            summary: "全球 AI 伺服器龍頭，握有美系雲端巨頭龐大機櫃訂單。",
            aiCommentary: "高殖利率 5.23% + 低本益比 15 倍，成交量爆發 2 倍突破季線！"
          },
          {
            ticker: "2603",
            name: "長榮 (Evergreen)",
            market: "TW",
            currency: "NTD",
            sector: "航運物流",
            price: 198.5,
            changePercent: 3.12,
            pe: 5.8,
            pb: 1.15,
            yield: 9.5,
            roe: 26.2,
            revenueGrowth: 35.4,
            eps: 32.1,
            maAlign: true,
            breakMa60: true,
            breakMa20: true,
            volumeBurst: true,
            kdCross: true,
            rsiStrong: true,
            macdRed: true,
            institutionalBuy: true,
            foreignBuy: true,
            investmentTrustBuy: true,
            largeHolders: true,
            mainConcentration: true,
            summary: "貨櫃航運龍頭，運價上漲帶動獲利爆發。",
            aiCommentary: "超高殖利率 9.5%、超低本益比 5.8 倍，技術籌碼雙重黃金交叉！"
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
            eps: 4.8,
            maAlign: true,
            breakMa60: true,
            breakMa20: true,
            volumeBurst: true,
            kdCross: true,
            rsiStrong: true,
            macdRed: true,
            institutionalBuy: true,
            foreignBuy: true,
            investmentTrustBuy: true,
            largeHolders: true,
            mainConcentration: true,
            summary: "全球 AI 革命總司令，GPU 晶片與 CUDA 壟斷 85%+ 市場。",
            aiCommentary: "極致高成長，營收三位數年增，技術籌碼完美多頭。"
          }
        ];

        const strategyPresets = [
          { id: "high-dividend", icon: "💰", title: "高股息存股", prompt: "幫我篩選全台股殖利率 4.5% 以上、穩定配息且法人買超的存股標的" },
          { id: "etf-investing", icon: "📊", title: "長期 ETF 投資組合", prompt: "幫我配置一組長期投資的 ETF 組合 (如 0050、0056、00878、00919)" },
          { id: "ai-growth", icon: "🚀", title: "玩股網飆股技術多頭", prompt: "幫我挑選突破 60 日季線、均線多頭排列 5MA>20MA>60MA 且成交量爆發 2 倍的飆股" },
          { id: "chip-main", icon: "🔥", title: "三大法人連買主力股", prompt: "幫我找三大法人連續買超且千張大戶持股比上升的籌碼強勢股" }
        ];

        // TRUE DYNAMIC & STRICT ENTITY INTENT ENGINE WITH FULL-WIDTH NORMALIZATION
        function computeDynamicPortfolio(stocksList, budget, strategy, rawQueryText) {
          let candidateStocks = [...stocksList];
          const query = normalizeText(rawQueryText);

          // 1. STRICT ENTITY INTENT FILTERING WITH FULL-WIDTH COMPATIBILITY
          const isEtfQuery = query.includes("etf") || query.includes("指數") || query.includes("基金");
          const isFinancialQuery = query.includes("金融") || query.includes("金控") || query.includes("銀行") || query.includes("壽險");
          const isTechQuery = query.includes("半導體") || query.includes("電子") || query.includes("ai") || query.includes("晶片");
          const isUsQuery = query.includes("美股");

          if (isEtfQuery) {
            candidateStocks = candidateStocks.filter(s => s.sector === 'ETF 基金' || normalizeText(s.name).includes('etf') || s.ticker.startsWith('00') || s.ticker === 'VOO' || s.ticker === 'QQQ');
            if (candidateStocks.length === 0) {
              candidateStocks = stocksList.filter(s => s.sector === 'ETF 基金' || s.ticker.startsWith('00'));
            }
          } else if (isFinancialQuery) {
            candidateStocks = candidateStocks.filter(s => s.sector === '金融保險' || s.ticker.startsWith('28'));
          } else if (isTechQuery) {
            candidateStocks = candidateStocks.filter(s => s.sector === '電子/半導體/AI' || s.market === 'US');
          } else if (isUsQuery) {
            candidateStocks = candidateStocks.filter(s => s.market === 'US');
          }

          // Fallback if candidate list becomes empty
          if (candidateStocks.length === 0) candidateStocks = [...stocksList];

          // 2. Dynamic Real-time Metric Ranking based on Strategy
          if (strategy === 'dividend' || query.includes("股息") || query.includes("配息") || query.includes("存股") || query.includes("高息")) {
            candidateStocks.sort((a, b) => (b.yield || 0) - (a.yield || 0) || (b.roe || 0) - (a.roe || 0));
          } else if (strategy === 'growth' || query.includes("飆股") || query.includes("成長") || query.includes("爆發")) {
            candidateStocks.sort((a, b) => (b.revenueGrowth || 0) - (a.revenueGrowth || 0) || (b.roe || 0) - (a.roe || 0));
          } else {
            candidateStocks.sort((a, b) => (b.roe || 0) - (a.roe || 0) || (b.yield || 0) - (a.yield || 0));
          }

          // 3. Pick TOP 4 Dynamic Stocks/ETFs
          let top4 = candidateStocks.slice(0, 4);

          while (top4.length < 4 && top4.length > 0) {
            top4.push({ ...top4[top4.length % candidateStocks.length] });
          }

          const weights = [0.35, 0.25, 0.20, 0.20];

          return top4.map((stock, idx) => {
            const weight = weights[idx] || 0.20;
            const allocAmount = Math.round(budget * weight);
            const unitPrice = stock.currency === 'USD' ? (stock.price * 32.5) : stock.price;
            const shares = unitPrice > 0 ? Math.floor(allocAmount / unitPrice) : 0;
            const expectedDividend = Math.round(allocAmount * ((stock.yield || 3.0) / 100));

            return {
              ...stock,
              weight,
              weightPct: `${Math.round(weight * 100)}%`,
              allocAmount,
              shares,
              expectedDividend
            };
          });
        }

        function parseQuery(rawText) {
          const query = normalizeText(rawText);
          const filters = {};
          const tags = [];

          if (query.includes("etf")) {
            filters.sector = "ETF 基金";
            tags.push("類型: 嚴選 ETF 基金");
          }
          if (query.includes("高股息") || query.includes("存股") || query.includes("領息") || query.includes("高息")) {
            filters.minYield = 4.5;
            tags.push("基本面: 殖利率 ≥ 4.5%");
          }
          if (query.includes("便宜") || query.includes("低估") || query.includes("價值")) {
            filters.maxPe = 16.0;
            tags.push("基本面: 本益比 ≤ 16倍");
          }
          if (query.includes("高獲利") || query.includes("roe")) {
            filters.minRoe = 15.0;
            tags.push("基本面: ROE ≥ 15%");
          }

          // Technical Indicators
          if (query.includes("突破季線") || query.includes("站上季線") || query.includes("季線")) {
            filters.techBreakMa60 = true;
            tags.push("技術面: 突破 60 日季線");
          }
          if (query.includes("多頭") || query.includes("均線") || query.includes("多頭排列")) {
            filters.techMaAlign = true;
            tags.push("技術面: 均線多頭排列 (5>20>60MA)");
          }

          // Chip Indicators
          if (query.includes("法人") || query.includes("外資") || query.includes("連買")) {
            filters.chipInstitutionalBuy = true;
            tags.push("籌碼面: 三大法人連續買超");
          }

          // Market & Sector
          if (query.includes("美股")) {
            filters.market = "US";
            tags.push("市場: 美股");
          } else if (query.includes("台股")) {
            filters.market = "TW";
            tags.push("市場: 台股");
          }

          return { filters, tags };
        }

        function calculateMatchScore(stock, filters) {
          let score = 100;
          if (filters.market && filters.market !== "ALL" && stock.market !== filters.market) return 0;
          if (filters.sector && filters.sector !== "ALL" && stock.sector !== filters.sector) return 0;

          // Fundamental checks
          if (filters.minYield > 0 && stock.yield < filters.minYield) score -= (filters.minYield - stock.yield) * 10;
          if (filters.maxPe > 0 && stock.pe > filters.maxPe) score -= (stock.pe - filters.maxPe) * 3;
          if (filters.minPb > 0 && stock.pb > filters.minPb) score -= (stock.pb - filters.minPb) * 15;
          if (filters.minRoe > 0 && stock.roe < filters.minRoe) score -= (filters.minRoe - stock.roe) * 2;
          if (filters.minRevenueGrowth > 0 && stock.revenueGrowth < filters.minRevenueGrowth) score -= (filters.minRevenueGrowth - stock.revenueGrowth) * 1.5;

          // Technical checks
          if (filters.techBreakMa60 && !stock.breakMa60) score -= 25;
          if (filters.techMaAlign && !stock.maAlign) score -= 30;

          // Chip checks
          if (filters.chipInstitutionalBuy && !stock.institutionalBuy) score -= 25;

          return Math.max(10, Math.min(99, Math.round(score)));
        }

        function App() {
          const [currentStocks, setCurrentStocks] = useState(INITIAL_STOCKS);
          const [stockCount, setStockCount] = useState(INITIAL_STOCKS.length);
          const [lastSync, setLastSync] = useState("連線中...");
          const [activeMarket, setActiveMarket] = useState('ALL');
          const [activeHotTab, setActiveHotTab] = useState('popular');
          const [searchTerm, setSearchTerm] = useState('');
          const [activeDimensionTab, setActiveDimensionTab] = useState('fundamental');
          const [isHotStocksModalOpen, setIsHotStocksModalOpen] = useState(false);
          const hotCarouselRef = React.useRef(null);

          const scrollHotCarousel = (direction) => {
            if (hotCarouselRef.current) {
              const scrollAmount = direction === 'left' ? -380 : 380;
              hotCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
          };

          const getFeaturedHotStocks = (stocks, category) => {
            if (!stocks || stocks.length === 0) return [];
            if (category === 'gainers') {
              return [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 6);
            }
            if (category === 'highYield') {
              return [...stocks].sort((a, b) => b.yield - a.yield).slice(0, 6);
            }
            if (category === 'aiEcosystem') {
              return stocks.filter(s => ['NVDA', '2330', 'MSFT', 'AVGO', '2382', '3231', 'QQQ', 'AMD'].includes(s.ticker)).slice(0, 6);
            }
            if (category === 'usGiants') {
              return stocks.filter(s => s.market === 'US').slice(0, 6);
            }
            // Default: Most popular hot tickers
            const popularTickers = ['2330', 'NVDA', '0050', 'AAPL', '00878', 'MSFT', '2603', 'TSLA'];
            const found = stocks.filter(s => popularTickers.includes(s.ticker));
            return found.length >= 4 ? found.slice(0, 6) : stocks.slice(0, 6);
          };

          const openStockDetail = (target) => {
            if (!target) return;
            if (typeof target === 'object' && target.name && target.price) {
              setSelectedStock(target);
              return;
            }
            const searchTicker = (typeof target === 'string' ? target : target.ticker || '').trim();
            const found = currentStocks.find(s => 
              s.ticker.toUpperCase() === searchTicker.toUpperCase() || 
              s.name.includes(searchTicker) || 
              searchTicker.includes(s.name) ||
              searchTicker.includes(s.ticker)
            );
            if (found) {
              setSelectedStock(found);
            } else if (typeof target === 'object') {
              setSelectedStock({
                ticker: target.ticker || 'N/A',
                name: target.name || searchTicker || '精選標的',
                price: target.price || 100,
                currency: target.currency || 'NTD',
                market: target.currency === 'USD' ? 'US' : 'TW',
                sector: target.sector || '精選個股',
                changePercent: target.changePercent || 0.0,
                yield: target.yield || 4.5,
                pe: target.pe || 18.0,
                pb: target.pb || 1.8,
                roe: target.roe || 15.0,
                summary: `${target.name || searchTicker} AI 即時對話推薦標的，營運基本面健全。`,
                aiCommentary: `${target.name || searchTicker} 為 AI 語意剖析推薦之高勝率標的。`
              });
            } else {
              setSelectedStock({
                ticker: searchTicker,
                name: searchTicker,
                price: 100,
                currency: 'NTD',
                market: 'TW',
                sector: '精選標的',
                changePercent: 0.0,
                yield: 4.5,
                pe: 18.0,
                pb: 1.8,
                roe: 15.0,
                summary: `${searchTicker} AI 即時對話推薦標的。`,
                aiCommentary: `${searchTicker} 為 AI 語意剖析推薦之優質標的。`
              });
            }
          const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
          const [portfolioBudget, setPortfolioBudget] = useState(1000000);
          const [portfolioStrategy, setPortfolioStrategy] = useState('balanced');
          const [selectedSavedPortfolio, setSelectedSavedPortfolio] = useState(null);
          
          const [savedPortfolios, setSavedPortfolios] = useState(() => {
            try {
              const saved = localStorage.getItem('stockmind_saved_portfolios');
              if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
              }
            } catch(e) {}
            return [];
          });

          useEffect(() => {
            try {
              localStorage.setItem('stockmind_saved_portfolios', JSON.stringify(savedPortfolios));
            } catch(e) {}
          }, [savedPortfolios]);

          const [filters, setFilters] = useState({
            minYield: 0,
            maxPe: null,
            minPb: null,
            minRoe: 0,
            minRevenueGrowth: 0,
            minEps: 0,
            sector: 'ALL',

            techBreakMa60: false,
            techBreakMa20: false,
            techMaAlign: false,
            techVolumeBurst: false,
            techKdCross: false,
            techRsiStrong: false,
            techMacdRed: false,

            chipInstitutionalBuy: false,
            chipForeignBuy: false,
            chipInvestmentTrustBuy: false,
            chipLargeHolders: false,
            chipMainConcentration: false
          });

          const [parsedTags, setParsedTags] = useState([]);
          const [displayLimit, setDisplayLimit] = useState(36);
          const [isChatMinimized, setIsChatMinimized] = useState(false);

          const [messages, setMessages] = useState([
            {
              sender: 'ai',
              text: '你好！我是 StockMind AI 股票與 ETF 投資特助。\n您可以直接輸入需求（如「配置 100 萬長期 ETF 組合」或「篩選高股息股票」），我將為您進行即時動態數據演算與配置！',
              badge: '✨ AI 投資助手'
            }
          ]);
          const [inputText, setInputText] = useState('');
          const [isProcessing, setIsProcessing] = useState(false);

          const [selectedStock, setSelectedStock] = useState(null);

          // Watchlist with LocalStorage safety
          const [watchlist, setWatchlist] = useState(() => {
            try {
              const saved = localStorage.getItem('stockmind_watchlist');
              if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
              }
            } catch (e) {}
            return [INITIAL_STOCKS[0], INITIAL_STOCKS[1]];
          });

          useEffect(() => {
            try {
              localStorage.setItem('stockmind_watchlist', JSON.stringify(watchlist));
            } catch (e) {}
          }, [watchlist]);

          const [compareList, setCompareList] = useState([]);
          const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
          const [isCompareOpen, setIsCompareOpen] = useState(false);

          const [sortBy, setSortBy] = useState('matchScore');
          const messagesEndRef = useRef(null);

          const fetchLiveStocks = async () => {
            try {
              const res = await fetch('/api/stocks');
              if (res.ok) {

return null;
}
})();