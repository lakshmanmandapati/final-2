import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, BookOpen, TrendingUp, Users, Zap } from 'lucide-react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(formData.email, formData.password);
    
    if (success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Login Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 transform hover:scale-[1.02] transition-all duration-300">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              Welcome back to StudySphere
            </h2>
            <p className="text-gray-600">
              Continue your learning journey with AI-powered insights
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in to StudySphere'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:underline"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Right side - Features */}
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Transform Your Learning Experience
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Track progress, get AI insights, and achieve your academic goals with StudySphere
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/95 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your study sessions and visualize your learning progress over time.</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/95 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Insights</h3>
              <p className="text-gray-600">Get personalized study suggestions and recommendations powered by AI.</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/95 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Subject Management</h3>
              <p className="text-gray-600">Organize your subjects and track performance across different topics.</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/95 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Voice Notes</h3>
              <p className="text-gray-600">Record and transcribe your study notes for better retention.</p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-6 text-center">
            <p className="text-gray-700 font-medium">
              Join thousands of students already improving their study habits with StudySphere
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 