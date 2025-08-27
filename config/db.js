import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(__dirname, '../data/users.json');
const TASKS_FILE = path.join(__dirname, '../data/tasks.json');

// Read data from file
const readData = async (file) => {
  try {
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

// Write data to file
const writeData = async (file, data) => {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
};

export const getUsers = () => readData(USERS_FILE);
export const saveUsers = (users) => writeData(USERS_FILE, users);
export const getTasks = () => readData(TASKS_FILE);
export const saveTasks = (tasks) => writeData(TASKS_FILE, tasks);