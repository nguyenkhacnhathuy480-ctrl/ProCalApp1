// NOTE: Only minimal change required in App.tsx — usePro now returns an async activatePro.
// We just pass it to ProModal (which now awaits it). No further change required here.

import React, { useState, useEffect, useMemo } from 'react';
import { Settings, History, Calculator, Save, Crown, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { Inputs, CalculationResult, HistoryItem, AppView } from './types';
import { calculateProfit, formatCurrency } from './utils/calculations';
import { usePro } from './hooks/usePro';
import { INITIAL_INPUTS, STORAGE_KEY_HISTORY } from './constants';
import { CalculatorInput } from './components/CalculatorInput';
import { ProModal } from './components/ProModal';
import { HistoryView } from './components/HistoryView';
import { AdBanner } from './components/AdBanner';

const App: React.FC = () => {
  const { isPro, activatePro } = usePro();
  const [view, setView] = useState<AppView>(AppView.CALCULATOR);
  const [inputs, setInputs] = useState<Inputs>(INITIAL_INPUTS);
  const [productName, setProductName] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showProModal, setShowProModal] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history when updated
  useEffect(() => {
    if (isPro) { // Only save if Pro to avoid loophole if they lose Pro status
       localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    }
  }, [history, isPro]);

  // Real-time calculation
  const results: CalculationResult = useMemo(() => calculateProfit(inputs), [inputs]);

  const handleInputChange = (field: keyof Inputs, value: number | '') => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!isPro) {
      setShowProModal(true);
      return;
    }

    if (!inputs.sellingPrice || !inputs.purchasePrice) {
      alert("Vui lòng nhập giá nhập và giá bán.");
      return;
    }

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      inputs: { ...inputs },
      result: { ...results },
      productName: productName || `Sản phẩm ${history.length + 1}`
    };

    setHistory(prev => [newItem, ...prev]);
    setProductName('');
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const handleClearHistory = () => {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả lịch sử không?')) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    }
  };

  const handleExport = () => {
    if (!isPro) return;
    
    // Updated headers for Vietnamese
    const headers = ['Ngày', 'Tên sản phẩm', 'Giá nhập', 'Giá bán', 'Phí sàn %', 'Phí Ship', 'Quảng cáo', 'Tổng chi phí', 'Lợi nhuận', 'Tỷ suất %', 'ROI %'];
    const rows = history.map(item => [
      new Date(item.date).toLocaleDateString('vi-VN'),
      item.productName,
      item.inputs.purchasePrice,
      item.inputs.sellingPrice,
      item.inputs.platformFeePercent,
      item.inputs.shippingFee,
      item.inputs.adCost,
      item.result.totalCost.toFixed(0),
      item.result.profit.toFixed(0),
      item.result.margin.toFixed(2),
      item.result.roi.toFixed(2)
    ]);

    // Add BOM for Excel correct encoding of Vietnamese characters
    const bom = "\uFEFF";
    const csvContent = "data:text/csv;charset=utf-8," + bom
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lich_su_loi_nhuan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* ...rest unchanged... */}
      <ProModal 
        isOpen={showProModal} 
        onClose={() => setShowProModal(false)} 
        onActivate={activatePro} 
      />
    </div>
  );
};

export default App;