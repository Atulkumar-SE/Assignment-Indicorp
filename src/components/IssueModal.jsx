import React, { useState } from 'react';
import { X, Wrench, ChevronRight, AlertTriangle } from 'lucide-react';

export default function IssueModal({ tool, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  const { toolName, category, inventoryNumber, quantity: stockQty, image } = tool;

  const handleQtyChange = (val) => {
    setError('');
    const num = Number(val);
    
    if (isNaN(num) || num <= 0) {
      setQuantity(1);
      return;
    }
    
    if (num > stockQty) {
      setError(`Cannot issue more than available stock (${stockQty}).`);
      setQuantity(stockQty);
      return;
    }

    setQuantity(num);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantity <= 0) {
      setError('Quantity must be at least 1.');
      return;
    }
    if (quantity > stockQty) {
      setError(`Insufficient stock. Only ${stockQty} units available.`);
      return;
    }

    onConfirm(tool.id, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            <span>Issue Tool Request</span>
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tool Card Info */}
          <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
            <img 
              src={image} 
              alt={toolName} 
              className="w-16 h-16 rounded-lg object-cover border border-slate-200"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189';
              }}
            />
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">
                {inventoryNumber} &bull; {category}
              </span>
              <h4 className="font-bold text-slate-800 text-sm truncate" title={toolName}>
                {toolName}
              </h4>
              <span className="text-xs text-slate-500 font-semibold mt-0.5 inline-block">
                In Stock: <span className="text-blue-600 font-bold">{stockQty} units</span>
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              Select Quantity to Issue
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQtyChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none font-bold"
              >
                -
              </button>
              
              <input
                type="number"
                min="1"
                max={stockQty}
                value={quantity}
                onChange={(e) => handleQtyChange(e.target.value)}
                className="flex-1 w-20 text-center px-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-bold text-base focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />

              <button
                type="button"
                onClick={() => handleQtyChange(quantity + 1)}
                disabled={quantity >= stockQty}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none font-bold"
              >
                +
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 mt-3 text-xs text-rose-600 font-semibold bg-rose-50/55 p-2 rounded-lg border border-rose-100">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-400 bg-blue-50/40 border border-blue-100 p-3 rounded-xl leading-relaxed">
            <span className="font-semibold text-blue-800 block mb-0.5">Note on Issuing:</span>
            By issuing this tool, stock will decrement immediately. It will be logged in the active registers under your name and mechanic level. Please return it when work is completed.
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 flex items-center justify-center gap-1 transition-all focus:outline-none"
            >
              <span>Confirm Checkout</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
