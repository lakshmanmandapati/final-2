import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>
      
      <div className="card">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Goal
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.academic_goal}
                onChange={(e) => setFormData({...formData, academic_goal: e.target.value})}
                placeholder="e.g., Ace my finals"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2">
                {profile?.academic_goal || 'No academic goal set'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Focus Areas
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.focus_areas}
                onChange={(e) => setFormData({...formData, focus_areas: e.target.value})}
                placeholder="e.g., Math, Science"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2">
                {profile?.focus_areas || 'No focus areas set'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <p className="text-gray-900 py-2 capitalize">
              {profile?.role || 'Student'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Member Since
            </label>
            <p className="text-gray-900 py-2">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
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

