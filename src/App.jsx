import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import ScreenerFilterPanel from './components/ScreenerFilterPanel';
import StockGrid from './components/StockGrid';
import StockDetailModal from './components/StockDetailModal';
import StockCompareModal from './components/StockCompareModal';
import WatchlistDrawer from './components/WatchlistDrawer';
import PortfolioBuilderModal from './components/PortfolioBuilderModal';

import { stocksData as initialStocksData } from './data/stocksData';
import { parseNaturalLanguageQuery, filterAndRankStocks, generateAIResponse } from './services/aiScreenerEngine';
import { syncRealtimeStockDatabase } from './services/realtimeStockService';

export default function App() {
  const [currentStocks, setCurrentStocks] = useState(initialStocksData);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('即時數據');

  // Filters state
  const [activeMarket, setActiveMarket] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minYield: 0,
    maxPe: null,
    minRoe: 0,
    minRevenueGrowth: 0,
    maxBeta: null,
    sector: 'ALL'
  });

  const [activeParsedTags, setActiveParsedTags] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modals & Drawers state
  const [selectedStock, setSelectedStock] = useState(null);
  const [watchlist, setWatchlist] = useState([
    initialStocksData[0], // TSMC
    initialStocksData[3]  // Fubon
  ]);
  const [compareList, setCompareList] = useState([]);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isPortfolioBuilderOpen, setIsPortfolioBuilderOpen] = useState(false);

  // Real-time API Sync Handler
  const handleSyncRealtimeData = async () => {
    setIsSyncing(true);
    try {
      const result = await syncRealtimeStockDatabase(currentStocks);
      setCurrentStocks(result.stocks);
      setLastSyncTime(result.timestamp);
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Compute filtered & ranked stocks
  const screenedStocks = useMemo(() => {
    let list = currentStocks;

    if (activeMarket !== 'ALL') {
      list = list.filter(s => s.market === activeMarket);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.ticker.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q));
    }

    const effectiveFilters = {
      ...filters,
      market: activeMarket
    };

    return filterAndRankStocks(list, effectiveFilters);
  }, [currentStocks, activeMarket, searchTerm, filters]);

  // Handle AI conversational query
  const handleAIScreen = (userQuery, callback) => {
    setIsProcessing(true);

    setTimeout(() => {
      if (userQuery.includes("組合") || userQuery.includes("配置") || userQuery.includes("比例") || userQuery.includes("預算") || userQuery.includes("萬")) {
        setIsPortfolioBuilderOpen(true);
      }

      const { filters: extractedFilters, extractedTags } = parseNaturalLanguageQuery(userQuery);
      
      setFilters(prev => ({
        ...prev,
        ...extractedFilters
      }));

      setActiveParsedTags(extractedTags);

      const matched = filterAndRankStocks(currentStocks, { ...filters, ...extractedFilters, market: activeMarket });
      const response = generateAIResponse(userQuery, matched, extractedTags);

      setIsProcessing(false);
      if (callback) callback(response);
    }, 500);
  };

  const handleResetFilters = () => {
    setFilters({
      minYield: 0,
      maxPe: null,
      minRoe: 0,
      minRevenueGrowth: 0,
      maxBeta: null,
      sector: 'ALL'
    });
    setActiveParsedTags([]);
    setSearchTerm('');
  };

  const handleToggleWatchlist = (stock) => {
    setWatchlist(prev => {
      const exists = prev.some(s => s.ticker === stock.ticker);
      if (exists) {
        return prev.filter(s => s.ticker !== stock.ticker);
      } else {
        return [...prev, stock];
      }
    });
  };

  const handleToggleCompare = (stock) => {
    setCompareList(prev => {
      const exists = prev.some(s => s.ticker === stock.ticker);
      if (exists) {
        return prev.filter(s => s.ticker !== stock.ticker);
      } else {
        if (prev.length >= 4) {
          alert('最多可同時對比 4 檔股票！');
          return prev;
        }
        return [...prev, stock];
      }
    });
  };

  const handleAddAllPortfolioToWatchlist = (items) => {
    setWatchlist(prev => {
      const newItems = items.filter(item => !prev.some(s => s.ticker === item.ticker));
      return [...prev, ...newItems];
    });
  };

  return (
    <div className="app-container">
      
      {/* Header */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeMarket={activeMarket}
        setActiveMarket={setActiveMarket}
        watchlistCount={watchlist.length}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        compareCount={compareList.length}
        onOpenCompare={() => {
          if (compareList.length === 0) {
            alert('請先在股票卡片點擊「對比」按鈕加入標的！');
            return;
          }
          setIsCompareOpen(true);
        }}
        onOpenPortfolioBuilder={() => setIsPortfolioBuilderOpen(true)}
        onSyncRealtimeData={handleSyncRealtimeData}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
      />

      {/* Main Two-Column Layout */}
      <div className="main-grid">
        
        {/* Left Column: AI Chat */}
        <div>
          <ChatInterface
            onAIScreen={handleAIScreen}
            activeParsedTags={activeParsedTags}
            isProcessing={isProcessing}
          />
        </div>

        {/* Right Column: Screener Controls & Stock Cards Grid */}
        <div>
          <ScreenerFilterPanel
            filters={filters}
            setFilters={setFilters}
            onResetFilters={handleResetFilters}
          />

          <StockGrid
            stocks={screenedStocks}
            onSelectStock={(stock) => setSelectedStock(stock)}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            onResetFilters={handleResetFilters}
          />
        </div>

      </div>

      {/* Stock Detail Modal */}
      {selectedStock && (
        <StockDetailModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          isWatchlisted={watchlist.some(s => s.ticker === selectedStock.ticker)}
          onToggleWatchlist={handleToggleWatchlist}
          isCompared={compareList.some(s => s.ticker === selectedStock.ticker)}
          onToggleCompare={handleToggleCompare}
        />
      )}

      {/* Stock Compare Modal */}
      {isCompareOpen && (
        <StockCompareModal
          compareList={compareList}
          onClose={() => setIsCompareOpen(false)}
          onRemoveFromCompare={(ticker) => setCompareList(prev => prev.filter(s => s.ticker !== ticker))}
          onClearCompare={() => { setCompareList([]); setIsCompareOpen(false); }}
        />
      )}

      {/* Watchlist Drawer */}
      <WatchlistDrawer
        watchlist={watchlist}
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        onRemove={(ticker) => setWatchlist(prev => prev.filter(s => s.ticker !== ticker))}
        onSelectStock={(stock) => setSelectedStock(stock)}
      />

      {/* AI Portfolio Builder Modal */}
      <PortfolioBuilderModal
        isOpen={isPortfolioBuilderOpen}
        onClose={() => setIsPortfolioBuilderOpen(false)}
        onAddAllToWatchlist={handleAddAllPortfolioToWatchlist}
      />

    </div>
  );
}
