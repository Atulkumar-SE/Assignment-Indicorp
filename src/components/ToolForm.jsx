import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import { getTools } from '../utils/localStorageHelpers';

// A predefined selection of beautiful tool thumbnails for seamless frontend experience
const PRESET_IMAGES = [
  { label: 'Drill Machine', url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=300' },
  { label: 'Hammer', url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=300' },
  { label: 'Wrench', url: 'https://images.unsplash.com/photo-1608613304899-ea8098577e38?auto=format&fit=crop&q=80&w=300' },
  { label: 'Screwdriver', url: 'https://images.unsplash.com/photo-1770657986086-c1f20eef30ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { label: 'Plier', url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=300' },
  { label: 'Toolbox / Other', url: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=300' }
];

const CATEGORIES = ['Screwdriver', 'Wrench', 'Plier', 'Hammer', 'Drill Machine', 'Other'];

export default function ToolForm({ tool, onClose, onSave }) {
  const [formData, setFormData] = useState({
    toolName: '',
    category: 'Screwdriver',
    inventoryNumber: '',
    quantity: 1,
    image: PRESET_IMAGES[3].url // Default to screwdriver image
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (tool) {
      setFormData({
        id: tool.id,
        toolName: tool.toolName,
        category: tool.category,
        inventoryNumber: tool.inventoryNumber,
        quantity: tool.quantity,
        image: tool.image
      });
    } else {
      // Auto-generate a dynamic code for a new tool
      generateInventoryNumber('Screwdriver');
    }
  }, [tool]);

  // Helper to generate unique serial codes like TL-SCRW-2943
  const generateInventoryNumber = (categoryName) => {
    const prefix = {
      'Screwdriver': 'TL-SCRW',
      'Wrench': 'TL-WRNC',
      'Plier': 'TL-PLIR',
      'Hammer': 'TL-HAMR',
      'Drill Machine': 'TL-DRIL',
      'Other': 'TL-OTHR'
    }[categoryName] || 'TL-TOOL';

    const random = Math.floor(100 + Math.random() * 900); // 3 digit code
    setFormData(prev => ({
      ...prev,
      category: categoryName,
      inventoryNumber: `${prefix}-${random}`
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedCat = e.target.value;
    generateInventoryNumber(selectedCat);

    // Swap preset image automatically to match category style
    const matchingPreset = PRESET_IMAGES.find(img => img.label === selectedCat);
    if (matchingPreset) {
      setFormData(prev => ({ ...prev, image: matchingPreset.url }));
    }
  };

  const validate = () => {
    const err = {};
    const tools = getTools();

    if (!formData.toolName.trim()) {
      err.toolName = 'Tool Name is required.';
    }

    if (!formData.inventoryNumber.trim()) {
      err.inventoryNumber = 'Inventory Number is required.';
    } else {
      // Check for duplicate inventory number (ignore if editing same tool)
      const duplicate = tools.find(t => 
        t.inventoryNumber.toLowerCase() === formData.inventoryNumber.toLowerCase() && 
        t.id !== formData.id
      );
      if (duplicate) {
        err.inventoryNumber = 'This Inventory Number already exists.';
      }
    }

    if (formData.quantity === '' || isNaN(formData.quantity) || Number(formData.quantity) < 0) {
      err.quantity = 'Quantity must be a positive integer.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      quantity: Number(formData.quantity)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-800">
            {tool ? 'Edit Tool Inventory' : 'Register New Tool AJ'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Tool Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
              Tool Name <span className="text-rose-500">*</span>
            </label>
            <input 
              type="text"
              placeholder="e.g. Stanley Claw Hammer"
              value={formData.toolName}
              onChange={(e) => setFormData(prev => ({ ...prev, toolName: e.target.value }))}
              className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 text-slate-800 font-medium text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.toolName 
                  ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400' 
                  : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'
              }`}
            />
            {errors.toolName && <span className="text-xs text-rose-500 font-semibold mt-1 block">{errors.toolName}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={handleCategoryChange}
                disabled={!!tool} // category locked when editing
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Inventory Number */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Inventory Number <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text"
                placeholder="TL-XXXX-000"
                value={formData.inventoryNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, inventoryNumber: e.target.value.toUpperCase() }))}
                className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 text-slate-800 font-medium text-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.inventoryNumber 
                    ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400' 
                    : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'
                }`}
              />
              {errors.inventoryNumber && <span className="text-xs text-rose-500 font-semibold mt-1 block">{errors.inventoryNumber}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Available Quantity <span className="text-rose-500">*</span>
              </label>
              <input 
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 text-slate-800 font-semibold text-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.quantity 
                    ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400' 
                    : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'
                }`}
              />
              {errors.quantity && <span className="text-xs text-rose-500 font-semibold mt-1 block">{errors.quantity}</span>}
            </div>

            {/* Custom URL Option */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Or Custom Image URL
              </label>
              <input 
                type="text"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Quick Preset Image Selectors */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Select Preset Product Thumbnail</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.label}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: img.url }))}
                  className={`relative aspect-square rounded-lg border-2 overflow-hidden bg-slate-100 focus:outline-none hover:opacity-95 transition-all ${
                    formData.image === img.url ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'
                  }`}
                  title={img.label}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-slate-900/60 text-white text-[8px] font-bold py-0.5 truncate text-center leading-none">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 flex items-center gap-2 transition-all focus:outline-none"
            >
              <Save className="w-4 h-4" />
              <span>{tool ? 'Update Inventory' : 'Create Tool'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
