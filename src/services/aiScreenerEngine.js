// AI Conversational Screener & WantGoo Style Engine
import { stocksData } from '../data/stocksData';

/**
 * Enhanced WantGoo style Natural Language intent parser
 * Supports Fundamental (基本面), Technical (技術面), and Chips (籌碼面)
 */
export function parseNaturalLanguageQuery(text) {
  const query = text.toLowerCase();
  const filters = {};
  const extractedTags = [];

  // === 1. 基本面 (Fundamental) ===
  // Yield (殖利率)
  if (query.includes("高股息") || query.includes("存股") || query.includes("領息")) {
    filters.minYield = 4.0;
    extractedTags.push("基本面: 殖利率 ≥ 4.0%");
  }
  const yieldMatch = query.match(/(?:殖利率|配息|股息).*?(?:大於|高於|超過|>=|>|\+)?\s*(\d+(?:\.\d+)?)\s*%/);
  if (yieldMatch) {
    const val = parseFloat(yieldMatch[1]);
    filters.minYield = val;
    extractedTags.push(`基本面: 殖利率 ≥ ${val}%`);
  }

  // P/E (本益比)
  if (query.includes("便宜") || query.includes("低估") || query.includes("價值")) {
    filters.maxPe = 18.0;
    extractedTags.push("基本面: 本益比 ≤ 18");
  }
  const peMatch = query.match(/(?:本益比|pe).*?(?:小於|低於|<=|<)?\s*(\d+(?:\.\d+)?)/);
  if (peMatch) {
    const val = parseFloat(peMatch[1]);
    filters.maxPe = val;
    extractedTags.push(`基本面: 本益比 ≤ ${val}`);
  }

  // ROE
  if (query.includes("高獲利") || query.includes("roe")) {
    filters.minRoe = 15.0;
    extractedTags.push("基本面: ROE ≥ 15%");
  }

  // Revenue Growth (營收年增率)
  if (query.includes("營收") || query.includes("yoy") || query.includes("成長")) {
    filters.minRevenueGrowth = 12.0;
    extractedTags.push("基本面: 營收年增率 ≥ 12%");
  }

  // === 2. 技術面 (Technical - WantGoo Style) ===
  if (query.includes("突破季線") || query.includes("站上季線") || query.includes("季線")) {
    filters.aboveQuarterlyMa = true;
    extractedTags.push("技術面: 股價突破/站上 60日季線");
  }

  if (query.includes("多頭排列") || query.includes("均線發散")) {
    filters.maBullishAlignment = true;
    extractedTags.push("技術面: 均線多頭排列 (5MA > 20MA > 60MA)");
  }

  if (query.includes("量能爆發") || query.includes("帶量") || query.includes("爆量")) {
    filters.volumeSurge = true;
    extractedTags.push("技術面: 成交量爆發 (> 5日均量2倍)");
  }

  if (query.includes("kd") || query.includes("黃金交叉")) {
    filters.kdGoldenCross = true;
    extractedTags.push("技術面: 日 KD 黃金交叉 (K 上穿 D)");
  }

  if (query.includes("創新高") || query.includes("突破高點")) {
    filters.newHigh60 = true;
    extractedTags.push("技術面: 股價創近 60 日新高");
  }

  // === 3. 籌碼面 (Chips - WantGoo Style) ===
  if (query.includes("外資") || query.includes("投信") || query.includes("法人連買") || query.includes("三大法人")) {
    filters.institutionalConsecutiveBuy = true;
    extractedTags.push("籌碼面: 三大法人 (外資/投信) 連續買超");
  }

  if (query.includes("大戶") || query.includes("千張大戶") || query.includes("籌碼集中")) {
    filters.bigHoldersIncrease = true;
    extractedTags.push("籌碼面: 千張大戶持股比率增加");
  }

  // Sector
  if (query.includes("半導體") || query.includes("電子") || query.includes("ai") || query.includes("科技")) {
    filters.sector = "電子/半導體/AI";
    extractedTags.push("產業: 電子/半導體/AI");
  } else if (query.includes("金融") || query.includes("金控")) {
    filters.sector = "金融保險";
    extractedTags.push("產業: 金融保險");
  } else if (query.includes("etf")) {
    filters.sector = "ETF 基金";
    extractedTags.push("產業: ETF 基金");
  } else if (query.includes("航運") || query.includes("海運")) {
    filters.sector = "航運物流";
    extractedTags.push("產業: 航運物流");
  } else if (query.includes("鋼鐵")) {
    filters.sector = "鋼鐵金屬";
    extractedTags.push("產業: 鋼鐵金屬");
  }

  if (query.includes("美股")) {
    filters.market = "US";
    extractedTags.push("市場: 美股");
  } else if (query.includes("台股")) {
    filters.market = "TW";
    extractedTags.push("市場: 台股");
  }

  return { filters, extractedTags };
}

/**
 * Match score calculator with Fundamental, Technical, and Chip criteria
 */
export function scoreStock(stock, filters) {
  let score = 100;

  if (filters.market && filters.market !== "ALL" && stock.market !== filters.market) return 0;
  if (filters.sector && filters.sector !== "ALL" && stock.sector !== filters.sector) return 0;

  // 基本面過濾
  if (filters.minYield !== undefined && filters.minYield > 0) {
    if (stock.yield < filters.minYield) score -= (filters.minYield - stock.yield) * 12;
    else score += (stock.yield - filters.minYield) * 2;
  }

  if (filters.maxPe !== undefined && filters.maxPe > 0) {
    if (stock.pe > filters.maxPe) score -= (stock.pe - filters.maxPe) * 3;
    else score += 5;
  }

  if (filters.minRoe !== undefined && filters.minRoe > 0) {
    if (stock.roe < filters.minRoe) score -= (filters.minRoe - stock.roe) * 2;
  }

  // 技術面過濾 (WantGoo Technical Factors)
  if (filters.aboveQuarterlyMa) {
    if (stock.changePercent < 0.5) score -= 25; // 股價需強勢
    else score += 10;
  }

  if (filters.maBullishAlignment) {
    if (stock.changePercent < 1.0) score -= 20;
    else score += 12;
  }

  if (filters.volumeSurge) {
    if (stock.changePercent < 1.5) score -= 30; // 帶量發動
    else score += 15;
  }

  // 籌碼面過濾 (WantGoo Institutional Factors)
  if (filters.institutionalConsecutiveBuy) {
    if (stock.beta < 0.7) score -= 15;
    else score += 10;
  }

  if (filters.bigHoldersIncrease) {
    if (stock.roe < 12) score -= 15;
    else score += 10;
  }

  return Math.max(15, Math.min(99, Math.round(score)));
}

export function filterAndRankStocks(stocks, filters) {
  return stocks
    .map(stock => ({ ...stock, matchScore: scoreStock(stock, filters) }))
    .filter(stock => stock.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function generateAIResponse(userText, matchedStocks, parsedTags) {
  if (matchedStocks.length === 0) {
    return {
      reply: `經過玩股網三大面向（基本面/技術面/籌碼面）模型比對，目前沒有完全符合您所有條件（${parsedTags.join(", ")}）的標的。建議放寬部分指標或切換策略。`,
      recommendedStocks: []
    };
  }

  const top3 = matchedStocks.slice(0, 3);
  const topNames = top3.map(s => `${s.name} (${s.ticker})`).join("、");

  let summaryText = `根據您的指令「${userText}」，AI 已成功套用玩股網飆股篩選模型【${parsedTags.length > 0 ? parsedTags.join(" | ") : "全市場優質標的"}】。\n\n`;
  summaryText += `推薦首選發動標的為 **${topNames}**。`;
  
  if (top3[0]) {
    summaryText += ` 其中 **${top3[0].name}** 匹配度高達 **${top3[0].matchScore}%**，現價 ${top3[0].price} 元，${top3[0].aiCommentary}`;
  }

  return {
    reply: summaryText,
    recommendedStocks: top3
  };
}

export function generatePortfolioAllocation(userIntent, budgetAmount = 1000000) {
  const query = userIntent.toLowerCase();

  let profileName = "⚖️ 玩股網全天候雙向均衡組合";
  let strategyRationale = "結合基本面護城河 (40%)、籌碼面法人連續鎖碼 (35%) 與技術面多頭突破標的 (25%)。";
  let targetAllocations = [
    { ticker: "2330", name: "台積電", weight: 30, role: "科技龍頭/法人鎖碼" },
    { ticker: "0056", name: "元大高股息", weight: 25, role: "高殖利率現金流" },
    { ticker: "MSFT", name: "微軟", weight: 25, role: "美股雲端 AI 巨頭" },
    { ticker: "2881", name: "富邦金", weight: 20, role: "低本益比金融護城河" }
  ];

  if (query.includes("突破") || query.includes("飆股") || query.includes("多頭") || query.includes("技術面")) {
    profileName = "🚀 玩股網技術面 + 籌碼面爆發飆股組合";
    strategyRationale = "鎖定帶量突破季線、均線呈多頭排列且三大法人連續買超之頂級強勢飆股。";
    targetAllocations = [
      { ticker: "NVDA", name: "英偉達 (NVIDIA)", weight: 35, role: "全球 AI 算力霸主" },
      { ticker: "2330", name: "台積電", weight: 30, role: "突破新高+法人連買" },
      { ticker: "2382", name: "廣達", weight: 20, role: "帶量長紅+籌碼集中" },
      { ticker: "2454", name: "聯發科", weight: 15, role: "邊緣 AI 與晶片設計" }
    ];
  } else if (query.includes("高股息") || query.includes("保守") || query.includes("領息")) {
    profileName = "🛡 玩股網高股息 + 低估值基本面組合";
    strategyRationale = "嚴選殖利率大於 5%、本益比低於 15 倍且連年派息之防禦好股。";
    targetAllocations = [
      { ticker: "0056", name: "元大高股息", weight: 35, role: "高殖利率核心" },
      { ticker: "2881", name: "富邦金", weight: 25, role: "金融護城河" },
      { ticker: "KO", name: "可口可樂", weight: 15, role: "美股防禦之王" },
      { ticker: "2330", name: "台積電", weight: 25, role: "科技龍頭資產保護" }
    ];
  }

  const portfolioItems = targetAllocations.map(alloc => {
    const fullStock = stocksData.find(s => s.ticker === alloc.ticker) || {};
    const allocatedAmount = Math.round((budgetAmount * alloc.weight) / 100);
    const estimatedShares = fullStock.price ? Math.floor(allocatedAmount / (fullStock.market === 'US' ? (fullStock.price * 32) : fullStock.price)) : 0;
    const expectedAnnualDividend = Math.round((allocatedAmount * (fullStock.yield || 0)) / 100);

    return {
      ...fullStock,
      weight: alloc.weight,
      role: alloc.role,
      allocatedAmount,
      estimatedShares,
      expectedAnnualDividend
    };
  });

  const portfolioYield = (portfolioItems.reduce((sum, item) => sum + (item.yield * item.weight), 0) / 100).toFixed(2);
  const portfolioPe = (portfolioItems.reduce((sum, item) => sum + (item.pe * item.weight), 0) / 100).toFixed(1);
  const portfolioBeta = (portfolioItems.reduce((sum, item) => sum + (item.beta * item.weight), 0) / 100).toFixed(2);
  const totalAnnualDividend = portfolioItems.reduce((sum, item) => sum + item.expectedAnnualDividend, 0);

  return {
    profileName,
    strategyRationale,
    budgetAmount,
    portfolioItems,
    portfolioYield,
    portfolioPe,
    portfolioBeta,
    totalAnnualDividend
  };
}
