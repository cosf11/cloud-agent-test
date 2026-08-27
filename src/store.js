import { randomUUID } from 'node:crypto';

/**
 * In-memory task store. Kept as a standalone, dependency-free module so the
 * core business logic can be unit-tested without starting an HTTP server.
 */
export class TaskStore {
  constructor(seed = []) {
    this.tasks = new Map();
    for (const task of seed) {
      this.add(task.title, task.done);
    }
  }

  list() {
    return [...this.tasks.values()].sort((a, b) => a.createdAt - b.createdAt);
  }

  add(title, done = false) {
    const trimmed = String(title ?? '').trim();
    if (!trimmed) {
      throw new Error('title is required');
    }
    const task = {
      id: randomUUID(),
      title: trimmed,
      done: Boolean(done),
      createdAt: Date.now(),
    };
    this.tasks.set(task.id, task);
    return task;
  }

  toggle(id) {
    const task = this.tasks.get(id);
    if (!task) {
      return null;
    }
    task.done = !task.done;
    return task;
  }

  remove(id) {
    return this.tasks.delete(id);
  }

  clearCompleted() {
    let removed = 0;
    for (const task of this.tasks.values()) {
      if (task.done) {
        this.tasks.delete(task.id);
        removed += 1;
      }
    }
    return removed;
  }
}
