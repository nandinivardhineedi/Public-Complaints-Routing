import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Complaint, ComplaintStatus, ComplaintCategory } from '../../../shared/types';
import { EyeIcon } from './icons/IconComponents';
import { ComplaintDetailModal } from './ComplaintDetailModal';

interface ComplaintListProps {
  complaints: Complaint[];
  onUpdateComplaintStatus: (complaintId: string, newStatus: ComplaintStatus) => Promise<void>; 
}

const statusColorMap: Record<ComplaintStatus, string> = {
  [ComplaintStatus.Pending]: 'bg-yellow-100 text-yellow-800',
  [ComplaintStatus.InReview]: 'bg-blue-100 text-blue-800',
  [ComplaintStatus.Resolved]: 'bg-green-100 text-green-800',
};

const ITEMS_PER_PAGE = 10;

export const ComplaintList: React.FC<ComplaintListProps> = ({ complaints, onUpdateComplaintStatus }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'All'>('All');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newComplaintIds, setNewComplaintIds] = useState<Set<string>>(new Set());
  const prevComplaintsRef = useRef<Complaint[]>(complaints);

  useEffect(() => {
    const prevComplaints = prevComplaintsRef.current;
    if (complaints.length > prevComplaints.length) {
      const prevComplaintIds = new Set(prevComplaints.map(c => c.id));
      const addedComplaints = complaints.filter(c => !prevComplaintIds.has(c.id));
      
      if (addedComplaints.length > 0) {
        const newIds = new Set(addedComplaints.map(c => c.id));
        setNewComplaintIds(newIds);

        const timer = setTimeout(() => {
          setNewComplaintIds(new Set());
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
    prevComplaintsRef.current = complaints;
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const displayId = c.displayId || c.id;
      const matchesSearch = c.complaint_text.toLowerCase().includes(searchTerm.toLowerCase()) || displayId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [complaints, searchTerm, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
  const paginatedComplaints = filteredComplaints.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">All Complaints</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by keyword or ID..."
            className="p-2 border bg-gray-50 border-gray-300 rounded-md w-full text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="p-2 border bg-gray-50 border-gray-300 rounded-md w-full text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as ComplaintStatus | 'All');
              setCurrentPage(1);
            }}
          >
            <option value="All">All Statuses</option>
            {Object.values(ComplaintStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select
            className="p-2 border bg-gray-50 border-gray-300 rounded-md w-full text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value as ComplaintCategory | 'All');
              setCurrentPage(1);
            }}
          >
            <option value="All">All Categories</option>
            {Object.values(ComplaintCategory).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedComplaints.map((complaint) => (
                <tr key={complaint.id} className={`transition-colors duration-1000 ease-out ${newComplaintIds.has(complaint.id) ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {complaint.displayId || complaint.id} 
                    {newComplaintIds.has(complaint.id) && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-indigo-800 bg-indigo-200 rounded-full">
                            New
                        </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs truncate">{complaint.complaint_text}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[complaint.status]}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(complaint.timestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => setSelectedComplaint(complaint)} className="text-indigo-600 hover:text-indigo-800"><EyeIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
              {paginatedComplaints.length === 0 && (
                  <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-500">No complaints found.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-600">
            Showing {Math.min(1 + (currentPage-1) * ITEMS_PER_PAGE, filteredComplaints.length)} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredComplaints.length)} of {filteredComplaints.length} results
          </span>
          <div className="flex space-x-1">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 text-sm border rounded-md border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-100">Previous</button>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 text-sm border rounded-md border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>

      <ComplaintDetailModal 
        complaint={selectedComplaint} 
        onClose={() => setSelectedComplaint(null)} 
        onUpdateStatus={(newStatus) => {
          if (selectedComplaint) {
            // Passes the internal Firestore ID ('id') for the status update
            onUpdateComplaintStatus(selectedComplaint.id, newStatus); 
          }
        }}
      />
    </>
  );
};