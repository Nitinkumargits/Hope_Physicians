import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import toast from 'react-hot-toast';
import { FaTasks, FaSearch, FaFilter, FaSpinner, FaPlay, FaCheckCircle, FaClock, FaCalendar, FaExclamationTriangle } from 'react-icons/fa';
import * as staffService from '../../services/staffService';

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [startingTask, setStartingTask] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await staffService.getTasks();
      setTasks(data.data || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || task.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleStartTask = async (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const confirmStartTask = async () => {
    if (!selectedTask) return;
    
    setStartingTask(true);
    try {
      const result = await staffService.startTask(selectedTask.id);
      setTasks(prev => prev.map(t => 
        t.id === selectedTask.id ? { ...t, status: 'in-progress' } : t
      ));
      toast.success(result.message || 'Task started successfully!');
      setIsTaskModalOpen(false);
      setSelectedTask(null);
      fetchTasks(); // Refresh tasks
    } catch (error) {
      console.error('Failed to start task:', error);
      toast.error('Failed to start task. Please try again.');
    } finally {
      setStartingTask(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'red',
      'medium': 'amber',
      'low': 'green'
    };
    return colors[priority] || 'gray';
  };

  const getStatusBadge = (status) => {
    const variants = {
      'pending': 'warning',
      'in-progress': 'info',
      'completed': 'success'
    };
    return variants[status] || 'default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-600 mt-1">Manage and track your assigned tasks</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Tasks List */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <FaTasks className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No tasks found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    task.status === 'completed' 
                      ? 'bg-green-50 border-green-400' 
                      : task.status === 'in-progress'
                      ? 'bg-blue-50 border-blue-400'
                      : 'bg-gray-50 border-' + getPriorityColor(task.priority) + '-400'
                  } hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{task.title}</p>
                        <Badge variant={getStatusBadge(task.status)}>{task.status}</Badge>
                        {task.status === 'pending' && (
                          <Badge variant={getPriorityColor(task.priority) === 'red' ? 'danger' : getPriorityColor(task.priority) === 'amber' ? 'warning' : 'success'}>
                            {task.priority}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description || 'No description available'}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaCalendar className="w-3 h-3" />
                          Due: {formatDate(task.dueDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaTasks className="w-3 h-3" />
                          {task.count} items
                        </span>
                        {task.category && (
                          <span className="flex items-center gap-1">
                            <FaExclamationTriangle className="w-3 h-3" />
                            {task.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {task.status === 'pending' && (
                        <Button 
                          size="sm"
                          onClick={() => handleStartTask(task)}
                        >
                          <FaPlay className="w-3 h-3 mr-1" />
                          Start
                        </Button>
                      )}
                      {task.status === 'in-progress' && (
                        <Badge variant="info" className="flex items-center gap-1">
                          <FaClock className="w-3 h-3" />
                          In Progress
                        </Badge>
                      )}
                      {task.status === 'completed' && (
                        <Badge variant="success" className="flex items-center gap-1">
                          <FaCheckCircle className="w-3 h-3" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Task Details Modal */}
        <Modal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          title="Task Details"
          size="lg"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
              {selectedTask && (
                <Button 
                  onClick={confirmStartTask}
                  disabled={startingTask}
                  loading={startingTask}
                >
                  <FaPlay className="w-4 h-4 mr-2" />
                  Start Task
                </Button>
              )}
            </div>
          }
        >
          {selectedTask && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{selectedTask.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{selectedTask.description || 'No description available'}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Priority:</p>
                    <Badge variant={selectedTask.priority === 'high' ? 'danger' : selectedTask.priority === 'medium' ? 'warning' : 'success'}>
                      {selectedTask.priority}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-500">Items:</p>
                    <p className="font-medium text-gray-900">{selectedTask.count} items</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Category:</p>
                    <p className="font-medium text-gray-900">{selectedTask.category || 'General'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Due Date:</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedTask.dueDate)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <FaExclamationTriangle className="w-4 h-4 inline mr-2" />
                  Starting this task will mark it as in-progress.
                </p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Tasks;

