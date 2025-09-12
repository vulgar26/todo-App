const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const db = new Database('tasks.db', {fileMustExist: false});

db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 2000');

db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0
    )
    `).run();

const rowToTask = (row) => ({
    id: row.id,
    text: row.title,
    done: !!row.completed
});

app.get('/api/tasks', (req, res) => {
    try {
        const rows = db.prepare(
            'SELECT id, title, completed FROM tasks ORDER BY id DESC'
        ).all();
        res.json(rows.map(rowToTask));
    } catch (e) {
        console.error('GET /api/tasks failed:', e);
        res.status(500).json({ error: String(e.message || e) });
    }
});

app.post('/api/tasks', (req, res) => {
    try {
        const text = (req.body?.text || '').trim();
        if (!text) return res.status(400).json({ error: 'text 是必填字段' });

        const info = db.prepare(
            'INSERT INTO tasks (title, completed) VALUES (?, 0)'
        ).run(text);
        const created = { id: info.lastInsertRowid, text, done: false};
        res.status(201).json(created);
    }catch (e) {
        console.error(e);
        res.status(500).json({ error: '数据库写入失败'});
    }
});

app.patch('/api/tasks/:id', (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id)) return res.status(400).json({ error: 'id 非法'});

        const {text, done} = req.body ?? {};
        let changed = 0;

        if(typeof text === 'string') {
            const t = text.trim();
            if (!t) return res.status(400).json({ error: 'text 不能为空'});
            const info = db.prepare('UPDATE tasks SET title = ? WHERE id = ?').run(t, id);
            changed += info.changes;
        }
        if (typeof done === 'boolean') {
            const info = db.prepare('UPDATE tasks SET completed = ? WHERE id = ?').run(done ? 1 : 0, id);
            changed += info.changes;
        }

        if (changed === 0) return res.status(404).json({error: '未找到该任务'});

        const row = db.prepare('SELECT id, title, completed FROM tasks WHERE id = ?').get(id);
        res.json(rowToTask(row));
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: '数据库更新失败'});
    }
});

app.delete('/api/tasks/:id', (req, res) => {
    try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id 非法' });

    const info = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    if (info.changes === 0) return res.status(404).json({ error: '未找到该任务' });

    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '数据库删除失败' });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

app.listen(PORT, () => {
  console.log(`API server listening at http://localhost:${PORT}`);
});