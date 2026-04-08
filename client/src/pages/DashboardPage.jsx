import { useEffect, useState } from 'react';
import AddTaskForm from '../components/AddTaskForm';
import NavBar from '../components/NavBar';
import PetPanel from '../components/PetPanel';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { authFetch, user, refreshUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try {
      const data = await authFetch('/tasks');
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTask = async (payload) => {
    try {
      await authFetch('/tasks', { method: 'POST', body: JSON.stringify(payload) });
      await loadTasks();
      await refreshUser();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await authFetch(`/tasks/${task.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: task.completed ? 0 : 1 })
      });
      await loadTasks();
      await refreshUser();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await authFetch(`/tasks/${id}`, { method: 'DELETE' });
      await loadTasks();
      await refreshUser();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-6xl mx-auto">
        <NavBar />
        {error && <p className="text-red-400 mb-3">{error}</p>}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <PetPanel user={user} />
          </div>
          <div className="md:col-span-2 space-y-4">
            <AddTaskForm onAdd={addTask} />
            <TaskList tasks={tasks} filter={filter} setFilter={setFilter} onToggleComplete={toggleComplete} onDelete={deleteTask} />
          </div>
        </div>
      </div>
    </div>
  );
}
