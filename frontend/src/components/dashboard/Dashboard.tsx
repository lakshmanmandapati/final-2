import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Clock, 
  BookOpen, 
  Target, 
  Zap, 
  Calendar,
  Lightbulb,
  Activity,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

interface DashboardStats {
  totalStudyTime: number;
  sessionsThisWeek: number;
  averageFocusLevel: number;
  subjectsCount: number;
}

interface AIInsight {
  type: 'suggestion' | 'attention' | 'motivation';
  title: string;
  content: string[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && 'token' in user) {
      fetchDashboardData((user as any).token);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchDashboardData = async (token: string) => {
    setLoading(true);
    
    const apiClient = axios.create({
      baseURL: '/api',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    try {
      const [analyticsRes, aiRes, recentSessionsRes] = await Promise.all([
        apiClient.get('/sessions/analytics?days=7'),
        apiClient.get('/ai/suggestions'),
        apiClient.get('/sessions?limit=3')
      ]);

      const analyticsData = analyticsRes.data;
      setStats({
        totalStudyTime: analyticsData.summary?.total_time || 0,
        sessionsThisWeek: analyticsData.summary?.total_sessions || 0,
        averageFocusLevel: analyticsData.summary?.average_focus_level || 0,
        subjectsCount: Object.keys(analyticsData.subject_breakdown || {}).length
      });

      const aiData = aiRes.data;
      const insights: AIInsight[] = [];
      if (aiData.suggestions?.length > 0) {
        insights.push({ type: 'suggestion', title: 'Actionable Suggestions', content: aiData.suggestions });
      }
      if (aiData.attention_areas?.length > 0) {
        insights.push({ type: 'attention', title: 'Areas for Attention', content: aiData.attention_areas });
      }
      if (aiData.motivation) {
        insights.push({ type: 'motivation', title: 'Your Daily Motivation', content: [aiData.motivation] });
      }
      setAiInsights(insights);

      setRecentActivity(recentSessionsRes.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Could not load your dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const getIconComponent = (iconName: AIInsight['type']) => {
    const icons: { [key: string]: React.ReactNode } = {
      suggestion: <Lightbulb className="w-6 h-6 text-white" />,
      attention: <AlertTriangle className="w-6 h-6 text-white" />,
      motivation: <Sparkles className="w-6 h-6 text-white" />,
    };
    return icons[iconName] || <Zap className="w-6 h-6 text-white" />;
  };

  const getIconBgColor = (iconName: AIInsight['type']) => {
    const colors: { [key: string]: string } = {
        suggestion: 'from-blue-500 to-indigo-600',
        attention: 'from-amber-500 to-orange-600',
        motivation: 'from-green-500 to-emerald-600',
    };
    return colors[iconName] || 'from-gray-500 to-gray-600';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Award className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
          Ready to continue your learning journey? Here's your progress overview and personalized insights.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Study Time</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {stats?.totalStudyTime ? `${stats.totalStudyTime.toFixed(1)}h` : '0h'}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-6 shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Sessions This Week</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {stats?.sessionsThisWeek || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Average Focus</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {stats?.averageFocusLevel ? `${stats.averageFocusLevel.toFixed(1)}/10` : 'N/A'}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Subjects</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {stats?.subjectsCount || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <Zap className="w-4 h-4 text-white" />
              </div>
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Start Study Session
              </button>
              <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                View Analytics
              </button>
              <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Set Goals
              </button>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                <Activity className="w-4 h-4 text-white" />
              </div>
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.length > 0 ? recentActivity.map((session) => (
                <div key={session.id} className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="w-3 h-3 rounded-full mr-3" style={{backgroundColor: session.subject?.color || '#3B82F6'}}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{session.subject?.name || 'Unknown Subject'}</p>
                    <p className="text-sm text-gray-600">{session.topic || 'General Study'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-700">{session.time_spent}min</span>
                    <p className="text-xs text-gray-500">{new Date(session.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No recent activity</p>
                  <p className="text-sm text-gray-400">Start a study session to see your progress!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="lg:col-span-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              AI Insights & Recommendations
            </h2>
            <div className="space-y-4">
              {aiInsights.length > 0 ? aiInsights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getIconBgColor(insight.type)} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    {getIconComponent(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">{insight.title}</h3>
                    <ul className="space-y-1">
                      {insight.content.map((item, i) => (
                        <li key={i} className="flex items-start text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No AI insights available yet</h3>
                  <p className="text-gray-500 max-w-md mx-auto">Complete a few study sessions to get personalized recommendations and insights powered by AI.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;