import React, { useRef, useState } from "react";
import { Mic, Square, Trash2, Play, Pause, Volume2 } from "lucide-react";

interface AudioNote {
  id: string;
  blob: Blob;
  url: string;
  createdAt: Date;
  duration?: number;
}

const AudioNotes: React.FC = () => {
  const [notes, setNotes] = useState<AudioNote[]>([]);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);

        const newNote: AudioNote = {
          id: Date.now().toString(),
          blob,
          url,
          createdAt: new Date(),
          duration: recordingTime,
        };

        setNotes((prev) => [newNote, ...prev]);
        chunksRef.current = [];
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setRecording(true);
      
      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const handlePlayPause = (id: string, url: string) => {
    if (playingId === id) {
      // Pause current audio
      if (audioRefs.current[id]) {
        audioRefs.current[id].pause();
      }
      setPlayingId(null);
    } else {
      // Stop any currently playing audio
      if (playingId && audioRefs.current[playingId]) {
        audioRefs.current[playingId].pause();
        audioRefs.current[playingId].currentTime = 0;
      }
      
      // Play new audio
      if (!audioRefs.current[id]) {
        audioRefs.current[id] = new Audio(url);
        audioRefs.current[id].onended = () => setPlayingId(null);
      }
      
      audioRefs.current[id].play();
      setPlayingId(id);
    }
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Are you sure you want to delete this audio note?')) {
      // Stop audio if playing
      if (playingId === id && audioRefs.current[id]) {
        audioRefs.current[id].pause();
        setPlayingId(null);
      }
      
      // Clean up audio reference
      if (audioRefs.current[id]) {
        delete audioRefs.current[id];
      }
      
      setNotes((prev) => prev.filter((note) => note.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
            <Volume2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Audio Notes</h1>
        </div>
        <p className="text-gray-600 text-lg">Record voice memos and reflections about your study sessions.</p>
      </div>

      {/* Recording Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="text-center">
          <div className="mb-6">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              recording 
                ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' 
                : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:scale-110'
            }`}>
              {recording ? (
                <Square className="w-10 h-10 text-white" />
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
            </div>
            
            {recording && (
              <div className="mt-4">
                <p className="text-2xl font-bold text-red-600">{formatTime(recordingTime)}</p>
                <p className="text-sm text-gray-500">Recording in progress...</p>
              </div>
            )}
          </div>
          
        {!recording ? (
          <button
            onClick={handleStartRecording}
            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center mx-auto"
          >
            <Mic className="w-5 h-5 mr-2" />
            Start Recording
          </button>
        ) : (
          <button
            onClick={handleStopRecording}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center mx-auto"
          >
            <Square className="w-5 h-5 mr-2" />
            Stop Recording
          </button>
        )}
        </div>
      </div>

      {/* Audio Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-20 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Volume2 className="w-10 h-10 text-pink-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No audio notes yet</h3>
          <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">Start recording your thoughts and reflections about your study sessions.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Volume2 className="w-5 h-5 mr-2 text-pink-600" />
            Your Audio Notes ({notes.length})
          </h2>
          
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handlePlayPause(note.id, note.url)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-all duration-200 ${
                      playingId === note.id
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                        : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700'
                    }`}
                  >
                    {playingId === note.id ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    )}
                  </button>
                  
                  <div>
                    <p className="font-semibold text-gray-800">
                      Audio Note
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{note.createdAt.toLocaleDateString()}</span>
                      <span>{note.createdAt.toLocaleTimeString()}</span>
                      {note.duration && <span>{formatTime(note.duration)}</span>}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="p-2 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioNotes;
