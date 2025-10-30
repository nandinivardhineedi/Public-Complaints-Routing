import React, { useState, useEffect, useMemo } from 'react';
import type { Complaint } from './../types';
import { ComplaintCategory, ComplaintStatus, Sentiment } from './../types';
import { Card } from './Card';
import { BarChartComponent } from './BarChartComponent';
import { LineChartComponent } from './LineChartComponent';
import { getWeeklySummary } from '../../api/geminiService';
import { FileTextIcon, CheckCircleIcon, TrendingUpIcon, UsersIcon, AlertTriangleIcon } from './icons/IconComponents';

interface DashboardProps {
    complaints: Complaint[];
}

const AiSummaryCard: React.FC<{ complaints: Complaint[] }> = ({ complaints }) => {
    const [summary, setSummary] = useState<string>('Generating AI summary...');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true);
            // Wrap the call in a try/catch to prevent crash if Gemini API fails
            try {
                const result = await getWeeklySummary(complaints);
                setSummary(result);
            } catch (e) {
                setSummary("AI Summary service is unavailable or encountered an error.");
                console.error("Gemini Service Error:", e);
            }
            setIsLoading(false);
        };

        fetchSummary();
    }, [complaints]);

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 col-span-1 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Weekly Summary</h3>
            {isLoading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
            ) : (
                <div className="text-gray-600 whitespace-pre-wrap font-sans text-sm leading-relaxed">{summary}</div>
            )}
        </div>
    );
};


export const Dashboard: React.FC<DashboardProps> = ({ complaints }) => {
    
    const stats = useMemo(() => {
        const calculateStats = (complaintSet: Complaint[]) => {
            const total = complaintSet.length;
            const resolved = complaintSet.filter(c => c.status === ComplaintStatus.Resolved).length;
            const pending = complaintSet.filter(c => c.status === ComplaintStatus.Pending).length;
            const resolutionRate = total > 0 ? (resolved / total) * 100 : 0;
            return { total, resolved, pending, resolutionRate };
        };
        
        const calculateChange = (current: number, previous: number): number => {
            if (previous === 0) {
                return current > 0 ? 100 : 0;
            }
            if (current === 0 && previous > 0) {
                return -100;
            }
            return ((current - previous) / previous) * 100;
        };

        // Overall stats are based on all complaints
        const overallStats = calculateStats(complaints);
        
        // For trends, we split the data chronologically to create two periods for comparison.
        // This is more robust for demo data than a fixed "weekly" window.
        if (complaints.length < 2) {
            return {
                overall: overallStats,
                trends: { total: 0, resolved: 0, pending: 0, resolutionRate: 0 }
            };
        }
        
        const sortedComplaints = [...complaints].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const midIndex = Math.floor(sortedComplaints.length / 2);
        
        const previousPeriodComplaints = sortedComplaints.slice(0, midIndex);
        const currentPeriodComplaints = sortedComplaints.slice(midIndex);

        const statsPrevious = calculateStats(previousPeriodComplaints);
        const statsCurrent = calculateStats(currentPeriodComplaints);

        const totalChange = calculateChange(statsCurrent.total, statsPrevious.total);
        const resolvedChange = calculateChange(statsCurrent.resolved, statsPrevious.resolved);
        const pendingChange = calculateChange(statsCurrent.pending, statsPrevious.pending);
        const resolutionRateChange = statsCurrent.resolutionRate - statsPrevious.resolutionRate;

        return {
            overall: overallStats,
            trends: {
                total: totalChange,
                resolved: resolvedChange,
                pending: pendingChange,
                resolutionRate: resolutionRateChange,
            }
        };
    }, [complaints]);

    const categoryData = useMemo(() => {
        const counts = Object.values(ComplaintCategory).reduce((acc, category) => {
            acc[category] = 0;
            return acc;
        }, {} as Record<ComplaintCategory, number>);

        complaints.forEach(c => {
            if (counts[c.category] !== undefined) {
                counts[c.category]++;
            }
        });
        return Object.entries(counts).map(([name, value]) => ({ name, count: value }));
    }, [complaints]);
    
    const sentimentData = useMemo(() => {
        const data = [
            { name: 'Day 1', Negative: 4, Neutral: 2, Positive: 1 },
            { name: 'Day 2', Negative: 3, Neutral: 1, Positive: 0 },
            { name: 'Day 3', Negative: 2, Neutral: 3, Positive: 0 },
            { name: 'Day 4', Negative: 2, Neutral: 1, Positive: 0 },
            { name: 'Day 5', Negative: 1, Neutral: 2, Positive: 0 },
            { name: 'Day 6', Negative: 3, Neutral: 1, Positive: 1 },
            { name: 'Day 7', Negative: 4, Neutral: 2, Positive: 1 },
        ];
        return data;
    }, []);
    
    const formatTrend = (change: number, unit = '%') => {
        if (!isFinite(change) || change === 0) {
            return `0.0${unit} this week`;
        }
        const prefix = change > 0 ? '+' : '';
        return `${prefix}${change.toFixed(1)}${unit} this week`;
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Total Complaints" value={stats.overall.total.toString()} icon={<FileTextIcon className="w-6 h-6"/>} trend={formatTrend(stats.trends.total)} trendDirection={stats.trends.total >= 0 ? 'up' : 'down'} />
                <Card title="Resolved" value={stats.overall.resolved.toString()} icon={<CheckCircleIcon className="w-6 h-6"/>} trend={formatTrend(stats.trends.resolved)} trendDirection={stats.trends.resolved >= 0 ? 'up' : 'down'} />
                <Card title="Pending" value={stats.overall.pending.toString()} icon={<AlertTriangleIcon className="w-6 h-6"/>} trend={formatTrend(stats.trends.pending)} trendDirection={stats.trends.pending < 0 ? 'up' : 'down'}/>
                <Card title="Resolution Rate" value={`${stats.overall.resolutionRate.toFixed(1)}%`} icon={<TrendingUpIcon className="w-6 h-6"/>} trend={formatTrend(stats.trends.resolutionRate)} trendDirection={stats.trends.resolutionRate >= 0 ? 'up' : 'down'}/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints by Category</h3>
                     <BarChartComponent data={categoryData} />
                </div>
                 <div className="bg-white p-6 rounded-lg border border-gray-200">
                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Trend</h3>
                    <LineChartComponent data={sentimentData} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* <AiSummaryCard complaints={complaints} />   <-- COMMENT THIS LINE OUT */}
                 <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Complaints</h3>
                    <ul className="space-y-4">
                        {complaints.slice(0, 5).map(c => (
                            <li key={c.id} className="text-sm border-b border-gray-200 pb-2 last:border-b-0">
                                <p className="text-gray-700 truncate">{c.complaint_text}</p>
                                <p className="text-xs text-gray-500">{c.location} - {c.category}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    );
};