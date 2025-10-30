import React, { useState } from 'react';
import { DataSource } from './../types';
import { TwitterIcon, RedditIcon, DatabaseIcon, UsersIcon } from './icons/IconComponents';

interface SourcesProps {
    onSync: (source: DataSource) => Promise<number>;
}

const sourceMetadata = {
    [DataSource.Twitter]: { icon: <TwitterIcon className="w-8 h-8 text-blue-400" />, color: 'border-blue-500' },
    [DataSource.Reddit]: { icon: <RedditIcon className="w-8 h-8 text-orange-400" />, color: 'border-orange-500' },
    [DataSource.MunicipalPortal]: { icon: <DatabaseIcon className="w-8 h-8 text-slate-500" />, color: 'border-slate-500' },
    [DataSource.CommunityForum]: { icon: <UsersIcon className="w-8 h-8 text-teal-400" />, color: 'border-teal-500' },
};

const SourceCard: React.FC<{
    source: DataSource;
    onSync: (source: DataSource) => Promise<number>;
}> = ({ source, onSync }) => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState<string | null>(null);
    const [syncMessage, setSyncMessage] = useState<string>('');
    const metadata = sourceMetadata[source];

    // Now handleSync is async and awaits onSync
    const handleSync = async () => {
        setIsSyncing(true);
        setSyncMessage('');
        await new Promise(res => setTimeout(res, 1500)); // Simulate network delay
        try {
            const count = await onSync(source);
            setSyncMessage(count > 0 ? `Synced ${count} new complaints.` : 'No new complaints to sync.');
            setLastSync(new Date().toLocaleString());
        } catch (error) {
            setSyncMessage('Sync failed.');
        }
        setIsSyncing(false);
        setTimeout(() => setSyncMessage(''), 3000); // Clear message after 3 seconds
    };

    return (
        <div className={`bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-300 border-l-4 ${metadata.color}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                    {metadata.icon}
                    <h3 className="text-xl font-semibold text-gray-900">{source}</h3>
                </div>
                <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Connected</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
                Last synced: {lastSync || 'Never'}
            </p>
            <div className="flex items-center justify-end">
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                    {isSyncing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Syncing...
                        </>
                    ) : 'Sync Now'}
                </button>
            </div>
            {syncMessage && <p className="text-sm text-gray-500 mt-3 text-center">{syncMessage}</p>}
        </div>
    );
};

export const Sources: React.FC<SourcesProps> = ({ onSync }) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Data Source Integrations</h2>
                <p className="text-gray-500 mt-1">Sync complaints from various platforms to keep your dashboard up-to-date.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.values(DataSource).map(source => (
                    <SourceCard key={source} source={source} onSync={onSync} />
                ))}
            </div>
        </div>
    );
};
