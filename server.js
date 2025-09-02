const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory or file-based storage
let tasks = [];
const TASKS_FILE = 'tasks.json';

// Utility to read/write tasks
const loadTasks = () => {
  if (fs.existsSync(TASKS_FILE)) {
    tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
  }
};
const saveTasks = () => {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};
loadTasks();

// Root endpoint
app.get('/', (req, res) => {
  res.send('Task Manager API is running');
});

// GET /tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// POST /tasks
app.post('/tasks', (req, res) => {
  const task = { id: Date.now().toString(), ...req.body };
  tasks.push(task);
  saveTasks();
  res.status(201).json(task);
});

// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx < 0) return res.status(404).send('Task not found');
  tasks[idx] = { ...tasks[idx], ...req.body };
  saveTasks();
  res.json(tasks[idx]);
});

// DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx < 0) return res.status(404).send('Task not found');
  const [deleted] = tasks.splice(idx, 1);
  saveTasks();
  res.json(deleted);
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

