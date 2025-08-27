import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUsers, saveUsers } from '../config/db.js';

// Signup
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const users = await getUsers();
  if (users.find((user) => user.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    username,
    email,
    password: hashedPassword,
  };

  users.push(user);
  await saveUsers(users);

  res.status(201).json({ message: 'User registered successfully' });
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const users = await getUsers();
  const user = users.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
};