import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import TaskForm from './components/TaskForm.jsx';
import Schedule from './components/Schedule.jsx';
import Sidebar from './components/Sidebar.jsx';
// We only need the ONE service function here now
import { getAISchedule } from './services/geminiService.js';
import { parseTime } from './utils/timeUtils.js';

function App() {
  // --- All your existing state hooks ---
  // (Notice aiTips and isTipsLoading are GONE)
  const [apiKey, setApiKey] = useState('');
  const [taskInput, setTaskInput] = useState('');
  const [generatedSchedule, setGeneratedSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [showCompleted, setShowCompleted] = useState(false);
  const [freeTime, setFreeTime] = useState(null);
  const [unScheduledTasks, setUnScheduledTasks] = useState([]);
  
  // --- All your existing effects (loading key, clock) ---
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  // --- All your existing handler functions ---
  const handleSaveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
      setShowModal(false);
      alert('API Key saved!');
    } else {
      alert('Please enter a valid API Key.');
    }
  };

  // This function is now simpler
  const handleGenerateSchedule = async () => {
    if (!apiKey) {
      alert('Please set your Gemini API Key in Settings first.');
      setShowModal(true);
      return;
    }
    if (!taskInput) {
      alert('Please enter some tasks.');
      return;
    }

    // Reset all states
    setIsLoading(true);
    setError(null);
    setGeneratedSchedule([]);
    setFreeTime(null);
    setUnScheduledTasks([]);
    setCompletedTasks(new Set());

    try {
      // --- Get Schedule (main task) ---
      const { finalSchedule, couldNotSchedule } = await getAISchedule(taskInput, apiKey, currentTime);
      setGeneratedSchedule(finalSchedule);
      setUnScheduledTasks(couldNotSchedule || []);
      const totalFreeMinutes = calculateFreeTime(finalSchedule);
      setFreeTime(totalFreeMinutes);
      
      // --- NO LONGER GETS TIPS HERE ---

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = (taskId) => {
    setCompletedTasks(prevCompleted => {
      const newCompleted = new Set(prevCompleted);
      if (newCompleted.has(taskId)) {
        newCompleted.delete(taskId);
      } else {
        newCompleted.add(taskId);
      }
      return newCompleted;
    });
  };

  const calculateFreeTime = (schedule) => {
    let totalMinutes = 0;
    if (!schedule) return 0;
    schedule.forEach(item => {
      if (item.task.toLowerCase() === 'free time') {
        try {
          const startTime = parseTime(item.startTime);
          const endTime = parseTime(item.endTime);
          const durationMs = endTime.getTime() - startTime.getTime();
          totalMinutes += durationMs / (1000 * 60);
        } catch (e) { console.error("Error parsing free time:", item); }
      }
    });
    return totalMinutes;
  };

  // --- Calculate progress data (This logic is correct) ---
  const totalTasks = generatedSchedule.filter(task => task.task.toLowerCase() !== 'free time').length;
  const completedCount = completedTasks.size;

  // --- Render the new layout ---
  return (
    <div className="bg-gray-100 min-h-screen">
      
      <Header onSettingsClick={() => setShowModal(true)} />

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8">
        
        {/* Main Content Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          <TaskForm 
            taskInput={taskInput}
            setTaskInput={setTaskInput}
            onSubmit={handleGenerateSchedule}
            isLoading={isLoading}
          />
          <Schedule
            schedule={generatedSchedule}
            isLoading={isLoading}
            error={error}
            completedTasks={completedTasks}
            onToggleComplete={handleToggleComplete}
            currentTime={currentTime}
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
            freeTime={freeTime}
            unScheduledTasks={unScheduledTasks}
          />
        </div>

        {/* Sidebar Column (1/3 width) */}
        <div className="lg:col-span-1">
        <div style={{ position: 'sticky', top: '32px' }} className="lg:top-8 space-y-8">
          <Sidebar 
            totalTasks={totalTasks} 
            completedCount={completedCount} 
            // Pass the schedule and key down
            schedule={generatedSchedule}
            apiKey={apiKey}
          />
        </div>
        </div>

      </main>

      <SettingsModal
        show={showModal}
        onClose={() => setShowModal(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        onSave={handleSaveApiKey}
      />
    </div>
  );
}

export default App;