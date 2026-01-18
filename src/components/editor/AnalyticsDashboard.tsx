import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import { Eye, MousePointer2, TrendingUp, Loader2, AlertCircle } from 'lucide-react';

interface Stats {
    total_views: number;
    total_clicks: number;
    daily_views: { date: string; count: number }[];
    top_links: { target_id: string; target_type: string; clicks: number }[];
}

export function AnalyticsDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            if (!user) return;
            try {
                const { data, error } = await supabase.rpc('get_profile_stats', { p_id: user.id });
                if (error) throw error;
                setStats(data);
            } catch (err: any) {
                console.error('Error fetching analytics:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="p-6 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">Failed to load analytics: {error || 'No data found'}</p>
            </div>
        );
    }

    const conversionRate = stats.total_views > 0
        ? ((stats.total_clicks / stats.total_views) * 100).toFixed(1)
        : '0';

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-card border-none shadow-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2 opacity-70">
                            <Eye className="h-4 w-4" /> Profile Views
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_views}</div>
                        <p className="text-xs opacity-50 font-normal mt-1">Total lifetime visits</p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none shadow-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2 opacity-70">
                            <MousePointer2 className="h-4 w-4" /> Link Clicks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_clicks}</div>
                        <p className="text-xs opacity-50 font-normal mt-1">Total interactions</p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none shadow-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2 opacity-70">
                            <TrendingUp className="h-4 w-4" /> Conversion Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{conversionRate}%</div>
                        <p className="text-xs opacity-50 font-normal mt-1">Visitors who clicked a link</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-card border-none shadow-none p-6">
                <h3 className="text-lg font-bold mb-6">Views Trend</h3>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.daily_views}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, fill: '#8b5cf6', strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="space-y-4">
                <h3 className="text-lg font-bold">Top Performing Links</h3>
                <div className="space-y-2">
                    {stats.top_links?.length > 0 ? (
                        stats.top_links.map((link, i) => (
                            <div key={i} className="flex items-center justify-between p-4 glass-card border-none">
                                <div className="flex flex-col">
                                    <span className="font-bold capitalize">{link.target_id.replace(/_/g, ' ')}</span>
                                    <span className="text-xs opacity-50 uppercase tracking-wider">{link.target_type.replace(/_/g, ' ')}</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-lg">{link.clicks}</div>
                                    <div className="text-xs opacity-50">clicks</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-8 opacity-50">No click data yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}
