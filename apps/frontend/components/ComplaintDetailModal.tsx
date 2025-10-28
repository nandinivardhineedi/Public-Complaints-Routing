import React, { useState, useEffect } from 'react';
import type { Complaint } from '../../../shared/types';
import { ComplaintStatus, Sentiment, DataSource } from '../../../shared/types';
import { XIcon } from './icons/IconComponents';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  onUpdateStatus: (newStatus: ComplaintStatus) => void;
}

const statusColorMap: Record<ComplaintStatus, string> = {
  [ComplaintStatus.Pending]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [ComplaintStatus.InReview]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ComplaintStatus.Resolved]: 'bg-green-100 text-green-800 border-green-200',
};

const sentimentColorMap: Record<Sentiment, string> = {
    [Sentiment.Positive]: 'text-green-600',
    [Sentiment.Negative]: 'text-red-600',
    [Sentiment.Neutral]: 'text-gray-600',
};

const DetailItem: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({ label, value, className }) => (
    <div className={className}>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-md text-gray-800">{value}</p>
    </div>
);


export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({ complaint, onClose, onUpdateStatus }) => {
  const [editedStatus, setEditedStatus] = useState<ComplaintStatus | null>(null);

  useEffect(() => {
    if (complaint) {
      setEditedStatus(complaint.status);
    }
  }, [complaint]);

  if (!complaint || !editedStatus) {
    return null;
  }

  const handleUpdate = () => {
    if (editedStatus) {
      onUpdateStatus(editedStatus);
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl border border-gray-200 transform transition-all"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Complaint Details <span className="text-indigo-600">#{complaint.id}</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-500 mb-2">Complaint Text</p>
                <p className="text-gray-700 leading-relaxed">{complaint.complaint_text}</p>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <select
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value as ComplaintStatus)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-50 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900"
                  >
                    {Object.values(ComplaintStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <DetailItem label="Category" value={complaint.category} />
                 <DetailItem label="Sentiment" value={
                    <span className={`font-semibold ${sentimentColorMap[complaint.sentiment]}`}>
                        {complaint.sentiment}
                    </span>
                } />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Location" value={complaint.location} />
                <DetailItem label="Date Submitted" value={new Date(complaint.timestamp).toLocaleString()} />
                <DetailItem label="Source" value={complaint.source} />
                <DetailItem label="Submitter" value={complaint.username} />
            </div>
            
            <div>
                 <DetailItem label="Assigned Authority" value={complaint.assigned_authority} />
            </div>
        </div>
         <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg border-t border-gray-200">
             <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Cancel
            </button>
            <button
                onClick={handleUpdate}
                disabled={editedStatus === complaint.status}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
                Update Status
            </button>
        </div>
      </div>
    </div>
  );
};
