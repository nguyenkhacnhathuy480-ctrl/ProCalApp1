import React, { useState } from 'react';
import { X, Lock, CheckCircle, Crown, CreditCard, Copy, MessageCircle } from 'lucide-react';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onActivate now supports async activation
  onActivate: (code: string) => Promise<boolean>;
}

export const ProModal: React.FC<ProModalProps> = ({ isOpen, onClose, onActivate }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(false);

    try {
      const activated = await onActivate(code);
      if (activated) {
        setSuccess(true);
        setError(false);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setCode('');
        }, 1500);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Activation failed", err);
      setError(true);
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('1028587072');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Copy failed", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative transform transition-all scale-100 max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-100 transition-colors z-10"
          aria-label="Close"
        >
          <X size={24} className="text-slate-500" />
        </button>

        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown size={32} className="text-indigo-600" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Nâng cấp lên PRO</h2>
          <p className="text-slate-500 mb-5 text-sm">
            Mở khóa toàn bộ tính năng cao cấp
          </p>

          <ul className="text-left space-y-2 mb-6 px-2">
            <li className="flex items-center text-sm text-slate-700">
              <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
              <span>Lưu lịch sử không giới hạn</span>
            </li>
            <li className="flex items-center text-sm text-slate-700">
              <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
              <span>Xuất dữ liệu ra Excel/CSV</span>
            </li>
            <li className="flex items-center text-sm text-slate-700">
              <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
              <span>Không quảng cáo</span>
            </li>
          </ul>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-left shadow-sm">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <CreditCard size={16} className="text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">Thông tin chuyển khoản</h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs uppercase tracking-wide">Ngân hàng</span>
                <span className="font-bold text-slate-900">Vietcombank</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs uppercase tracking-wide">Chủ TK</span>
                <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">NGUYEN KHAC NHAT HUY</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs uppercase tracking-wide">STK</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md hover:bg-indigo-100 transition-colors border border-indigo-100"
                >
                  1028587072
                  {copied ? <CheckCircle size={12} className="text-green-600" /> : <Copy size={12} />}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs uppercase tracking-wide">Số tiền</span>
                <span className="font-bold text-slate-900">19.000đ</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-3 bg-white p-2 rounded border border-slate-100 text-center leading-relaxed">
              Nội dung: <span className="font-mono font-bold text-indigo-600">PRO + SĐT của bạn</span>
            </p>
          </div>

          {success ? (
            <div className="bg-green-100 text-green-800 p-3 rounded-xl font-medium flex items-center justify-center animate-bounce">
              <CheckCircle size={20} className="mr-2" />
              Đã kích hoạt PRO!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Nhập mã kích hoạt đã nhận"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all text-center font-mono uppercase tracking-widest ${error ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                  disabled={processing}
                />
                {error && <p className="text-red-500 text-xs mt-1">Mã không đúng. Vui lòng kiểm tra lại.</p>}
              </div>
              <button
                type="submit"
                disabled={processing}
                className={`w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center ${processing ? 'opacity-80 cursor-wait' : ''}`}
              >
                <Lock size={18} className="mr-2" />
                {processing ? 'Đang xử lý...' : 'Kích Hoạt Ngay'}
              </button>
            </form>
          )}

          <div className="mt-4 flex items-center justify-center gap-1 text-[10px] text-slate-400">
            <MessageCircle size={12} />
            <span>Liên hệ Admin để nhận mã sau khi chuyển khoản</span>
          </div>
        </div>
      </div>
    </div>
  );
};