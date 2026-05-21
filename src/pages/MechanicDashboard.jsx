import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Layers, 
  RotateCcw, 
  Search, 
  AlertTriangle, 
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRightCircle
} from 'lucide-react';
import { 
  getCurrentSession, 
  getTools, 
  getIssues, 
  issueTool, 
  returnTool 
} from '../utils/localStorageHelpers';
import { useToast } from '../components/Toast';
import ToolCard from '../components/ToolCard';
import IssueModal from '../components/IssueModal';

export default function MechanicDashboard() {
  const session = getCurrentSession();
  
  const [tools, setTools] = useState([]);
  const [personalIssues, setPersonalIssues] = useState([]);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Checkout modal control
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedToolForCheckout, setSelectedToolForCheckout] = useState(null);

  const { showToast } = useToast();

  const loadMechanicData = () => {
    if (!session) return;
    
    // Load tools
    setTools(getTools());

    // Load active and returned issues personal to this mechanic
    const allIssues = getIssues();
    const myIssues = allIssues.filter(i => i.mechanicId === session.id);
    setPersonalIssues(myIssues);
  };

  useEffect(() => {
    loadMechanicData();
  }, []);

  // Return Tool Action
  const handleReturn = (issueId, toolName) => {
    try {
      returnTool(issueId);
      loadMechanicData();
      showToast(`Returned tool: ${toolName}. Thank you!`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to return tool.', 'error');
    }
  };

  // Issue Tool Action (Opens checkout quantity popup)
  const handleCheckoutTrigger = (tool) => {
    setSelectedToolForCheckout(tool);
    setIsIssueModalOpen(true);
  };

  // Confirm Checkout Action from modal
  const handleConfirmCheckout = (toolId, qty) => {
    try {
      issueTool(toolId, qty, session.id, session.fullName);
      loadMechanicData();
      setIsIssueModalOpen(false);
      setSelectedToolForCheckout(null);
      showToast(`Successfully issued ${qty} units of ${selectedToolForCheckout.toolName}!`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to check out tool.', 'error');
    }
  };

  // Derived calculations
  const activeCheckouts = personalIssues.filter(i => i.status === 'Issued');
  const activeCheckoutsCount = activeCheckouts.reduce((acc, curr) => acc + Number(curr.quantityIssued), 0);

  const totalReturnsCount = personalIssues.filter(i => i.status === 'Returned').length;

  const categoriesList = ['All', 'Screwdriver', 'Wrench', 'Plier', 'Hammer', 'Drill Machine', 'Other'];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.toolName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.inventoryNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Welcome Banner Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 relative z-10">
          <img 
            src={session?.avatar} 
            alt={session?.fullName} 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-blue-500/30 shadow-md shrink-0 bg-slate-800"
            onError={(e) => {
              e.target.src = 'https://api.dicebear.com/7.x/initials/svg?seed=' + session?.fullName;
            }}
          />
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              {session?.level} Level Technician
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
              Hello, {session?.fullName}!
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-normal max-w-xl">
              Welcome back to your workshop terminal. Below is the active catalog. Browse tools, specify quantities, and return checkouts.
            </p>
          </div>

          {/* Quick Metrics display */}
          <div className="flex gap-4 border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6 shrink-0 w-full sm:w-auto justify-around">
            <div className="text-center">
              <span className="text-xl font-black text-white leading-none block">{activeCheckoutsCount}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">Active Issued</span>
            </div>
            <div className="text-center">
              <span className="text-xl font-black text-white leading-none block">{totalReturnsCount}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">Total Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checked-out Items (Action queue) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>My Checked-Out Items Queue</span>
          </h3>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Please click "Return Tool" when finished using equipment to restore stock levels.</p>
        </div>

        {activeCheckouts.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400 bg-slate-50/30">
            <p className="font-semibold text-sm">No active tool checkouts.</p>
            <p className="text-xs text-slate-400 mt-0.5">Your action list is clear. Browse the inventory catalog below to checkout gear.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCheckouts.map((issue) => (
              <div 
                key={issue.id} 
                className="p-4 bg-amber-50/30 border border-amber-200/60 hover:border-amber-300 rounded-2xl flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{issue.toolName}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100/70 border border-amber-200 text-amber-800 shrink-0">
                      Qty: {issue.quantityIssued}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                    Issued: {new Date(issue.issueDate).toLocaleDateString()} &bull; {new Date(issue.issueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <button
                  onClick={() => handleReturn(issue.id, issue.toolName)}
                  className="mt-4 w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm focus:outline-none"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Return Tool</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Catalog Title + Search bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          <span>Browse Workshop Inventory</span>
        </h3>
        
        {/* Search tool */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search by tool name or serial ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Category Pills list */}
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

      {/* Catalog Grid Catalog */}
      <div>
        {filteredTools.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
            <div className="flex flex-col items-center justify-center gap-2">
              <AlertTriangle className="w-8 h-8 text-slate-300" />
              <p className="font-semibold text-sm">No tools matching filters found.</p>
              <p className="text-xs text-slate-400">Clear search terms or select another category tab to display items.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onIssue={handleCheckoutTrigger}
              />
            ))}
          </div>
        )}
      </div>

      {/* Issue Modal Popup */}
      {isIssueModalOpen && selectedToolForCheckout && (
        <IssueModal
          tool={selectedToolForCheckout}
          onClose={() => {
            setIsIssueModalOpen(false);
            setSelectedToolForCheckout(null);
          }}
          onConfirm={handleConfirmCheckout}
        />
      )}

    </div>
  );
}
