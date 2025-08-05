import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Clock, Target, Trash2, X, Loader2 } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

// --- Define the necessary Types ---
interface Subject {
  id: number;
  name: string;
  color: string;
}

interface Session {
  id: number;
  subject_id: number;
  time_spent: number;
  topic: string;
  focus_level: number;
  notes: string;
  timestamp: string;
  subject: Subject;
}

// --- Main Sessions Component ---
const Sessions: React.FC = () => {
  // Get the shared subjects list from the context
  const { user, subjects } = useAuth(); 
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const fetchSessions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.get('/api/sessions/');
      setSessions(response.data);
    } catch (error) {
      toast.error('Failed to fetch sessions.');
      console.error("Fetch sessions error:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Fetch sessions when the component loads
    fetchSessions();
  }, [fetchSessions]);

  const handleSessionCreated = (newSession: Session) => {
    // Add the new session to the top of the list for immediate feedback
    setSessions(prevSessions => [newSession, ...prevSessions]);
  };

  const handleDeleteSession = async (sessionId: number) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;

    try {
        await axios.delete(`/api/sessions/${sessionId}`);
        toast.success('Session deleted successfully!');
        setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId));
    } catch (error) {
        toast.error('Failed to delete session.');
    }
  };

  if (loading) {
    return <div className="p-6 flex justify-center items-center"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Study Sessions</h1>
          </div>
          <p className="text-gray-600 text-lg">Log your study time and keep track of your learning progress.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="mt-6 md:mt-0 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
          disabled={subjects.length === 0}
        >
          <Plus className="w-5 h-5 mr-2" />
          Log New Session
        </button>
      </div>
      
      {subjects.length === 0 && !loading && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No subjects available</h3>
          <p className="text-gray-600 mb-4">You need to add a subject before you can log a study session.</p>
          <Link 
            to="/subjects" 
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Subject
          </Link>
        </div>
      )}

      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map(session => (
            <SessionCard 
              key={session.id} 
              session={session}
              onDelete={() => handleDeleteSession(session.id)}
            />
          ))}
        </div>
      ) : (
        !loading && subjects.length > 0 && (
            <div className="text-center py-20 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
              <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No sessions logged yet</h3>
              <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">Start tracking your study time by logging your first session.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Log Your First Session
              </button>
            </div>
        )
      )}

      {isModalOpen && (
        <SessionModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSessionCreated={handleSessionCreated}
          subjects={subjects}
        />
      )}
    </div>
  );
};

const SessionCard: React.FC<{ session: Session; onDelete: () => void; }> = ({ session, onDelete }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
              style={{backgroundColor: session.subject.color}}
            >
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{session.subject.name}</h3>
              <p className="text-sm text-gray-600">{session.topic || 'General Study'}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Target className="w-4 h-4" />
                  <span>Focus: {session.focus_level}/10</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(session.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{session.time_spent}min</p>
              <p className="text-xs text-gray-500">Study Time</p>
            </div>
            <button 
              onClick={onDelete} 
              className="p-2 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      {session.notes && (
        <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">{session.notes}</p>
        </div>
      )}
    </div>
  );
};

const SessionModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onSessionCreated: (session: Session) => void;
    subjects: Subject[];
}> = ({ isOpen, onClose, onSessionCreated, subjects }) => {
  const [subjectId, setSubjectId] = useState<string>('');
  const [timeSpent, setTimeSpent] = useState('');
  const [topic, setTopic] = useState('');
  const [focusLevel, setFocusLevel] = useState(5);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && subjects.length > 0 && !subjectId) {
        setSubjectId(subjects[0].id.toString());
    }
  }, [isOpen, subjects, subjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !timeSpent) {
        toast.error("Please select a subject and enter the time spent.");
        return;
    }
    
    setIsSaving(true);
    try {
        const response = await axios.post('/api/sessions/', {
            subject_id: parseInt(subjectId),
            time_spent: parseFloat(timeSpent),
            topic,
            focus_level: focusLevel,
            notes
        });
        toast.success('Session logged successfully!');
        onSessionCreated(response.data.session);
        onClose();
    } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to log session.');
    } finally {
        setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-lg m-4 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Log a New Study Session</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="subject-id" className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
              <select
                id="subject-id"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              >
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="time-spent" className="block text-sm font-semibold text-gray-700 mb-2">Time Spent (minutes)</label>
              <input
                id="time-spent"
                type="number"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                placeholder="e.g., 45"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 mb-2">Topic Studied (Optional)</label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              placeholder="e.g., Chapter 3: Integrals"
            />
          </div>
           <div>
              <label htmlFor="focus-level" className="block text-sm font-semibold text-gray-700 mb-3">Focus Level: <span className="text-green-600 font-bold">{focusLevel}/10</span></label>
              <input
                id="focus-level"
                type="range"
                min="1"
                max="10"
                value={focusLevel}
                onChange={(e) => setFocusLevel(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low Focus</span>
                <span>High Focus</span>
              </div>
            </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white/80 backdrop-blur-sm min-h-[100px] resize-none"
              placeholder="Any thoughts or key takeaways..."
            />
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-32 disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Log Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sessions;
