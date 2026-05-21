import React from 'react';
import { Plus, Minus, Trash2, Edit2, AlertCircle } from 'lucide-react';

export default function ToolTable({ tools, onQuickUpdateQty, onEdit, onDelete }) {
  
  const getStockBadge = (qty) => {
    if (qty === 0) return 'bg-rose-50 text-rose-700 border-rose-100';
    if (qty <= 3) return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  };

  const getStockText = (qty) => {
    if (qty === 0) return 'Out of Stock';
    if (qty <= 3) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Tool ID</th>
              <th scope="col" className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Product Info</th>
              <th scope="col" className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Category</th>
              <th scope="col" className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-center">Available Stock</th>
              <th scope="col" className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-center">Status</th>
              <th scope="col" className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-right">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100 font-medium">
            {tools.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-8 h-8 text-slate-300" />
                    <p className="font-semibold text-sm">No tools matching filters found.</p>
                    <p className="text-xs text-slate-400">Register new products or clear search results to begin.</p>
                  </div>
                </td>
              </tr>
            ) : (
              tools.map((tool) => (
                <tr key={tool.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Tool Code */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-mono font-bold text-slate-400">
                    {tool.inventoryNumber}
                  </td>
                  
                  {/* Tool Image and Title */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img 
                        src={tool.image} 
                        alt={tool.toolName} 
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200/80"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189';
                        }}
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 line-clamp-1 block text-sm">{tool.toolName}</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Tool Category */}
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                    {tool.category}
                  </td>
                  
                  {/* Tool Quantity Inline Actions */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => onQuickUpdateQty(tool.id, -1)}
                        disabled={tool.quantity <= 0}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 hover:text-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-slate-800 font-bold w-6 text-center">{tool.quantity}</span>
                      <button 
                        onClick={() => onQuickUpdateQty(tool.id, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 hover:text-slate-800 transition-colors focus:outline-none"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  
                  {/* Status Badge */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg border ${getStockBadge(tool.quantity)}`}>
                      {getStockText(tool.quantity)}
                    </span>
                  </td>
                  
                  {/* Actions buttons */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(tool)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                        title="Edit Tool"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(tool.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors focus:outline-none"
                        title="Delete Tool"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
