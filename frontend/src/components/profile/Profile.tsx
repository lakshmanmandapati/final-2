import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User } from 'lucide-react';

interface UserProfile {
  id: number;
  email: string;
  academic_goal: string;
  focus_areas: string;
  role: string;
  created_at: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    academic_goal: '',
    focus_areas: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      setProfile(response.data);
      setFormData({
        academic_goal: response.data.academic_goal || '',
        focus_areas: response.data.focus_areas || ''
      });
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('/api/auth/profile', formData);
      setProfile(response.data.user);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      academic_goal: profile?.academic_goal || '',
      focus_areas: profile?.focus_areas || ''
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Profile Settings</h1>
        </div>
        <p className="text-gray-600 text-lg">Manage your account settings and learning preferences.</p>
      </div>
      
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile?.email?.split('@')[0] || 'User'}</h2>
              <p className="text-gray-600 capitalize">{profile?.role || 'Student'} Account</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Academic Goal
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.academic_goal}
                onChange={(e) => setFormData({...formData, academic_goal: e.target.value})}
                placeholder="e.g., Ace my finals"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
            ) : (
              <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                <p className="text-gray-900">
                  {profile?.academic_goal || 'No academic goal set'}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Focus Areas
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.focus_areas}
                onChange={(e) => setFormData({...formData, focus_areas: e.target.value})}
                placeholder="e.g., Math, Science"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
            ) : (
              <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                <p className="text-gray-900">
                  {profile?.focus_areas || 'No focus areas set'}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Account Type
              </label>
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <p className="text-indigo-900 font-medium capitalize">
                  {profile?.role || 'Student'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Member Since
              </label>
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <p className="text-green-900 font-medium">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
              >
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

