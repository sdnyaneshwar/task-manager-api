import express from 'express';
     import { authMiddleware } from '../middleware/authMiddleware.js';
     import { createTask, getTasksByUser, updateTask, deleteTask } from '../controllers/taskController.js';

     const router = express.Router();

     router.use(authMiddleware); // Protect all task routes

     router.post('/', createTask);
     router.get('/', getTasksByUser);
     router.put('/:id', updateTask);
     router.delete('/:id', deleteTask);

     export default router;