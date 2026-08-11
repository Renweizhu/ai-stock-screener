// Real-time Stock Data Sync Service (證券交易所 & 國際金融即時數據同步服務)

const TWSE_API_URL = "https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_ALL";

/**
 * Fetch latest TWSE P/E, Yield, P/B ratios for Taiwan Listed Stocks
 */
export async function fetchTWSEData() {
  try {
    const res = await fetch(TWSE_API_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`TWSE HTTP ${res.status}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.warn("TWSE Live API direct fetch constrained by CORS/Network, utilizing dynamic live fallback:", err);
    return null;
  }
}

/**
 * Fetch real-time price & change percent for US/TW stocks via Yahoo Finance API
 */
export async function fetchLivePrice(symbol) {
  const formattedSymbol = symbol.endsWith('.TW') || symbol.length === 4 ? `${symbol}.TW` : symbol;
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}?interval=1d`)}`;

  try {
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error("Price API HTTP Error");
    const data = await res.json();
    const meta = data.chart.result[0].meta;
    const currentPrice = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose;
    const changePercent = prevClose ? ((currentPrice - prevClose) / prevClose) * 100 : 0;

    return {
      price: currentPrice,
      changePercent: parseFloat(changePercent.toFixed(2))
    };
  } catch (err) {
    console.warn(`Could not fetch live price for ${symbol}:`, err);
    return null;
  }
}

/**
 * Merge live API data into our stock database
 */
export async function syncRealtimeStockDatabase(currentStocksData) {
  let updatedCount = 0;
  const twseData = await fetchTWSEData();

  const twseMap = {};
  if (twseData && Array.isArray(twseData)) {
    twseData.forEach(item => {
      if (item.Code) {
        twseMap[item.Code] = item;
      }
    });
  }

  const updatedStocks = await Promise.all(currentStocksData.map(async (stock) => {
    let updatedStock = { ...stock };

    // Update TWSE financials if available
    if (stock.market === 'TW' && twseMap[stock.ticker]) {
      const tw = twseMap[stock.ticker];
      if (tw.PEratio && !isNaN(parseFloat(tw.PEratio))) updatedStock.pe = parseFloat(tw.PEratio);
      if (tw.DividendYield && !isNaN(parseFloat(tw.DividendYield))) updatedStock.yield = parseFloat(tw.DividendYield);
      if (tw.PBratio && !isNaN(parseFloat(tw.PBratio))) updatedStock.pb = parseFloat(tw.PBratio);
      updatedCount++;
    }

    // Attempt live price update
    const livePriceData = await fetchLivePrice(stock.ticker);
    if (livePriceData) {
      updatedStock.price = livePriceData.price;
      updatedStock.changePercent = livePriceData.changePercent;
      updatedCount++;
    }

    return updatedStock;
  }));

  return {
    stocks: updatedStocks,
    updatedCount,
    timestamp: new Date().toLocaleTimeString()
  };
}
