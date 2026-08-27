import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { TaskStore } from './src/store.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function createApp(store = new TaskStore()) {
  const app = express();
  app.use(express.json());
  app.use(express.static(join(__dirname, 'public')));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.get('/api/tasks', (_req, res) => {
    res.json(store.list());
  });

  app.post('/api/tasks', (req, res) => {
    try {
      const task = store.add(req.body?.title, req.body?.done);
      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch('/api/tasks/:id/toggle', (req, res) => {
    const task = store.toggle(req.params.id);
    if (!task) {
      res.status(404).json({ error: 'task not found' });
      return;
    }
    res.json(task);
  });

  app.delete('/api/tasks/:id', (req, res) => {
    const removed = store.remove(req.params.id);
    res.status(removed ? 204 : 404).end();
  });

  app.post('/api/tasks/clear-completed', (_req, res) => {
    res.json({ removed: store.clearCompleted() });
  });

  return app;
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const port = Number(process.env.PORT) || 3000;
  const store = new TaskStore([
    { title: 'Read the project README', done: true },
    { title: 'Run the dev server', done: false },
    { title: 'Add a task of your own', done: false },
  ]);
  createApp(store).listen(port, () => {
    console.log(`Task Board running at http://localhost:${port}`);
  });
}
