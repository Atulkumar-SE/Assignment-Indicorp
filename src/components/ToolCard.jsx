import React from 'react';
import { Edit, Trash2, ArrowUpRight, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import { getCurrentSession } from '../utils/localStorageHelpers';

export default function ToolCard({ tool, onEdit, onDelete, onIssue }) {
  const session = getCurrentSession();
  const isAdmin = session?.role === 'admin';
  
  const { toolName, category, inventoryNumber, quantity, image } = tool;

  // Stock status styling helper
  const getStockStatus = (qty) => {
    if (qty === 0) {
      return {
        label: 'Out of Stock',
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        text: 'text-rose-600',
        icon: <AlertOctagon className="w-3.5 h-3.5" />,
        color: 'bg-rose-500'
      };
    } else if (qty <= 3) {
      return {
        label: 'Low Stock',
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        text: 'text-amber-600',
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
        color: 'bg-amber-500'
      };
    } else {
      return {
        label: 'In Stock',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        text: 'text-emerald-600',
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        color: 'bg-emerald-500'
      };
    }
  };

  const status = getStockStatus(quantity);

  // Category visual badge helper
  const getCategoryStyles = (cat) => {
    const formatted = cat.toLowerCase();
    if (formatted.includes('drill')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (formatted.includes('hammer')) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (formatted.includes('wrench')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (formatted.includes('screwd')) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (formatted.includes('plier')) return 'bg-teal-50 text-teal-700 border-teal-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  // Stock gauge width (capped at 15 for 100%)
  const gaugeWidth = Math.min((quantity / 15) * 100, 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group animate-fade-in">
      {/* Tool Thumbnail */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <img 
          src={image} 
          alt={toolName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=300';
          }}
        />
        {/* Category Badge overlay */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-lg border backdrop-blur-md shadow-sm ${getCategoryStyles(category)}`}>
          {category}
        </span>
        
        {/* Quantity status overlay */}
        <span className={`absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg border backdrop-blur-md shadow-sm ${status.badge}`}>
          {status.icon}
          <span>{status.label}</span>
        </span>
      </div>

      {/* Tool Specs */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
            ID: {inventoryNumber}
          </span>
          <h3 className="text-sm font-bold text-slate-800 line-clamp-1 mt-1 group-hover:text-blue-600 transition-colors" title={toolName}>
            {toolName}
          </h3>

          {/* Stock Level Indicator */}
          <div className="mt-4">
            <div className="flex justify-between items-center text-xs font-medium text-slate-500 mb-1">
              <span>Stock Level</span>
              <span className={`font-bold ${status.text}`}>{quantity} available</span>
            </div>
            {/* Visual Stock Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${status.color}`}
                style={{ width: `${gaugeWidth}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Buttons based on User Context */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
          {isAdmin ? (
            <>
              <button
                onClick={() => onEdit(tool)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg border border-blue-200 transition-colors focus:outline-none"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Stock</span>
              </button>
              <button
                onClick={() => onDelete(tool.id)}
                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition-colors focus:outline-none"
                title="Delete Tool"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => onIssue(tool)}
              disabled={quantity === 0}
              className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold rounded-xl transition-all focus:outline-none ${
                quantity === 0
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 hover:shadow-blue-500/20'
              }`}
            >
              <span>Request / Issue Tool</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
