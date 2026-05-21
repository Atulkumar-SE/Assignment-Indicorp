import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { 
  getCurrentSession, 
  getIssues, 
  returnTool 
} from '../utils/localStorageHelpers';
import { useToast } from '../components/Toast';

export default function IssueRegister() {
  const session = getCurrentSession();
  const isAdmin = session?.role === 'admin';

  const [issues, setIssues] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const { showToast } = useToast();

  const loadIssuesData = () => {
    const allIssues = getIssues();
    
    if (isAdmin) {
      setIssues(allIssues);
    } else {
      // Mechanics can only review their own logs
      const personalIssues = allIssues.filter(i => i.mechanicId === session?.id);
      setIssues(personalIssues);
    }
  };

  useEffect(() => {
    loadIssuesData();
  }, []);

  // Quick return trigger for mechanics viewing their logs
  const handleReturnFromLogs = (issueId, toolName) => {
    try {
      returnTool(issueId);
      loadIssuesData();
      showToast(`Returned tool: ${toolName}. Thank you!`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to return tool.', 'error');
    }
  };

  // Filter Issues
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      issue.toolName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      issue.mechanicName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'All' || 
      issue.status === selectedStatus;
      
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Search and Filters box */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder={isAdmin ? "Search by tool or mechanic name..." : "Search by tool name..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Status toggles */}
        <div className="flex border border-slate-200 rounded-xl p-0.5 bg-slate-100 self-end sm:self-auto">
          {['All', 'Issued', 'Returned'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none ${
                selectedStatus === status 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* Main Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Tool Checked Out</th>
                {isAdmin && <th scope="col" className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Technician</th>}
                <th scope="col" className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-center">Qty Issued</th>
                <th scope="col" className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Issue Date</th>
                <th scope="col" className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Return Date</th>
                <th scope="col" className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-center">Status</th>
                {!isAdmin && <th scope="col" className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-right">Quick Action</th>}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <BookOpen className="w-8 h-8 text-slate-300" />
                      <p className="font-semibold text-sm">No transaction records found.</p>
                      <p className="text-xs text-slate-400">Items checked out by workshop mechanics will register logs in this ledger.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIssues.map((record) => {
                  const isRecordIssued = record.status === 'Issued';
                  
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Tool name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <span className="font-bold text-slate-800 text-sm block">{record.toolName}</span>
                          <span className="text-[10px] text-slate-400 font-mono uppercase">ID: {record.toolId}</span>
                        </div>
                      </td>
                      
                      {/* Admin column: Mechanic Name */}
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-sm">{record.mechanicName}</span>
                          </div>
                        </td>
                      )}

                      {/* Quantity Checked out */}
                      <td className="px-6 py-4 whitespace-nowrap text-center text-slate-800 font-bold">
                        {record.quantityIssued}
                      </td>

                      {/* Issue Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                        <div>
                          <span>{new Date(record.issueDate).toLocaleDateString()}</span>
                          <span className="text-slate-400 block mt-0.5">
                            {new Date(record.issueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>

                      {/* Return Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                        {record.returnDate ? (
                          <div>
                            <span>{new Date(record.returnDate).toLocaleDateString()}</span>
                            <span className="text-slate-400 block mt-0.5">
                              {new Date(record.returnDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Pending return...</span>
                        )}
                      </td>

                      {/* Status Badges */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border ${
                          isRecordIssued 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isRecordIssued ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                          <span>{record.status}</span>
                        </span>
                      </td>

                      {/* Mechanic Column: Quick Return */}
                      {!isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {isRecordIssued ? (
                            <button
                              onClick={() => handleReturnFromLogs(record.id, record.toolName)}
                              className="py-1 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm focus:outline-none transition-colors"
                            >
                              Return
                            </button>
                          ) : (
                            <span className="text-emerald-600 text-xs font-bold flex items-center justify-end gap-1 select-none">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Archived</span>
                            </span>
                          )}
                        </td>
                      )}

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
