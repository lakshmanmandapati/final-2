import React, { useState } from 'react';
// In a real project, you would import these from your actual project files
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, Target, BookOpen, Star, Award, Rocket } from 'lucide-react';

// --- Mock implementations for demonstration purposes ---
// These allow the component to be displayed and tested on its own.
const Link = ({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: any }) => <a href={to} {...props}>{children}</a>;
const useNavigate = () => (path: string) => console.log(`Navigating to ${path}`);
const useAuth = () => ({
  signup: async (
    email: string, 
    password: string, 
    academic_goal?: string, 
    focus_areas?: string
  ) => {
    console.log('Signing up with:', { email, password, academic_goal, focus_areas });
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true; // Simulate a successful signup
  }
});
// --- End of Mock implementations ---


const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '', 
    academic_goal: '',
    focus_areas: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); 

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
        setError('');
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    
    setError(''); 
    setLoading(true);
    
    try {
        const success = await signup(
          formData.email,
          formData.password,
          formData.academic_goal || undefined,
          formData.focus_areas || undefined
        );
        
        if (success) {
          navigate('/dashboard');
        } else {
          setError('Failed to create an account. Please try again.');
        }
    } catch (err) {
        setError('An unexpected error occurred. Please try again.');
        console.error("Signup failed:", err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Signup Form */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-200/50">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 mb-2">
              Start Your Learning Journey
            </h2>
            <p className="text-gray-600">
              Join StudySphere and transform your study habits with AI-powered insights.
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long.</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            {/* Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="academic_goal" className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Goal <span className="text-gray-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Target className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="academic_goal"
                      name="academic_goal"
                      type="text"
                      value={formData.academic_goal}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="e.g., Ace my finals"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="focus_areas" className="block text-sm font-medium text-gray-700 mb-1">
                    Focus Areas <span className="text-gray-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Star className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="focus_areas"
                      name="focus_areas"
                      type="text"
                      value={formData.focus_areas}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="e.g., Math, Science"
                    />
                  </div>
                </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-800 text-sm rounded-lg p-3 text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Create StudySphere Account'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Right side - Benefits Section */}
        <div className="space-y-8 hidden lg:block">
          <div className="text-left">
            <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 mb-4">
              Unlock Your Potential
            </h1>
            <p className="text-xl text-gray-600">
              Join the future of learning with our comprehensive study platform.
            </p>
          </div>

          <div className="space-y-6">
            {[
                { icon: BookOpen, iconBg: 'from-blue-500 to-blue-600', title: 'Smart Study Tracking', description: 'Automatically track your study sessions and progress.' },
                { icon: Star, iconBg: 'from-indigo-500 to-indigo-600', title: 'AI-Powered Insights', description: 'Get personalized recommendations and optimize your learning.' },
                { icon: Award, iconBg: 'from-green-500 to-green-600', title: 'Achievement System', description: 'Earn badges, track streaks, and stay motivated.' }
            ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                    <div key={index} className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200/80 transition-transform transform hover:scale-105">
                        <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${feature.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
