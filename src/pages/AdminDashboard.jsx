import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Users, 
  Layers, 
  ArrowUpRight, 
  Plus, 
  Search, 
  Grid, 
  List, 
  Activity, 
  Settings2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { 
  getTools, 
  saveTool, 
  deleteTool, 
  getMechanics, 
  getIssues 
} from '../utils/localStorageHelpers';
import { useToast } from '../components/Toast';
import ToolCard from '../components/ToolCard';
import ToolForm from '../components/ToolForm';
import ToolTable from '../components/ToolTable';

export default function AdminDashboard() {
  const [tools, setTools] = useState([]);
  const [mechanicsCount, setMechanicsCount] = useState(0);
  const [issuedCount, setIssuedCount] = useState(0);
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isGridView, setIsGridView] = useState(true);

  // Modal control states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);

  const { showToast } = useToast();

  // Load metrics and tools
  const loadDashboardData = () => {
    const loadedTools = getTools();
    setTools(loadedTools);

    const loadedMechanics = getMechanics();
    setMechanicsCount(loadedMechanics.length);

    const loadedIssues = getIssues();
    // Sum the quantity of all active issues
    const activeIssuesQty = loadedIssues
      .filter(i => i.status === 'Issued')
      .reduce((acc, curr) => acc + Number(curr.quantityIssued), 0);
    setIssuedCount(activeIssuesQty);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Inline Quick quantity edit (+/- buttons on table view)
  const handleQuickQtyUpdate = (toolId, diff) => {
    const allTools = getTools();
    const index = allTools.findIndex(t => t.id === toolId);
    if (index === -1) return;

    const newQty = allTools[index].quantity + diff;
    if (newQty < 0) return;

    allTools[index].quantity = newQty;
    saveTool(allTools[index]);
    loadDashboardData();
    showToast(`Quick stock updated for: ${allTools[index].toolName}`, 'success');
  };

  // Add/Edit Tool Form save handler
  const handleSaveTool = (toolData) => {
    try {
      saveTool(toolData);
      loadDashboardData();
      setIsFormOpen(false);
      setEditingTool(null);
      showToast(
        toolData.id ? 'Tool updated successfully!' : 'New tool created successfully!',
        'success'
      );
    } catch (err) {
      showToast(err.message || 'Failed to save tool.', 'error');
    }
  };

  // Delete Tool Handler
  const handleDeleteTool = (toolId) => {
    if (window.confirm('Are you sure you want to delete this tool? All inventory quantities will be purged.')) {
      try {
        deleteTool(toolId);
        loadDashboardData();
        showToast('Tool deleted from catalog.', 'warning');
      } catch (err) {
        showToast('Failed to delete tool.', 'error');
      }
    }
  };

  const handleEditTrigger = (tool) => {
    setEditingTool(tool);
    setIsFormOpen(true);
  };

  const handleCreateTrigger = () => {
    setEditingTool(null);
    setIsFormOpen(true);
  };

  // Categories helper list for filtering
  const categoriesList = ['All', 'Screwdriver', 'Wrench', 'Plier', 'Hammer', 'Drill Machine', 'Other'];

  // Filter tools based on searches
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.toolName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.inventoryNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Derived metrics
  const totalToolsCount = tools.length;
  const totalStockCount = tools.reduce((acc, curr) => acc + Number(curr.quantity), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Total Tool Types */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold tracking-wider uppercase block">Tool Catalog</span>
            <span className="text-2xl font-black text-slate-800">{totalToolsCount}</span>
            <span className="text-[10px] text-slate-500 font-medium block">Different designs listed</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Total Items in Stock */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold tracking-wider uppercase block">Total Items Stock</span>
            <span className="text-2xl font-black text-slate-800">{totalStockCount}</span>
            <span className="text-[10px] text-slate-500 font-medium block">Total parts on shelves</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Active Mechanics */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold tracking-wider uppercase block">Team Members</span>
            <span className="text-2xl font-black text-slate-800">{mechanicsCount}</span>
            <span className="text-[10px] text-slate-500 font-medium block">Registered technicians</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Active Issued Tools */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold tracking-wider uppercase block">Active Issued</span>
            <span className="text-2xl font-black text-slate-800">{issuedCount}</span>
            <span className="text-[10px] text-slate-500 font-medium block">Items checked out currently</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
        </div>

      </div>

      {/* Control filters & search toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by tool name or serial ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Layout View buttons + Add Tool Button */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Toggle Grid vs List */}
          <div className="flex border border-slate-200 rounded-xl p-0.5 bg-slate-100">
            <button
              onClick={() => setIsGridView(true)}
              className={`p-1.5 rounded-lg focus:outline-none transition-all ${
                isGridView ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Card Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-1.5 rounded-lg focus:outline-none transition-all ${
                !isGridView ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Audit Table list"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleCreateTrigger}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 flex items-center gap-1.5 transition-all focus:outline-none"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tool</span>
          </button>
        </div>

      </div>

      {/* Category Horizontal scroll tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border focus:outline-none ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools Content Grid/Table Render */}
      <div>
        {isGridView ? (
          filteredTools.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
              <div className="flex flex-col items-center justify-center gap-2">
                <AlertTriangle className="w-8 h-8 text-slate-300" />
                <p className="font-semibold text-sm">No tools matching filters found.</p>
                <p className="text-xs text-slate-400">Try checking spelling or clear search filters to display data.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onEdit={handleEditTrigger}
                  onDelete={handleDeleteTool}
                />
              ))}
            </div>
          )
        ) : (
          <ToolTable
            tools={filteredTools}
            onQuickUpdateQty={handleQuickQtyUpdate}
            onEdit={handleEditTrigger}
            onDelete={handleDeleteTool}
          />
        )}
      </div>

      {/* Tool edit / creation form modal */}
      {isFormOpen && (
        <ToolForm
          tool={editingTool}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTool(null);
          }}
          onSave={handleSaveTool}
        />
      )}

    </div>
  );
}
