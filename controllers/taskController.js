import { getTasks, saveTasks } from '../config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a task
export const createTask = async (req, res) => {
  const { title, description, dueDate, status } = req.body;
  const userId = req.user.id; // From auth middleware
  const file = req.file; // From multer

  if (!title || !description || !dueDate) {
    return res.status(400).json({ message: 'Title, description, and dueDate are required' });
  }

  const validStatus = ['pending', 'completed'];
  if (status && !validStatus.includes(status)) {
    return res.status(400).json({ message: 'Status must be pending or completed' });
  }

  const tasks = await getTasks();
  const task = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title,
    description,
    dueDate,
    status: status || 'pending',
    userId,
    createdAt: new Date().toISOString(),
    file: file ? { filename: file.filename, path: file.path } : null,
  };

  tasks.push(task);
  await saveTasks(tasks);

  res.status(201).json({ message: 'Task created successfully', task });
};

// Get tasks with filtering, searching, and pagination
export const getTasksByUser = async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;
  const userId = req.user.id;

  let tasks = await getTasks();
  tasks = tasks.filter((task) => task.userId === userId);

  // Filter by status
  if (status) {
    tasks = tasks.filter((task) => task.status === status);
  }

  // Search by title or description
  if (search) {
    const searchLower = search.toLowerCase();
    tasks = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
    );
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const paginatedTasks = tasks.slice(startIndex, startIndex + parseInt(limit));

  res.json({
    total: tasks.length,
    page: parseInt(page),
    limit: parseInt(limit),
    tasks: paginatedTasks,
  });
};

// Update a task
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, status } = req.body;
  const userId = req.user.id;
  const file = req.file; // From multer

  const tasks = await getTasks();
  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id) && task.userId === userId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found or not authorized' });
  }

  const validStatus = ['pending', 'completed'];
  if (status && !validStatus.includes(status)) {
    return res.status(400).json({ message: 'Status must be pending or completed' });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title || tasks[taskIndex].title,
    description: description || tasks[taskIndex].description,
    dueDate: dueDate || tasks[taskIndex].dueDate,
    status: status || tasks[taskIndex].status,
    file: file ? { filename: file.filename, path: file.path } : tasks[taskIndex].file,
  };

  await saveTasks(tasks);
  res.json({ message: 'Task updated successfully', task: tasks[taskIndex] });
};

// Delete a task
export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const tasks = await getTasks();
  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id) && task.userId === userId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found or not authorized' });
  }

  tasks.splice(taskIndex, 1);
  await saveTasks(tasks);
  res.json({ message: 'Task deleted successfully' });
};