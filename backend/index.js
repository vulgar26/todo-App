const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let tasks = [
    { id: 1, text: '学习React', done: false},
    { id: 2, text: '完成前后端集成', done: false},
];

app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

app.post('/api/tasks', (req, res) => {
    const newTask = req.body;
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== taskId);
    res.status(200).json({ message: '任务已删除' });
});