
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
          },
          {
            ticker: "GC=F",
            name: "黃金期貨 (Gold / GLD)",
            market: "COMMODITY",
            currency: "USD",
            sector: "全球原物料/貴金屬",
            price: 2450.5,
            changePercent: 1.15,
            pe: 0,
            pb: 0,
            yield: 0.0,
            roe: 18.5,
            revenueGrowth: 15.2,
            eps: 0,
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
            summary: "全球硬通貨與終極避險金屬，抗通膨與地緣政治風險防禦第一首選。",
            aiCommentary: "地緣政治風險與全球央行持續購金，長線具備極強抗通膨避險價值。"
          },
          {
            ticker: "CL=F",
            name: "WTI紐約原油期貨 (Crude Oil)",
            market: "COMMODITY",
            currency: "USD",
            sector: "全球原物料/能源",
            price: 76.85,
            changePercent: -0.45,
            pe: 0,
            pb: 0,
            yield: 0.0,
            roe: 16.2,
            revenueGrowth: 8.5,
            eps: 0,
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
            summary: "全球第一大工業血液與能源定價基準，反映全球宏觀經濟與產能調控。",
            aiCommentary: "供需緊繃與夏季用油旺季，地緣局勢緊張推升原油溢價空間。"
          },
          {
            ticker: "SI=F",
            name: "白銀期貨 (Silver / SLV)",
            market: "COMMODITY",
            currency: "USD",
            sector: "全球原物料/貴金屬",
            price: 28.35,
            changePercent: 2.15,
            pe: 0,
            pb: 0,
            yield: 0.0,
            roe: 20.1,
            revenueGrowth: 22.4,
            eps: 0,
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
            summary: "兼具貴金屬避險與太陽能光電、工業電子雙重強勁需求。",
            aiCommentary: "太陽能光電與 AI 硬體需求爆發，金銀比回歸帶動白銀補漲動能。"
          },
          {
            ticker: "HG=F",
            name: "黃銅期貨 (Copper / COPX)",
            market: "COMMODITY",
            currency: "USD",
            sector: "全球原物料/工業金屬",
            price: 4.15,
            changePercent: 1.42,
            pe: 0,
            pb: 0,
            yield: 0.0,
            roe: 17.8,
            revenueGrowth: 14.5,
            eps: 0,
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
            summary: "「銅博士」全球景氣風向球，AI 資料中心電網升級與綠能轉型核心導線。",
            aiCommentary: "全球 AI 資料中心電力需求與電網升級，銅礦長期面臨結構性供不應求。"
          },
          {
            ticker: "NG=F",
            name: "天然氣期貨 (Natural Gas)",
            market: "COMMODITY",
            currency: "USD",
            sector: "全球原物料/能源",
            price: 2.15,
            changePercent: 3.25,
            pe: 0,
            pb: 0,
            yield: 0.0,
            roe: 12.5,
            revenueGrowth: 6.8,
            eps: 0,
            maAlign: false,
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
            summary: "全球清潔能源與發電主力燃料，受季節性氣候與庫存影響顯著。",
            aiCommentary: "庫存回升與夏季電網用量激增，低檔具備反彈補漲潛力。"
          },
          {
            ticker: "GLD",
            name: "SPDR 黃金現貨 ETF (GLD)",
            market: "COMMODITY",
            currency: "USD",
            sector: "全球原物料/貴金屬",
            price: 226.4,
            changePercent: 1.05,
            pe: 0,
            pb: 0,
            yield: 0.0,
            roe: 15.0,
            revenueGrowth: 12.0,
            eps: 0,
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
            summary: "全球資產規模最大的黃金現貨 ETF，流動性極佳。",
            aiCommentary: "法人資產配置必備，對衝地緣衝突與信用貨幣貶值風險。"
          },
          {
            ticker: "DBA",
            name: "Invesco 農產品 ETF (DBA)",
            market: "COMMODITY",
            currency: "USD",
            sector: "全球原物料/農產品",
            price: 24.55,
            changePercent: 0.65,
            pe: 0,
            pb: 0,
            yield: 2.1,
            roe: 11.5,
            revenueGrowth: 7.2,
            eps: 0,
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
            summary: "追蹤玉米、小麥、黃豆與糖等全球核心糧食大宗商品期貨。",
            aiCommentary: "極端氣候干擾農作物產能，提供民生通膨避險防禦。"
          },
          {
            ticker: "URA",
            name: "Global X 鈾礦核能 ETF (URA)",
            market: "COMMODITY",
            currency: "USD",
            sector: "全球原物料/核能金屬",
            price: 28.85,
            changePercent: 3.45,
            pe: 28.5,
            pb: 2.1,
            yield: 1.85,
            roe: 18.2,
            revenueGrowth: 28.5,
            eps: 1.0,
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
            summary: "追蹤全球鈾礦開採與核能發電設施，AI 資料中心基載電力首選。",
            aiCommentary: "科技巨頭採購核能為 AI 數據中心供電，鈾礦迎來強勁牛市需求。"
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

          // 1. STRICT ENTITY & MARKET INTENT FILTERING WITH FULL-WIDTH COMPATIBILITY
          const isEtfQuery = query.includes("etf") || query.includes("指數") || query.includes("基金");
          const isFinancialQuery = query.includes("金融") || query.includes("金控") || query.includes("銀行") || query.includes("壽險");
          const isTechQuery = query.includes("半導體") || query.includes("電子") || query.includes("ai") || query.includes("晶片");
          const isUsQuery = query.includes("美股") || query.includes("美國") || query.includes("海外") || query.includes("美元");
          const isTwQuery = query.includes("台股") || query.includes("台灣") || query.includes("國內") || query.includes("台幣");
          const isCommodityQuery = query.includes("黃金") || query.includes("原油") || query.includes("石油") || query.includes("白銀") || query.includes("銅") || query.includes("天然氣") || query.includes("原物料") || query.includes("避險") || query.includes("大宗物資") || query.includes("農產品") || query.includes("金屬") || query.includes("鈾");

          let targetMarket = "ALL";
          if (isTwQuery) targetMarket = "TW";
          else if (isUsQuery) targetMarket = "US";
          else if (isCommodityQuery) targetMarket = "COMMODITY";

          if (targetMarket === "TW") {
            candidateStocks = candidateStocks.filter(s => s.market === 'TW');
          } else if (targetMarket === "US") {
            candidateStocks = candidateStocks.filter(s => s.market === 'US');
          } else if (targetMarket === "COMMODITY") {
            candidateStocks = candidateStocks.filter(s => s.market === 'COMMODITY' || (s.sector && s.sector.includes('原物料')));
          }

          if (isEtfQuery) {
            candidateStocks = candidateStocks.filter(s => s.sector === 'ETF 基金' || normalizeText(s.name).includes('etf') || s.ticker.startsWith('00') || s.ticker === 'VOO' || s.ticker === 'QQQ' || s.ticker === 'GLD' || s.ticker === 'USO' || s.ticker === 'DBA');
            if (candidateStocks.length === 0) {
              candidateStocks = stocksList.filter(s => (targetMarket === 'ALL' || s.market === targetMarket) && (s.sector === 'ETF 基金' || s.ticker.startsWith('00')));
            }
          } else if (isFinancialQuery) {
            candidateStocks = candidateStocks.filter(s => s.sector === '金融保險' || s.ticker.startsWith('28'));
          } else if (isTechQuery) {
            if (targetMarket === 'TW') {
              candidateStocks = candidateStocks.filter(s => s.sector === '電子/半導體/AI' && s.market === 'TW');
            } else if (targetMarket === 'US') {
              candidateStocks = candidateStocks.filter(s => s.market === 'US');
            } else {
              candidateStocks = candidateStocks.filter(s => s.sector === '電子/半導體/AI' || s.market === 'US');
            }
          }

          // Fallback if candidate list becomes empty
          if (candidateStocks.length === 0) {
            candidateStocks = targetMarket === 'ALL' ? [...stocksList] : stocksList.filter(s => s.market === targetMarket || (targetMarket === 'COMMODITY' && s.sector && s.sector.includes('原物料')));
          }

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
          if (query.includes("黃金") || query.includes("原油") || query.includes("原物料") || query.includes("白銀") || query.includes("天然氣") || query.includes("大宗物資")) {
            filters.market = "COMMODITY";
            tags.push("市場範疇: 全球原物料與大宗商品 (Commodities)");
          } else if (query.includes("台股") || query.includes("台灣") || query.includes("國內") || query.includes("台幣")) {
            filters.market = "TW";
            tags.push("市場範疇: 台灣股市 (TWSE)");
          } else if (query.includes("美股") || query.includes("美國") || query.includes("海外") || query.includes("美元")) {
            filters.market = "US";
            tags.push("市場範疇: 美國股市 (US)");
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
            if (category === 'commodities') {
              return stocks.filter(s => s.market === 'COMMODITY' || (s.sector && s.sector.includes('原物料'))).slice(0, 6);
            }
            if (category === 'aiEcosystem') {
              return stocks.filter(s => ['NVDA', '2330', 'MSFT', 'AVGO', '2382', '3231', 'QQQ', 'AMD'].includes(s.ticker)).slice(0, 6);
            }
            if (category === 'usGiants') {
              return stocks.filter(s => s.market === 'US').slice(0, 6);
            }
            // Default: Most popular hot tickers
            const popularTickers = ['GC=F', '2330', 'NVDA', 'CL=F', '0050', 'AAPL', 'GLD', '00878', 'MSFT', '2603', 'TSLA'];
            const found = stocks.filter(s => popularTickers.includes(s.ticker));
            return found.length >= 4 ? found.slice(0, 6) : stocks.slice(0, 6);
          };

          const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
          const [customPortfolioItems, setCustomPortfolioItems] = useState(null);
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
          const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');

          const llmModels = [
            { id: 'gemini-1.5-flash', label: '⚡ Gemini 1.5 Flash (預設極速)' },
            { id: 'gemini-1.5-pro', label: '🧠 Gemini 1.5 Pro (長推理)' },
            { id: 'gpt-4o', label: '🤖 OpenAI GPT-4o (頂級量化)' },
            { id: 'gpt-4o-mini', label: '⚡ GPT-4o Mini (極速輕量)' },
            { id: 'claude-3-5-sonnet', label: '🎭 Claude 3.5 Sonnet (機構研報)' },
            { id: 'llama-3-70b', label: '🦙 Meta Llama 3 70B (開源財經)' },
            { id: 'deepseek-r1', label: '🔍 DeepSeek R1 (深度推理引擎)' }
          ];

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
          };

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
              const q = normalizeText(searchTerm);
              list = list.filter(s => normalizeText(s.name).includes(q) || normalizeText(s.ticker).includes(q) || (s.sector && normalizeText(s.sector).includes(q)));
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

          // Dynamic Active Portfolio Items calculation using current live stocks & normalized intent!
          const activePortfolioItems = useMemo(() => {
            if (customPortfolioItems && customPortfolioItems.length > 0) {
              const totalWeight = customPortfolioItems.reduce((acc, curr) => acc + (curr.weight || 0.25), 0) || 1.0;
              return customPortfolioItems.map(item => {
                const weight = (item.weight || 0.25) / totalWeight;
                const allocAmount = Math.round(portfolioBudget * weight);
                const unitPrice = item.currency === 'USD' ? (item.price * 32.5) : item.price;
                const shares = unitPrice > 0 ? Math.floor(allocAmount / unitPrice) : 0;
                const expectedDividend = Math.round(allocAmount * ((item.yield || 3.0) / 100));
                return {
                  ...item,
                  weight,
                  weightPct: `${Math.round(weight * 100)}%`,
                  allocAmount,
                  shares,
                  expectedDividend
                };
              });
            }
            return computeDynamicPortfolio(currentStocks, portfolioBudget, portfolioStrategy, "");
          }, [currentStocks, portfolioBudget, portfolioStrategy, customPortfolioItems]);

          const portfolioStats = useMemo(() => {
            const totalAlloc = activePortfolioItems.reduce((acc, curr) => acc + curr.allocAmount, 0);
            const totalDividend = activePortfolioItems.reduce((acc, curr) => acc + curr.expectedDividend, 0);
            const avgYield = totalAlloc > 0 ? (totalDividend / totalAlloc * 100).toFixed(2) : 0;
            const avgRoe = (activePortfolioItems.reduce((acc, curr) => acc + (curr.roe || 10) * curr.weight, 0)).toFixed(1);
            return { totalAlloc, totalDividend, avgYield, avgRoe };
          }, [activePortfolioItems]);

          const handleSaveCurrentPortfolio = () => {
            const defaultName = `我的 ${portfolioStrategy==='dividend'?'高股息':portfolioStrategy==='growth'?'AI飆股':'均衡價值'} 組合 (${(portfolioBudget/10000).toFixed(0)}萬)`;
            const name = prompt("請輸入此 AI 投資組合的名稱:", defaultName);
            if (name) {
              const newEntry = {
                id: Date.now(),
                name,
                budget: portfolioBudget,
                strategy: portfolioStrategy,
                date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                items: activePortfolioItems,
                stats: portfolioStats
              };
              setSavedPortfolios(prev => [newEntry, ...prev]);
              alert(`✅ 已成功儲存「${name}」！您可以隨時點擊下方列表開啟查看。`);
            }
          };

          const handleLoadSavedPortfolio = (portfolio) => {
            setSelectedSavedPortfolio(portfolio);
            setPortfolioBudget(portfolio.budget);
            setPortfolioStrategy(portfolio.strategy || 'balanced');
            setCustomPortfolioItems(portfolio.items || null);
          };

          const handleDeleteSavedPortfolio = (id, e) => {
            if (e) e.stopPropagation();
            if (confirm("確定要刪除這組投資組合紀錄嗎？")) {
              setSavedPortfolios(prev => prev.filter(p => p.id !== id));
              if (selectedSavedPortfolio && selectedSavedPortfolio.id === id) {
                setSelectedSavedPortfolio(null);
              }
            }
          };

          // Fully Dynamic AI Stock Screener Handler
          const handleSend = async (textOverride) => {
            const rawQuery = textOverride || inputText;
            if (!rawQuery.trim() || isProcessing) return;

            const userMsg = { sender: 'user', text: rawQuery };
            setMessages(prev => [...prev, userMsg]);
            if (!textOverride) setInputText('');
            setIsProcessing(true);

            // NORMALIZE FULL-WIDTH CHARACTERS TO HALF-WIDTH FOR PERFECT REGEX & NLP MATCHING
            const normalizedQuery = normalizeText(rawQuery);

            // 1. Detect Portfolio Intent & Budget with Full-Width Numbers Support
            let isPortfolioIntent = normalizedQuery.includes("組合") || normalizedQuery.includes("配置") || normalizedQuery.includes("比例") || normalizedQuery.includes("萬") || normalizedQuery.includes("配") || normalizedQuery.includes("etf");
            let detectedBudget = 1000000;
            const bMatch = normalizedQuery.match(/(\d+)\s*萬/);
            if (bMatch) {
              detectedBudget = parseInt(bMatch[1]) * 10000;
            }

            let detectedStrategy = 'balanced';
            if (normalizedQuery.includes("高股息") || normalizedQuery.includes("存股") || normalizedQuery.includes("配息") || normalizedQuery.includes("領息") || normalizedQuery.includes("高息")) {
              detectedStrategy = 'dividend';
            } else if (normalizedQuery.includes("飆股") || normalizedQuery.includes("成長") || normalizedQuery.includes("爆發")) {
              detectedStrategy = 'growth';
            }

            if (isPortfolioIntent) {
              setPortfolioBudget(detectedBudget);
              setPortfolioStrategy(detectedStrategy);
            }

            const { filters: extracted, tags } = parseQuery(rawQuery);
            setFilters(prev => ({ ...prev, ...extracted }));
            setParsedTags(tags);

            const matched = currentStocks
              .map(s => ({ ...s, matchScore: calculateMatchScore(s, { ...filters, ...extracted }) }))
              .filter(s => s.matchScore > 0)
              .sort((a, b) => b.matchScore - a.matchScore);

            const top3 = matched.slice(0, 3);

            let replyText = "";
            let badgeTag = "✨ AI 智能動態解析";
            let inlinePortfolioCard = null;

            if (isPortfolioIntent) {
              // DYNAMICALLY SCAN LIVE STOCKS WITH FULL-WIDTH NORMALIZATION
              const dynamicItems = computeDynamicPortfolio(currentStocks, detectedBudget, detectedStrategy, rawQuery);

              const totalDividend = dynamicItems.reduce((sum, item) => sum + item.expectedDividend, 0);
              const avgYield = (totalDividend / detectedBudget * 100).toFixed(2);

              const isEtfReq = normalizedQuery.includes("etf");
              const strategyTitle = isEtfReq ? '長期優質 ETF 投資組合' : (detectedStrategy==='dividend'?'高股息穩健存股':detectedStrategy==='growth'?'飆股衝刺型':'均衡價值成長');

              inlinePortfolioCard = {
                budget: detectedBudget,
                budgetText: `${(detectedBudget/10000).toFixed(0)} 萬 NTD`,
                strategyName: strategyTitle,
                items: dynamicItems,
                totalDividend: Math.round(totalDividend),
                avgYield
              };

              replyText = `AI 已為您解讀需求！針對【${strategyTitle}】（預算 ${inlinePortfolioCard.budgetText}），精準演算出以下動態配置表單：`;
            } else {
              replyText = `根據您的指令「${rawQuery}」，AI 於全台股 ${stockCount} 檔標的中解構全方位指標：\n【${tags.length > 0 ? tags.join(" | ") : "全市場精選標的"}】。\n\n`;
              if (top3.length > 0) {
                const namesStr = top3.map(s => s.name + " (" + s.ticker + ")").join("、");
                replyText += "首選推薦標的為：" + namesStr + "。\n其中 **" + top3[0].name + "** 匹配度達 **" + top3[0].matchScore + "%**！今日最新成交價 " + top3[0].price + " 元。";
              } else {
                replyText += "目前全市場暫無符合所有條件的標的，建議可點擊重置或放寬條件。";
              }
            }

            // Call Backend Gemini Contextual Screener API
            try {
              const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: rawQuery, history: messages, model: selectedModel })
              });
              if (res.ok) {
                const data = await res.json();
                if (data.mode === 'gemini_contextual_screener' && data.reply) {
                  setMessages(prev => [...prev, {
                    sender: 'ai',
                    text: data.reply,
                    topStocks: data.topStocks || top3,
                    badge: data.modelTitle || (data.isPortfolio ? "✨ AI 組合演算" : "✨ StockMind AI 對話與研判"),
                    portfolioCard: data.isPortfolio ? (data.portfolioCard || inlinePortfolioCard) : null
                  }]);
                  setIsProcessing(false);
                  return;
                }
              }
            } catch(e) {}

            setMessages(prev => [...prev, { sender: 'ai', text: replyText, topStocks: top3, badge: badgeTag, portfolioCard: isPortfolioIntent ? inlinePortfolioCard : null }]);
            setIsProcessing(false);
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

          const resetAllFilters = () => {
            setFilters({
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
            setParsedTags([]);
          };

          return h('div', { className: 'app-container' },
            // Header
            h('header', { className: 'glass-panel', style: { padding: '0.85rem 1.5rem', marginBottom: '1.5rem' } },
              h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' } },
                h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' } },
                  h('div', { style: { background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', padding: '0.55rem', borderRadius: '12px', color: '#090d16', fontWeight: 900 } }, '✨'),
                  h('div', null,
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' } },
                      h('h1', { className: 'gradient-text', style: { fontSize: '1.3rem', fontWeight: 800 } }, 'StockMind AI (全台股即時對話篩選與投資組合配置系統)'),
                      h('span', { className: 'pill-badge pill-purple' }, '✨ 智能動態選股引擎'),
                      h('span', { className: 'pill-badge pill-emerald' }, `全台股 ${stockCount} 檔連線 (${lastSync})`)
                    ),
                    h('p', { style: { fontSize: '0.78rem', color: 'var(--text-secondary)' } }, '結合自然語言對話與玩股網三大面向 20+ 指標即時篩選系統')
                  )
                ),
                h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' } },
                  h('div', { style: { background: 'var(--bg-input)', padding: '3px', borderRadius: '8px', display: 'flex', gap: '2px' } },
                    [{ id: 'ALL', label: '全市場' }, { id: 'TW', label: '台股 (1,300+)' }, { id: 'US', label: '美股 (10,000+)' }, { id: 'COMMODITY', label: '🛢️ 全球原物料' }].map(m =>
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
                    placeholder: '搜尋代號 / 名稱 (黃金, 2330, GC=F)...',
                    value: searchTerm,
                    onChange: (e) => setSearchTerm(e.target.value),
                    style: { background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.4rem 0.75rem', color: '#fff', fontSize: '0.82rem', width: '190px', outline: 'none' }
                  }),
                  h('button', { onClick: () => setIsHotStocksModalOpen(true), className: 'btn-secondary', style: { fontSize: '0.82rem', border: '1px solid rgba(245, 158, 11, 0.6)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(239, 68, 68, 0.25) 100%)', color: '#fbbf24', fontWeight: 800 } }, '🔥 熱門飆股視窗'),
                  h('button', { onClick: () => setIsPortfolioOpen(true), className: 'btn-secondary', style: { fontSize: '0.82rem', border: '1px solid rgba(16,185,129,0.5)', background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.2) 100%)', color: '#34d399', fontWeight: 700 } }, `💼 AI 投資組合 (${savedPortfolios.length})`),
                  h('button', { onClick: () => { if(compareList.length===0) alert('請先在卡片點擊對比按鈕'); else setIsCompareOpen(true); }, className: 'btn-secondary', style: { fontSize: '0.8rem' } }, `⚖️ 對比 (${compareList.length})`),
                  h('button', { onClick: () => setIsWatchlistOpen(true), className: 'btn-primary', style: { fontSize: '0.8rem' } }, `⭐ 觀察名單 (${watchlist.length})`)
                )
              )
            ),

            // Main Layout
            h('div', null,

              // Featured Hot Stocks Hub (熱門與焦點標的專區)
              h('div', { className: 'glass-panel', style: { padding: '1.1rem 1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' } },
                h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' } },
                  h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.6rem' } },
                    h('span', { style: { fontSize: '1.3rem' } }, '🔥'),
                    h('div', null,
                      h('h2', { className: 'gradient-text', style: { fontSize: '1.15rem', fontWeight: 800 } }, '全球熱門飆股、原物料與焦點標的 (Featured Hot Assets)'),
                      h('p', { style: { fontSize: '0.75rem', color: 'var(--text-secondary)' } }, '即時監控台美雙股市與黃金、原油、金屬等全球原物料與期貨大宗商品行情')
                    )
                  ),
                  // Hot Category Tabs
                  h('div', { style: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap' } },
                    [
                      { id: 'popular', label: '🔥 台美熱搜王', icon: '🔥' },
                      { id: 'gainers', label: '⚡ 飆漲先鋒榜', icon: '⚡' },
                      { id: 'highYield', label: '💰 高殖利率霸王', icon: '💰' },
                      { id: 'aiEcosystem', label: '🤖 AI 算力神明', icon: '🤖' },
                      { id: 'usGiants', label: '🛡️ 美股全星陣', icon: '🛡️' }
                    ].map(tab =>
                      h('button', {
                        key: tab.id,
                        onClick: () => setActiveHotTab(tab.id),
                        style: {
                          background: activeHotTab === tab.id ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' : 'rgba(255,255,255,0.06)',
                          color: activeHotTab === tab.id ? '#090d16' : 'var(--text-secondary)',
                          border: activeHotTab === tab.id ? 'none' : '1px solid var(--border-subtle)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: activeHotTab === tab.id ? 800 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }
                      }, tab.label)
                    )
                  )
                ),

                // Featured Stocks Grid
                h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.9rem' } },
                  getFeaturedHotStocks(currentStocks, activeHotTab).map(stock =>
                    h('div', {
                      key: stock.ticker,
                      className: 'stock-card',
                      style: {
                        background: 'rgba(15, 23, 42, 0.75)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        padding: '0.85rem',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        transition: 'transform 0.2s, border-color 0.2s'
                      }
                    },
                      h('div', null,
                        h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' } },
                          h('div', null,
                            h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.35rem' } },
                              h('span', { style: { fontWeight: 800, fontSize: '0.92rem', color: '#fff' } }, stock.name),
                              h('span', { className: `pill-badge ${stock.market === 'US' ? 'pill-purple' : 'pill-cyan'}`, style: { fontSize: '0.62rem' } }, stock.market)
                            ),
                            h('div', { style: { fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '1px' } }, `${stock.ticker} · ${stock.sector}`)
                          ),
                          h('span', {
                            style: {
                              color: stock.changePercent >= 0 ? '#10b981' : '#ef4444',
                              background: stock.changePercent >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              padding: '0.2rem 0.45rem',
                              borderRadius: '6px',
                              fontWeight: 800,
                              fontSize: '0.78rem'
                            }
                          }, `${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent}%`)
                        ),
                        h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '0.35rem', margin: '0.5rem 0' } },
                          h('span', { style: { fontSize: '1.25rem', fontWeight: 900, color: '#38bdf8' } },
                            stock.currency === 'USD' ? `$${stock.price}` : `${stock.price} 元`
                          ),
                          stock.yield > 0 && h('span', { style: { fontSize: '0.72rem', color: '#34d399', fontWeight: 700 } }, `殖利率 ${stock.yield}%`)
                        )
                      ),
                      h('div', { style: { display: 'flex', gap: '0.35rem', marginTop: '0.5rem' } },
                        h('button', {
                          onClick: () => handleSend(`深度拆解分析標的 ${stock.name} (${stock.ticker})`),
                          style: { flex: 1, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '0.25rem 0.4rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }
                        }, '✨ AI 分析'),
                        h('button', {
                          onClick: () => toggleCompare(stock),
                          style: { background: compareList.some(s => s.ticker === stock.ticker) ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.06)', border: 'none', color: compareList.some(s => s.ticker === stock.ticker) ? '#090d16' : '#fff', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }
                        }, '⚖️'),
                        h('button', {
                          onClick: () => toggleWatchlist(stock),
                          style: { background: watchlist.some(s => s.ticker === stock.ticker) ? '#f59e0b' : 'rgba(255,255,255,0.06)', border: 'none', color: watchlist.some(s => s.ticker === stock.ticker) ? '#090d16' : '#fff', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }
                        }, '⭐')
                      )
                    )
                  )
                )
              ),

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
                  h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.4rem' } },
                    h('span', { style: { fontSize: '1rem' } }, '✨'),
                    h('strong', { style: { fontSize: '0.88rem', color: 'var(--text-primary)' } }, 'StockMind AI'),
                    h('select', {
                      value: selectedModel,
                      onChange: (e) => { e.stopPropagation(); setSelectedModel(e.target.value); },
                      onClick: (e) => e.stopPropagation(),
                      style: {
                        background: '#090d16',
                        border: '1px solid #10b981',
                        color: '#34d399',
                        borderRadius: '6px',
                        padding: '0.2rem 0.4rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        outline: 'none',
                        cursor: 'pointer'
                      }
                    },
                      llmModels.map(m => h('option', { key: m.id, value: m.id, style: { background: '#090d16', color: '#f8fafc' } }, m.label))
                    )
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
                      h('div', { key: i, style: { alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '95%' } },
                        h('div', {
                          style: {
                            padding: '0.65rem 0.85rem',
                            borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                            background: m.sender === 'user' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'rgba(21, 29, 48, 0.95)',
                            border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                            fontSize: '0.82rem', lineHeight: 1.5, whiteSpace: 'pre-line', color: '#fff'
                          }
                        },
                          m.badge && h('div', { style: { fontSize: '0.68rem', color: '#a855f7', fontWeight: 700, marginBottom: '0.2rem' } }, m.badge),
                          m.text,

                          // Render Dynamic AI Portfolio Allocation Card
                          m.portfolioCard && h('div', { style: { marginTop: '0.6rem', padding: '0.65rem', background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '8px', fontSize: '0.75rem' } },
                            h('div', { style: { display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#34d399', marginBottom: '0.4rem' } },
                              h('span', null, `💼 ${m.portfolioCard.budgetText} • ${m.portfolioCard.strategyName}`),
                              h('span', { style: { color: 'var(--accent-gold)' } }, `年股息: NT$ ${formatNum(m.portfolioCard.totalDividend)} (${m.portfolioCard.avgYield}%)`)
                            ),
                            h('table', { style: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.72rem', margin: '0.4rem 0' } },
                              h('thead', null,
                                h('tr', { style: { borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' } },
                                  h('th', null, '標的'),
                                  h('th', null, '佔比'),
                                  h('th', null, '金額 (NT$)')
                                )
                              ),
                              h('tbody', null,
                                m.portfolioCard.items.map(item =>
                                  h('tr', { key: item.ticker, style: { borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }, onClick: () => openStockDetail(item) },
                                    h('td', { style: { padding: '0.35rem 0', fontWeight: 800, color: '#38bdf8' } }, `🔍 ${item.name} (${item.ticker})`),
                                    h('td', { style: { color: '#34d399', fontWeight: 700 } }, item.weightPct),
                                    h('td', null, `NT$ ${formatNum(item.allocAmount)}`)
                                  )
                                )
                              )
                            ),
                            h('div', { style: { marginTop: '0.45rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems: 'center' } },
                              h('span', { style: { fontSize: '0.68rem', color: 'var(--text-muted)' } }, '🔍 點擊查看標的 AI 分析：'),
                              m.portfolioCard.items.map(item =>
                                h('button', {
                                  key: item.ticker,
                                  onClick: (e) => { e.stopPropagation(); openStockDetail(item); },
                                  style: { background: 'rgba(56, 189, 248, 0.18)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8', padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer' }
                                }, `🔍 ${item.name}`)
                              )
                            ),
                            h('button', {
                              onClick: () => {
                                setPortfolioBudget(m.portfolioCard.budget);
                                setCustomPortfolioItems(m.portfolioCard.items);
                                setPortfolioStrategy(m.portfolioCard.strategyKey || 'balanced');
                                setSelectedSavedPortfolio(null);
                                setIsPortfolioOpen(true);
                              },
                              className: 'btn-primary',
                              style: { width: '100%', padding: '0.35rem', fontSize: '0.72rem', marginTop: '0.5rem', background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' }
                            }, '💼 帶入儀表板主控台試算與儲存')
                          ),

                          m.topStocks && h('div', { style: { marginTop: '0.4rem', paddingTop: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.3rem', flexWrap: 'wrap' } },
                            m.topStocks.map(s =>
                              h('button', {
                                key: s.ticker,
                                onClick: () => openStockDetail(s),
                                className: 'pill-badge pill-emerald',
                                style: { border: 'none', cursor: 'pointer', padding: '0.25rem 0.55rem', fontWeight: 800 }
                              }, `🔍 ${s.name} (${s.ticker}) • ${s.matchScore}%`)
                            )
                          )
                        )
                      )
                    ),
                    isProcessing && h('div', { style: { color: 'var(--accent-purple)', fontSize: '0.78rem' } }, '✨ AI 正在思考與分析數據中...'),
                    h('div', { ref: messagesEndRef })
                  ),

                  // CLEAN CHAT INPUT BAR
                  h('div', { style: { padding: '0.65rem 0.75rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(13, 19, 34, 0.95)', display: 'flex', gap: '0.4rem' } },
                    h('textarea', {
                      rows: 2,
                      placeholder: '請輸入選股需求或對話（例如：幫我配置 100 萬長期 ETF 組合 或 篩選高股息標的）...',
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
                    h('button', { onClick: () => handleSend(), className: 'btn-primary', style: { padding: '0.5rem 0.85rem', fontSize: '0.8rem', alignSelf: 'flex-end', height: 'fit-content', background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' } }, '✨ 送出')
                  )
                )
              ),

              // Right Main Column: Screener Console
              h('div', null,
                h('div', { className: 'glass-panel', style: { padding: '1.2rem', marginBottom: '1.25rem' } },
                  
                  // SECTION 1: PRIMARY FEATURED QUICK TOGGLES
                  h('div', { style: { background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', padding: '1rem', marginBottom: '1.2rem' } },
                    h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' } },
                      h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.4rem' } },
                        h('span', { style: { fontSize: '1.1rem' } }, '🔥'),
                        h('strong', { style: { fontSize: '0.95rem', color: 'var(--accent-emerald)' } }, '最主要核心指標一鍵快篩（熱門首選，排最前面）')
                      ),
                      h('button', { onClick: resetAllFilters, style: { background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' } }, '重置全部')
                    ),
                    h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' } },
                      [
                        { key: 'minYield', label: '💰 高殖利率 (≥4.5%)', active: filters.minYield >= 4.5, toggle: () => setFilters(f => ({ ...f, minYield: f.minYield >= 4.5 ? 0 : 4.5 })) },
                        { key: 'maxPe', label: '💎 低本益比 (≤15倍)', active: filters.maxPe !== null && filters.maxPe <= 15, toggle: () => setFilters(f => ({ ...f, maxPe: f.maxPe === 15 ? null : 15 })) },
                        { key: 'techBreakMa60', label: '📈 突破 60日季線', active: filters.techBreakMa60, toggle: () => setFilters(f => ({ ...f, techBreakMa60: !f.techBreakMa60 })) },
                        { key: 'techMaAlign', label: '🚀 均線多頭排列', active: filters.techMaAlign, toggle: () => setFilters(f => ({ ...f, techMaAlign: !f.techMaAlign })) },
                        { key: 'chipInstitutionalBuy', label: '🏛 三大法人連續買超', active: filters.chipInstitutionalBuy, toggle: () => setFilters(f => ({ ...f, chipInstitutionalBuy: !f.chipInstitutionalBuy })) },
                        { key: 'minRoe', label: '⚡ 高 ROE (≥15%)', active: filters.minRoe >= 15, toggle: () => setFilters(f => ({ ...f, minRoe: f.minRoe >= 15 ? 0 : 15 })) }
                      ].map(item =>
                        h('button', {
                          key: item.key,
                          onClick: item.toggle,
                          style: {
                            background: item.active ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'rgba(15,23,42,0.8)',
                            border: item.active ? '1px solid #34d399' : '1px solid var(--border-subtle)',
                            color: item.active ? '#fff' : 'var(--text-secondary)',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: item.active ? 700 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justify: 'space-between'
                          }
                        },
                          item.label,
                          h('span', { style: { fontSize: '0.8rem', marginLeft: '0.3rem' } }, item.active ? '✅' : '＋')
                        )
                      )
                    )
                  ),

                  // SECTION 2: FULL GRANULAR DIMENSION TABS
                  h('div', { style: { display: 'flex', gap: '0.5rem', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' } },
                    [
                      { id: 'fundamental', label: '📊 全進階基本面 (估值/獲利/營收/配息)', badge: (filters.minYield>0||filters.maxPe||filters.minPb||filters.minRoe>0||filters.minRevenueGrowth>0||filters.minEps>0||filters.sector!=='ALL') },
                      { id: 'technical', label: '📈 全進階技術面 (均線/KD/RSI/MACD/爆量)', badge: (filters.techBreakMa60||filters.techBreakMa20||filters.techMaAlign||filters.techVolumeBurst||filters.techKdCross||filters.techRsiStrong||filters.techMacdRed) },
                      { id: 'chips', label: '🔥 全進階籌碼面 (外資/投信/主力大戶比)', badge: (filters.chipInstitutionalBuy||filters.chipForeignBuy||filters.chipInvestmentTrustBuy||filters.chipLargeHolders||filters.chipMainConcentration) }
                    ].map(tab =>
                      h('button', {
                        key: tab.id,
                        onClick: () => setActiveDimensionTab(tab.id),
                        style: {
                          background: activeDimensionTab === tab.id ? 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.2) 100%)' : 'rgba(255,255,255,0.03)',
                          border: activeDimensionTab === tab.id ? '1px solid rgba(16,185,129,0.5)' : '1px solid var(--border-subtle)',
                          color: activeDimensionTab === tab.id ? '#34d399' : 'var(--text-secondary)',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: activeDimensionTab === tab.id ? 700 : 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }
                      },
                        tab.label,
                        tab.badge && h('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block' } })
                      )
                    )
                  ),

                  // TAB 1: ALL FUNDAMENTAL
                  activeDimensionTab === 'fundamental' && h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1.2rem' } },
                    h('div', null,
                      h('div', { style: { fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' } },
                        h('span', null, '💰 最低殖利率 %:'),
                        h('strong', { style: { color: 'var(--accent-emerald)' } }, filters.minYield > 0 ? `${filters.minYield}% 以上` : '不限')
                      ),
                      h('input', { type: 'range', min: '0', max: '10', step: '0.5', value: filters.minYield || 0, onChange: (e) => setFilters(f => ({ ...f, minYield: parseFloat(e.target.value) })) })
                    ),
                    h('div', null,
                      h('div', { style: { fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' } },
                        h('span', null, '💎 最高本益比 P/E:'),
                        h('strong', { style: { color: 'var(--accent-cyan)' } }, filters.maxPe ? `${filters.maxPe} 倍以下` : '不限')
                      ),
                      h('input', { type: 'range', min: '6', max: '60', step: '2', value: filters.maxPe || 60, onChange: (e) => setFilters(f => ({ ...f, maxPe: parseFloat(e.target.value) === 60 ? null : parseFloat(e.target.value) })) })
                    ),
                    h('div', null,
                      h('div', { style: { fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' } },
                        h('span', null, '🏷 最高股價淨值比 P/B:'),
                        h('strong', { style: { color: 'var(--accent-gold)' } }, filters.minPb ? `${filters.minPb} 倍以下` : '不限')
                      ),
                      h('input', { type: 'range', min: '0.8', max: '15', step: '0.5', value: filters.minPb || 15, onChange: (e) => setFilters(f => ({ ...f, minPb: parseFloat(e.target.value) === 15 ? null : parseFloat(e.target.value) })) })
                    ),
                    h('div', null,
                      h('div', { style: { fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' } },
                        h('span', null, '⚡ 最低 ROE %:'),
                        h('strong', { style: { color: 'var(--accent-purple)' } }, filters.minRoe > 0 ? `${filters.minRoe}% 以上` : '不限')
                      ),
                      h('input', { type: 'range', min: '0', max: '35', step: '2', value: filters.minRoe || 0, onChange: (e) => setFilters(f => ({ ...f, minRoe: parseFloat(e.target.value) })) })
                    ),
                    h('div', null,
                      h('div', { style: { fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' } },
                        h('span', null, '🚀 營收年增率 (YoY %):'),
                        h('strong', { style: { color: 'var(--accent-emerald)' } }, filters.minRevenueGrowth > 0 ? `${filters.minRevenueGrowth}% 以上` : '不限')
                      ),
                      h('input', { type: 'range', min: '0', max: '50', step: '5', value: filters.minRevenueGrowth || 0, onChange: (e) => setFilters(f => ({ ...f, minRevenueGrowth: parseFloat(e.target.value) })) })
                    ),
                    h('div', null,
                      h('div', { style: { fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' } },
                        h('span', null, '💵 每股盈餘 (EPS 元):'),
                        h('strong', { style: { color: 'var(--accent-cyan)' } }, filters.minEps > 0 ? `${filters.minEps} 元以上` : '不限')
                      ),
                      h('input', { type: 'range', min: '0', max: '30', step: '2', value: filters.minEps || 0, onChange: (e) => setFilters(f => ({ ...f, minEps: parseFloat(e.target.value) })) })
                    ),
                    h('div', null,
                      h('div', { style: { fontSize: '0.78rem', marginBottom: '0.3rem' } }, '🏭 產業類別篩選:'),
                      h('select', {
                        value: filters.sector || 'ALL',
                        onChange: (e) => setFilters(f => ({ ...f, sector: e.target.value })),
                        style: { width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#fff', fontSize: '0.8rem' }
                      },
                        h('option', { value: 'ALL' }, `全部產業 (${currentStocks.length} 檔)`),
                        h('option', { value: 'ETF 基金' }, '📊 ETF 基金 (高股息/市值型)'),
                        h('option', { value: '電子/半導體/AI' }, '💻 電子 / 半導體 / AI 供應鏈'),
                        h('option', { value: '金融保險' }, '🏦 金融保險 / 金控銀行'),
                        h('option', { value: '航運物流' }, '🚢 貨櫃航運與散裝物流'),
                        h('option', { value: '鋼鐵金屬' }, '⚙️ 鋼鐵與基礎金屬'),
                        h('option', { value: '一般產業' }, '🏢 一般綜合產業')
                      )
                    )
                  ),

                  // TAB 2: ALL TECHNICAL
                  activeDimensionTab === 'technical' && h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' } },
                    [
                      { key: 'techBreakMa60', title: '📈 突破 60 日季線 (MA60)', desc: '股價站上季線，中長線多頭' },
                      { key: 'techBreakMa20', title: '📊 突破 20 日月線 (MA20)', desc: '股價站上月線，短線強勢' },
                      { key: 'techMaAlign', title: '🚀 均線多頭排列 (5>20>60MA)', desc: '短中長期均線平行向上爆發' },
                      { key: 'techVolumeBurst', title: '💥 成交量爆發 (> 5日均量2倍)', desc: '主力重金入場，量能大爆發' },
                      { key: 'techKdCross', title: '✨ 日 KD 黃金交叉', desc: 'K 值向上上穿 D 值多頭訊號' },
                      { key: 'techRsiStrong', title: '⚡ RSI 多頭強勢 (> 60)', desc: '相對強弱指標持續在強勢區' },
                      { key: 'techMacdRed', title: '🟥 MACD 紅柱持續放大', desc: '動能指標柱狀圖多頭擴張' }
                    ].map(item =>
                      h('div', {
                        key: item.key,
                        onClick: () => setFilters(f => ({ ...f, [item.key]: !f[item.key] })),
                        style: {
                          padding: '0.85rem',
                          borderRadius: '8px',
                          background: filters[item.key] ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
                          border: filters[item.key] ? '1px solid rgba(16,185,129,0.5)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          display: 'flex',
                          justify: 'space-between',
                          alignItems: 'center'
                        }
                      },
                        h('div', null,
                          h('div', { style: { fontWeight: 700, fontSize: '0.85rem', color: filters[item.key] ? '#34d399' : '#fff' } }, item.title),
                          h('div', { style: { fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' } }, item.desc)
                        ),
                        h('span', { style: { fontSize: '1.1rem' } }, filters[item.key] ? '✅' : '⬜')
                      )
                    )
                  ),

                  // TAB 3: ALL CHIPS
                  activeDimensionTab === 'chips' && h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' } },
                    [
                      { key: 'chipInstitutionalBuy', title: '🏛 三大法人 (外資/投信) 連續買超', desc: '三大法人連續 3 日以上卡位鎖碼' },
                      { key: 'chipForeignBuy', title: '🌐 外資單日買超爆量 (> 1,000張)', desc: '外資主力資金重金買超' },
                      { key: 'chipInvestmentTrustBuy', title: '💼 投信連續買超加碼 (> 5日)', desc: '本土內資法人作多鎖碼飆股' },
                      { key: 'chipLargeHolders', title: '👑 千張大戶持股比例連續增加', desc: '大股東與主力籌碼集中度提升' },
                      { key: 'chipMainConcentration', title: '🎯 主力籌碼集中度顯著提升', desc: '散戶退場，大籌碼集中在少數人' }
                    ].map(item =>
                      h('div', {
                        key: item.key,
                        onClick: () => setFilters(f => ({ ...f, [item.key]: !f[item.key] })),
                        style: {
                          padding: '0.85rem',
                          borderRadius: '8px',
                          background: filters[item.key] ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.03)',
                          border: filters[item.key] ? '1px solid rgba(6,182,212,0.5)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          display: 'flex',
                          justify: 'space-between',
                          alignItems: 'center'
                        }
                      },
                        h('div', null,
                          h('div', { style: { fontWeight: 700, fontSize: '0.85rem', color: filters[item.key] ? '#38bdf8' : '#fff' } }, item.title),
                          h('div', { style: { fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' } }, item.desc)
                        ),
                        h('span', { style: { fontSize: '1.1rem' } }, filters[item.key] ? '✅' : '⬜')
                      )
                    )
                  )
                ),

                // Screener Results Count Bar
                h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' } },
                  h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
                    h('span', { style: { fontWeight: 800, fontSize: '0.95rem' } }, `玩股網交叉篩選結果：共 ${screenedStocks.length} 檔符合`),
                    screenedStocks.length < currentStocks.length && h('span', { className: 'pill-badge pill-cyan', style: { fontSize: '0.7rem' } }, `已過濾掉 ${currentStocks.length - screenedStocks.length} 檔未達標股票`)
                  ),
                  h('select', { value: sortBy, onChange: (e) => setSortBy(e.target.value), style: { background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' } },
                    h('option', { value: 'matchScore' }, '🎯 AI 三大面向匹配度最高'),
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
                        h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', padding: '0.5rem', background: 'rgba(15,23,42,0.7)', borderRadius: '6px', fontSize: '0.75rem', marginBottom: '0.6rem' } },
                          h('div', null, '殖利率: ', h('strong', { style: { color: 'var(--accent-emerald)' } }, `${stock.yield || '-'}%`)),
                          h('div', null, '本益比: ', h('strong', { style: { color: 'var(--accent-cyan)' } }, `${stock.pe || '-'}x`)),
                          h('div', null, 'ROE: ', h('strong', { style: { color: 'var(--accent-purple)' } }, `${stock.roe || '-'}%`)),
                          h('div', null, 'P/B: ', h('strong', { style: { color: 'var(--accent-gold)' } }, `${stock.pb || '-'}x`))
                        ),
                        h('div', { style: { display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.6rem' } },
                          stock.breakMa60 && h('span', { className: 'pill-badge pill-emerald', style: { fontSize: '0.65rem' } }, '站上季線'),
                          stock.maAlign && h('span', { className: 'pill-badge pill-cyan', style: { fontSize: '0.65rem' } }, '均線多頭'),
                          stock.volumeBurst && h('span', { className: 'pill-badge pill-purple', style: { fontSize: '0.65rem' } }, '量爆發2x'),
                          stock.institutionalBuy && h('span', { className: 'pill-badge pill-emerald', style: { fontSize: '0.65rem' } }, '法人連買')
                        ),
                        h('p', { style: { fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, height: '2.8em', overflow: 'hidden' } }, stock.summary || `${stock.name} 今日成交價 ${stock.price} 元。`)
                      ),
                      h('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-subtle)' } },
                        h('div', { style: { display: 'flex', gap: '0.3rem' } },
                          h('button', { onClick: () => toggleWatchlist(stock), className: 'btn-icon', title: '收藏' }, watchlist.some(s => s.ticker === stock.ticker) ? '⭐' : '☆'),
                          h('button', { onClick: () => toggleCompare(stock), className: 'btn-icon', title: '對比' }, '秤️')
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

            // AI Portfolio Dedicated Summary Modal Dashboard
            isPortfolioOpen && h('div', { style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300, padding: '1rem' } },
              h('div', { className: 'glass-panel', style: { width: '100%', maxWidth: '960px', padding: '1.8rem', maxHeight: '92vh', overflowY: 'auto', borderRadius: '16px' } },
                
                // Dashboard Header
                h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' } },
                  h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.6rem' } },
                    h('div', { style: { background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', padding: '0.5rem', borderRadius: '10px', color: '#090d16' } }, '💼'),
                    h('div', null,
                      h('h2', { style: { fontSize: '1.35rem', fontWeight: 800 } }, selectedSavedPortfolio ? `📁 歷史投資組合詳情：${selectedSavedPortfolio.name}` : 'AI 投資組合試算與資產配置彙整表單'),
                      h('p', { style: { fontSize: '0.78rem', color: 'var(--text-secondary)' } }, selectedSavedPortfolio ? `建立時間：${selectedSavedPortfolio.date}` : '自訂總投資預算，由 AI 自動演算最適佔比、預估年化股息與張數分配表')
                    )
                  ),
                  h('button', { onClick: () => { setIsPortfolioOpen(false); setSelectedSavedPortfolio(null); }, className: 'btn-icon' }, '✕')
                ),

                selectedSavedPortfolio ? h('div', null,
                  h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: 'rgba(16,185,129,0.1)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)' } },
                    h('div', null,
                      h('span', { style: { fontWeight: 800, fontSize: '1rem', color: '#34d399' } }, selectedSavedPortfolio.name),
                      h('span', { style: { marginLeft: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' } }, `總預算: NT$ ${formatNum(selectedSavedPortfolio.budget)}`)
                    ),
                    h('div', { style: { display: 'flex', gap: '0.5rem' } },
                      h('button', { onClick: () => { setPortfolioBudget(selectedSavedPortfolio.budget); setPortfolioStrategy(selectedSavedPortfolio.strategy); setSelectedSavedPortfolio(null); }, className: 'btn-primary', style: { padding: '0.35rem 0.75rem', fontSize: '0.75rem' } }, '✏️ 載入至即時編輯器'),
                      h('button', { onClick: () => setSelectedSavedPortfolio(null), className: 'btn-secondary', style: { padding: '0.35rem 0.75rem', fontSize: '0.75rem' } }, '🔙 返回主列表')
                    )
                  ),

                  // Detail Table
                  h('div', { style: { overflowX: 'auto', marginBottom: '1.2rem' } },
                    h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' } },
                      h('thead', null,
                        h('tr', { style: { borderBottom: '1px solid var(--border-subtle)', background: 'rgba(15,23,42,0.85)' } },
                          h('th', { style: { padding: '0.75rem 0.6rem' } }, '標的代號 / 名稱'),
                          h('th', { style: { padding: '0.75rem 0.6rem' } }, '產業類別'),
                          h('th', { style: { padding: '0.75rem 0.6rem' } }, '成交價'),
                          h('th', { style: { padding: '0.75rem 0.6rem', color: 'var(--accent-emerald)', fontWeight: 800 } }, '目標配置佔比'),
                          h('th', { style: { padding: '0.75rem 0.6rem' } }, '分配金額'),
                          h('th', { style: { padding: '0.75rem 0.6rem' } }, '購買股數 (張數)'),
                          h('th', { style: { padding: '0.75rem 0.6rem', color: 'var(--accent-gold)' } }, '預估年股息')
                        )
                      ),
                      h('tbody', null,
                        (selectedSavedPortfolio.items || []).map(item =>
                          h('tr', { key: item.ticker, style: { borderBottom: '1px solid var(--border-subtle)' } },
                            h('td', { style: { padding: '0.75rem 0.6rem', fontWeight: 700 } }, `${item.name} (${item.ticker})`),
                            h('td', { style: { padding: '0.75rem 0.6rem' } }, h('span', { className: 'pill-badge pill-purple', style: { fontSize: '0.65rem' } }, item.sector)),
                            h('td', { style: { padding: '0.75rem 0.6rem' } }, `${item.currency==='USD'?'$':'NT$'}${formatNum(item.price)}`),
                            h('td', { style: { padding: '0.75rem 0.6rem', color: 'var(--accent-emerald)', fontWeight: 800 } }, item.weightPct),
                            h('td', { style: { padding: '0.75rem 0.6rem', fontWeight: 700 } }, `NT$ ${formatNum(item.allocAmount)}`),
                            h('td', { style: { padding: '0.75rem 0.6rem' } }, `${formatNum(item.shares)} 股 (${(item.shares/1000).toFixed(1)} 張)`),
                            h('td', { style: { padding: '0.75rem 0.6rem', color: 'var(--accent-gold)', fontWeight: 700 } }, `NT$ ${formatNum(item.expectedDividend)}`)
                          )
                        )
                      )
                    )
                  )
                ) :
                // Regular Active Portfolio Summary Dashboard View
                h('div', null,
                  customPortfolioItems && h('div', { style: { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '8px', padding: '0.6rem 1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#34d399', fontWeight: 800 } },
                      h('span', null, '✨'),
                      h('span', null, `已成功帶入 AI 特助精準推薦的 ${customPortfolioItems.length} 檔對話標的組合！`)
                    ),
                    h('button', {
                      onClick: () => setCustomPortfolioItems(null),
                      style: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-secondary)', fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: '6px', cursor: 'pointer' }
                    }, '🔄 切換為公式預設試算')
                  ),
                  // Strategy & Budget Control Panel
                  h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', background: 'rgba(15,23,42,0.8)', padding: '1.1rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' } },
                    h('div', null,
                      h('label', { style: { fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-emerald)', display: 'block', marginBottom: '0.4rem' } }, '💵 總投資預算 (新台幣 NTD):'),
                      h('div', { style: { display: 'flex', gap: '0.4rem', alignItems: 'center' } },
                        h('input', {
                          type: 'number',
                          value: portfolioBudget,
                          step: 100000,
                          onChange: (e) => setPortfolioBudget(Math.max(100000, parseInt(e.target.value) || 0)),
                          style: { background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.45rem 0.75rem', color: '#fff', fontSize: '0.95rem', fontWeight: 800, width: '150px' }
                        }),
                        h('span', { style: { fontSize: '0.82rem', color: 'var(--text-secondary)' } }, `(${ (portfolioBudget / 10000).toFixed(0) } 萬 NTD)`)
                      )
                    ),
                    h('div', null,
                      h('label', { style: { fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.4rem' } }, '🎯 投資策略風格選擇:'),
                      h('div', { style: { display: 'flex', gap: '0.4rem' } },
                        [
                          { id: 'balanced', label: '秤️ 均衡價值成長' },
                          { id: 'dividend', label: '💰 高股息穩健存股' },
                          { id: 'growth', label: '🚀 飆股衝刺型' }
                        ].map(st =>
                          h('button', {
                            key: st.id,
                            onClick: () => setPortfolioStrategy(st.id),
                            style: {
                              flex: 1,
                              background: portfolioStrategy === st.id ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
                              color: portfolioStrategy === st.id ? '#090d16' : 'var(--text-secondary)',
                              border: 'none', padding: '0.45rem 0.4rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: portfolioStrategy === st.id ? 800 : 500, cursor: 'pointer'
                            }
                          }, st.label)
                        )
                      )
                    )
                  ),

                  // Portfolio Metric Summary Cards
                  h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' } },
                    h('div', { className: 'glass-panel', style: { padding: '0.85rem', textAlign: 'center' } },
                      h('div', { style: { fontSize: '0.72rem', color: 'var(--text-muted)' } }, '總配置金額'),
                      h('div', { style: { fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.2rem' } }, `NT$ ${formatNum(portfolioStats.totalAlloc)}`)
                    ),
                    h('div', { className: 'glass-panel', style: { padding: '0.85rem', textAlign: 'center' } },
                      h('div', { style: { fontSize: '0.72rem', color: 'var(--text-muted)' } }, '預估年化股息收益'),
                      h('div', { style: { fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '0.2rem' } }, `NT$ ${formatNum(portfolioStats.totalDividend)} /年`)
                    ),
                    h('div', { className: 'glass-panel', style: { padding: '0.85rem', textAlign: 'center' } },
                      h('div', { style: { fontSize: '0.72rem', color: 'var(--text-muted)' } }, '投組平均預估殖利率'),
                      h('div', { style: { fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.2rem' } }, `${portfolioStats.avgYield}%`)
                    ),
                    h('div', { className: 'glass-panel', style: { padding: '0.85rem', textAlign: 'center' } },
                      h('div', { style: { fontSize: '0.72rem', color: 'var(--text-muted)' } }, '投組平均 ROE'),
                      h('div', { style: { fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-purple)', marginTop: '0.2rem' } }, `${portfolioStats.avgRoe}%`)
                    )
                  ),

                  // Visual Asset Distribution Progress Bar
                  h('div', { style: { marginBottom: '1.25rem' } },
                    h('div', { style: { fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' } }, '📊 資產佔比分佈視覺化圖表：'),
                    h('div', { style: { display: 'flex', height: '14px', borderRadius: '7px', overflow: 'hidden', background: 'rgba(255,255,255,0.08)' } },
                      activePortfolioItems.map((item, idx) => {
                        const colors = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'];
                        return h('div', {
                          key: item.ticker,
                          title: `${item.name}: ${item.weightPct}`,
                          style: { width: item.weightPct, background: colors[idx % colors.length] }
                        });
                      })
                    )
                  ),

                  // Detailed Portfolio Summary Table Form
                  h('div', { style: { overflowX: 'auto', marginBottom: '1.2rem' } },
                    h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' } },
                      h('thead', null,
                        h('tr', { style: { borderBottom: '1px solid var(--border-subtle)', background: 'rgba(15,23,42,0.85)' } },
                          h('th', { style: { padding: '0.75rem 0.6rem' } }, '標的代號 / 名稱'),
                          h('th', { style: { padding: '0.75rem 0.6rem' } }, '產業類別'),
                          h('th', { style: { padding: '0.75rem 0.6rem' } }, '最新成交價'),
                          h('th', { style: { padding: '0.75rem 0.6rem', color: 'var(--accent-emerald)', fontWeight: 800 } }, '目標配置佔比'),
                          h('th', { style: { padding: '0.75rem 0.6rem' } }, '預計分配金額'),
                          h('th', { style: { padding: '0.75rem 0.6rem' } }, '預估購買股數 (張數)'),
                          h('th', { style: { padding: '0.75rem 0.6rem', color: 'var(--accent-gold)' } }, '預估年股息')
                        )
                      ),
                      h('tbody', null,
                        activePortfolioItems.map(item =>
                          h('tr', { key: item.ticker, style: { borderBottom: '1px solid var(--border-subtle)' } },
                            h('td', { style: { padding: '0.75rem 0.6rem', fontWeight: 700 } },
                              h('div', null, item.name),
                              h('span', { style: { fontSize: '0.7rem', color: 'var(--text-muted)' } }, item.ticker)
                            ),
                            h('td', { style: { padding: '0.75rem 0.6rem' } },
                              h('span', { className: 'pill-badge pill-purple', style: { fontSize: '0.65rem' } }, item.sector)
                            ),
                            h('td', { style: { padding: '0.75rem 0.6rem', fontFamily: 'var(--font-mono)' } }, `${item.currency==='USD'?'$':'NT$'}${formatNum(item.price)}`),
                            h('td', { style: { padding: '0.75rem 0.6rem', color: 'var(--accent-emerald)', fontWeight: 800, fontSize: '0.9rem' } }, item.weightPct),
                            h('td', { style: { padding: '0.75rem 0.6rem', fontWeight: 700 } }, `NT$ ${formatNum(item.allocAmount)}`),
                            h('td', { style: { padding: '0.75rem 0.6rem' } }, `${formatNum(item.shares)} 股 (${(item.shares/1000).toFixed(1)} 張)`),
                            h('td', { style: { padding: '0.75rem 0.6rem', color: 'var(--accent-gold)', fontWeight: 700 } }, `NT$ ${formatNum(item.expectedDividend)}`)
                          )
                        )
                      )
                    )
                  )
                ),

                // Saved Portfolios History Cards with CLICK-TO-LOAD-AND-VIEW Support
                savedPortfolios.length > 0 && h('div', { style: { marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' } },
                  h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' } },
                    h('h4', { style: { fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-emerald)' } }, `📁 已儲存的歷史 AI 投資組合紀錄 (${savedPortfolios.length} 組，點擊即可開啟表單細節)：`),
                    h('button', { onClick: () => { if(confirm('確定要清空所有已儲存的投資組合嗎？')) setSavedPortfolios([]); }, style: { background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.72rem', cursor: 'pointer' } }, '清空歷史紀錄')
                  ),
                  h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' } },
                    savedPortfolios.map(p =>
                      h('div', {
                        key: p.id,
                        onClick: () => handleLoadSavedPortfolio(p),
                        className: 'glass-panel-interactive',
                        style: {
                          padding: '0.85rem',
                          cursor: 'pointer',
                          border: selectedSavedPortfolio && selectedSavedPortfolio.id === p.id ? '1px solid #34d399' : '1px solid var(--border-subtle)',
                          background: selectedSavedPortfolio && selectedSavedPortfolio.id === p.id ? 'rgba(16,185,129,0.12)' : 'rgba(15,23,42,0.85)'
                        }
                      },
                        h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } },
                          h('div', { style: { fontWeight: 800, color: '#34d399', fontSize: '0.88rem' } }, p.name),
                          h('button', {
                            onClick: (e) => handleDeleteSavedPortfolio(p.id, e),
                            style: { background: 'rgba(244,63,94,0.15)', border: 'none', color: '#fb7185', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }
                          }, '🗑 刪除')
                        ),
                        h('div', { style: { fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' } }, `儲存時間: ${p.date}`),
                        h('div', { style: { marginTop: '0.4rem', fontSize: '0.78rem', color: '#fff', fontWeight: 700 } }, `預算: NT$ ${formatNum(p.budget)} • 年股息: NT$ ${formatNum(p.stats ? p.stats.totalDividend : 0)}`),
                        h('button', { className: 'btn-secondary', style: { width: '100%', marginTop: '0.5rem', padding: '0.3rem', fontSize: '0.72rem', background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', color: '#38bdf8' } }, '🔍 點擊開啟查看完整表單')
                      )
                    )
                  )
                ),

                // Footer Buttons
                h('div', { style: { marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                  h('button', { onClick: handleSaveCurrentPortfolio, className: 'btn-primary', style: { padding: '0.55rem 1.2rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' } }, '💾 儲存目前配置為新組合'),
                  h('button', { onClick: () => { setIsPortfolioOpen(false); setSelectedSavedPortfolio(null); }, className: 'btn-secondary', style: { padding: '0.55rem 1.2rem', fontSize: '0.85rem' } }, '關閉視窗')
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

            // Hot Stocks Horizontal Scrollable Carousel Modal
            isHotStocksModalOpen && h('div', { style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' } },
              h('div', { className: 'glass-panel', style: { width: '100%', maxWidth: '1000px', padding: '1.5rem', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)', border: '1px solid rgba(245, 158, 11, 0.5)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' } },
                // Modal Header
                h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' } },
                  h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.6rem' } },
                    h('span', { style: { fontSize: '1.4rem' } }, '🔥'),
                    h('div', null,
                      h('h2', { className: 'gradient-text', style: { fontSize: '1.25rem', fontWeight: 800 } }, '全球熱門飆股與焦點標的 (橫向可滑動速覽視窗)'),
                      h('p', { style: { fontSize: '0.78rem', color: 'var(--text-secondary)' } }, '👈 向左/向右滑動（或點擊兩側箭頭）即刻速覽台美熱門焦點 ➔')
                    )
                  ),
                  h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
                    h('button', { onClick: () => scrollHotCarousel('left'), className: 'btn-secondary', style: { padding: '0.4rem 0.75rem', fontWeight: 900 } }, '◀ 往左滾動'),
                    h('button', { onClick: () => scrollHotCarousel('right'), className: 'btn-secondary', style: { padding: '0.4rem 0.75rem', fontWeight: 900 } }, '往右滾動 ▶'),
                    h('button', { onClick: () => setIsHotStocksModalOpen(false), className: 'btn-icon', style: { fontSize: '1.1rem', marginLeft: '0.5rem' } }, '✕')
                  )
                ),

                // Horizontal Scrollable Track Container
                h('div', {
                  ref: hotCarouselRef,
                  style: {
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '1rem',
                    padding: '1rem 0.5rem',
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    marginBottom: '1rem'
                  }
                },
                  currentStocks.filter(s => ['2330', 'NVDA', '0050', 'AAPL', '00878', 'MSFT', '2603', 'TSLA', 'AMZN', 'GOOGL', 'META', 'AMD', 'AVGO', '0056', '2881', 'SCHD', 'VOO', 'QQQ'].includes(s.ticker) || s.yield > 6.0).map(stock =>
                    h('div', {
                      key: stock.ticker,
                      style: {
                        minWidth: '240px',
                        maxWidth: '240px',
                        flexShrink: 0,
                        background: 'rgba(15, 23, 42, 0.85)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '12px',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                        transition: 'transform 0.2s'
                      }
                    },
                      h('div', null,
                        h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' } },
                          h('div', null,
                            h('div', { style: { fontWeight: 800, fontSize: '0.95rem', color: '#fff' } }, stock.name),
                            h('div', { style: { fontSize: '0.72rem', color: 'var(--text-secondary)' } }, `${stock.ticker} · ${stock.market}`)
                          ),
                          h('span', {
                            style: {
                              color: stock.changePercent >= 0 ? '#10b981' : '#ef4444',
                              background: stock.changePercent >= 0 ? 'rgba(16, 185, 129, 0.18)' : 'rgba(239, 68, 68, 0.18)',
                              padding: '0.2rem 0.45rem',
                              borderRadius: '6px',
                              fontWeight: 800,
                              fontSize: '0.78rem'
                            }
                          }, `${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent}%`)
                        ),
                        h('div', { style: { fontSize: '1.3rem', fontWeight: 900, color: '#38bdf8', margin: '0.5rem 0' } },
                          stock.currency === 'USD' ? `$${stock.price}` : `${stock.price} 元`
                        ),
                        h('div', { style: { fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem' } },
                          stock.yield > 0 && h('span', { style: { color: '#34d399', fontWeight: 700 } }, `殖利率 ${stock.yield}%`),
                          stock.pe > 0 && h('span', null, `本益比 ${stock.pe}x`)
                        )
                      ),
                      h('div', { style: { display: 'flex', gap: '0.35rem', marginTop: '0.8rem' } },
                        h('button', {
                          onClick: () => { setIsHotStocksModalOpen(false); handleSend(`深度拆解分析標的 ${stock.name} (${stock.ticker})`); },
                          style: { flex: 1, background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8', padding: '0.3rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }
                        }, '✨ AI 拆解'),
                        h('button', {
                          onClick: () => toggleCompare(stock),
                          style: { background: compareList.some(s => s.ticker === stock.ticker) ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.08)', border: 'none', color: compareList.some(s => s.ticker === stock.ticker) ? '#090d16' : '#fff', padding: '0.3rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }
                        }, '⚖️')
                      )
                    )
                  )
                ),

                // Footer Close button
                h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                  h('span', { style: { fontSize: '0.75rem', color: 'var(--text-muted)' } }, '💡 提示：按住滑鼠拖曳或使用觸控板左右滑動，亦可使用上方箭頭按鈕快速滾動。'),
                  h('button', { onClick: () => setIsHotStocksModalOpen(false), className: 'btn-secondary', style: { padding: '0.4rem 1.2rem' } }, '關閉視窗')
                )
              )
            ),

            // Comprehensive Institutional-Grade AI Stock Analysis View
            selectedStock && h('div', { style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,8,16,0.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' } },
              h('div', { className: 'glass-panel', style: { width: '100%', maxWidth: '850px', padding: '1.75rem', maxHeight: '92vh', overflowY: 'auto', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)', border: '1px solid rgba(56, 189, 248, 0.4)', boxShadow: '0 25px 60px rgba(0,0,0,0.7)' } },
                
                // Header Bar
                h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' } },
                  h('div', null,
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' } },
                      h('h2', { className: 'gradient-text', style: { fontSize: '1.5rem', fontWeight: 900 } }, selectedStock.name),
                      h('span', { className: `pill-badge ${selectedStock.market === 'US' ? 'pill-purple' : 'pill-cyan'}`, style: { fontSize: '0.75rem', fontWeight: 800 } }, `${selectedStock.market} • ${selectedStock.ticker}`),
                      h('span', { className: 'pill-badge pill-emerald', style: { fontSize: '0.75rem' } }, selectedStock.sector)
                    ),
                    h('p', { style: { fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.3rem' } }, selectedStock.summary || `${selectedStock.name} 即時數據與多維度深度分析研判。`)
                  ),
                  h('div', { style: { textAlign: 'right' } },
                    h('div', { style: { fontSize: '1.5rem', fontWeight: 900, color: '#38bdf8' } },
                      selectedStock.currency === 'USD' ? `$${selectedStock.price} USD` : `${selectedStock.price} NTD`
                    ),
                    h('span', {
                      style: {
                        color: selectedStock.changePercent >= 0 ? '#10b981' : '#ef4444',
                        background: selectedStock.changePercent >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        display: 'inline-block',
                        marginTop: '0.2rem'
                      }
                    }, `${selectedStock.changePercent >= 0 ? '▲ +' : '▼ '}${selectedStock.changePercent}%`),
                    h('button', { onClick: () => setSelectedStock(null), className: 'btn-icon', style: { marginLeft: '0.75rem', fontSize: '1.2rem' } }, '✕')
                  )
                ),

                // 1. Eight Core Metric Matrix Cards
                h('div', { style: { marginBottom: '1.5rem' } },
                  h('h4', { style: { fontSize: '0.88rem', fontWeight: 800, color: 'var(--accent-emerald)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' } },
                    h('span', null, '📊'), h('span', null, '核心基本面與估值指標矩陣：')
                  ),
                  h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' } },
                    [
                      { label: '本益比 (P/E)', val: selectedStock.pe ? `${selectedStock.pe} 倍` : '無', sub: selectedStock.pe < 15 ? '🟢 估值合理' : '偏高', color: '#38bdf8' },
                      { label: '股價淨值比 (P/B)', val: selectedStock.pb ? `${selectedStock.pb} 倍` : '無', sub: '資產品質', color: '#a78bfa' },
                      { label: '股息殖利率', val: selectedStock.yield ? `${selectedStock.yield}%` : '無', sub: selectedStock.yield >= 5 ? '💰 高配息' : '標準', color: '#34d399' },
                      { label: '股東權益率 ROE', val: selectedStock.roe ? `${selectedStock.roe}%` : '無', sub: selectedStock.roe >= 15 ? '🔥 高獲利' : '一般', color: '#f59e0b' },
                      { label: '營收年增率 YoY', val: selectedStock.revenueGrowth ? `${selectedStock.revenueGrowth}%` : '無', sub: selectedStock.revenueGrowth > 0 ? '📈 正成長' : '衰退', color: '#ec4899' },
                      { label: '每股盈餘 EPS', val: selectedStock.eps ? `${selectedStock.currency==='USD'?'$':''}${selectedStock.eps}` : '無', sub: '獲利基本面', color: '#10b981' }
                    ].map((m, idx) =>
                      h('div', { key: idx, className: 'glass-panel', style: { padding: '0.65rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.7)' } },
                        h('div', { style: { fontSize: '0.7rem', color: 'var(--text-muted)' } }, m.label),
                        h('div', { style: { fontSize: '1.05rem', fontWeight: 800, color: m.color, margin: '0.2rem 0' } }, m.val),
                        h('div', { style: { fontSize: '0.65rem', color: 'var(--text-secondary)' } }, m.sub)
                      )
                    )
                  )
                ),

                // 2. Gemini 1.5 Flash Deep AI Analysis Report
                h('div', { style: { background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', padding: '1.1rem', marginBottom: '1.5rem' } },
                  h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' } },
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
                      h('span', { style: { fontSize: '1.2rem' } }, '🤖'),
                      h('h4', { style: { color: 'var(--accent-emerald)', fontSize: '0.95rem', fontWeight: 800 } }, 'Gemini 1.5 Flash 深度多維 AI 剖析報告')
                    ),
                    h('span', { className: 'pill-badge pill-purple', style: { fontSize: '0.68rem' } }, 'AI 綜合評價：強力看好 / 穩健護城河')
                  ),

                  h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' } },
                    h('div', { style: { background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid #10b981' } },
                      h('h5', { style: { color: '#34d399', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.3rem' } }, '🌟 核心產業競爭優勢 (Investment Strengths)'),
                      h('p', { style: { fontSize: '0.78rem', lineHeight: 1.5, color: '#e2e8f0' } },
                        selectedStock.aiCommentary || `${selectedStock.name} 具備強大技術壁壘與穩定現金流，產業龍頭地位穩固，基本面經營績效極佳。`
                      )
                    ),
                    h('div', { style: { background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid #f59e0b' } },
                      h('h5', { style: { color: '#fbbf24', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.3rem' } }, '⚠️ 潛在營運風險與估值觀察 (Risk Factors)'),
                      h('p', { style: { fontSize: '0.78rem', lineHeight: 1.5, color: '#cbd5e1' } },
                        `需留意整體總體經濟利率變動與行業庫存週期調節，若本益比 (${selectedStock.pe || 25}x) 短線過度拉升宜等待拉回回測均線再行佈局。`
                      )
                    )
                  )
                ),

                // 3. Three-Dimensional Score Radar & 20+ Technical Indicators
                h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' } },
                  // 3-Dimension Score Radar
                  h('div', { className: 'glass-panel', style: { padding: '1rem' } },
                    h('h4', { style: { fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '0.75rem' } }, '📈 三大面向體質評分儀表板：'),
                    [
                      { label: '🏢 基本面獲利體質 (Fundamental)', score: Math.min(98, Math.max(70, Math.round((selectedStock.roe || 15) * 2 + 50))), color: '#10b981' },
                      { label: '📈 技術面均線動能 (Technical)', score: selectedStock.maAlign && selectedStock.breakMa60 ? 95 : 78, color: '#38bdf8' },
                      { label: '🏦 籌碼面法人集中度 (Chip Focus)', score: selectedStock.institutionalBuy ? 92 : 75, color: '#a78bfa' }
                    ].map((item, idx) =>
                      h('div', { key: idx, style: { marginBottom: '0.65rem' } },
                        h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' } },
                          h('span', { style: { color: 'var(--text-secondary)' } }, item.label),
                          h('span', { style: { color: item.color, fontWeight: 800 } }, `${item.score} 分 / 100`)
                        ),
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
                      onClick: () => {
                        if (selectedStock) {
                          const target = selectedStock;
                          setSelectedStock(null);
                          handleSend("深度拆解與建議配置標的 " + target.name + " (" + target.ticker + ")");
                        }
                      },
                      className: 'btn-primary',
                      style: { fontSize: '0.8rem', padding: '0.45rem 1rem' }
                    }, '💬 連線 AI 深度對話追問'),
                    h('button', {
                      onClick: () => { if (selectedStock) toggleCompare(selectedStock); },
                      className: 'btn-secondary',
                      style: { fontSize: '0.8rem' }
                    }, selectedStock && compareList.some(s => s.ticker === selectedStock.ticker) ? '⚖️ 取消對比' : '⚖️ 加入對比'),
                    h('button', {
                      onClick: () => { if (selectedStock) toggleWatchlist(selectedStock); },
                      className: 'btn-secondary',
                      style: { fontSize: '0.8rem' }
                    }, selectedStock && watchlist.some(s => s.ticker === selectedStock.ticker) ? '⭐ 取消觀察' : '⭐ 加入觀察名單')
                  ),
                  h('button', { onClick: () => setSelectedStock(null), className: 'btn-secondary', style: { padding: '0.45rem 1.25rem' } }, '關閉分析視窗')
                )
              )
            )
          );
        }

        ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
      })();
    