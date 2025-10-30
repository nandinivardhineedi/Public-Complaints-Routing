import React, { useState } from 'react';
import type { UserRole } from '../App';
import { ComplaintCategory } from './../types';

interface SubmitComplaintProps {
  onAddComplaint: (formData: { 
    complaint_text: string; 
    location: string; 
    category: ComplaintCategory; 
    username: string;
  }) => void;
  userRole: UserRole | null;
}

export const SubmitComplaint: React.FC<SubmitComplaintProps> = ({ onAddComplaint, userRole }) => {
  const [formData, setFormData] = useState({
    complaint_text: '',
    location: '',
    category: ComplaintCategory.Infrastructure,
    username: '', // Initialize as empty string
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.complaint_text || !formData.location) {
      alert('Please fill out all required fields.');
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onAddComplaint(formData);
      setIsSubmitting(false);
    }, 500);
  };

  const containerClasses = userRole === 'user'
    ? "max-w-2xl mx-auto bg-white p-8 rounded-lg border border-gray-200"
    : "bg-white p-8 rounded-lg border border-gray-200";


  return (
    <div className={containerClasses}>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a Public Complaint</h1>
      <p className="text-gray-600 mb-6">Your feedback helps us improve our city. Please provide as much detail as possible.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Your Name (Optional)</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Priya Sharma"
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location of Issue <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Bandra, Mumbai"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-50 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900"
          >
            {Object.values(ComplaintCategory).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="complaint_text" className="block text-sm font-medium text-gray-700">Describe the Issue <span className="text-red-500">*</span></label>
          <textarea
            name="complaint_text"
            id="complaint_text"
            rows={4}
            value={formData.complaint_text}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Please be as specific as possible."
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  );
};

