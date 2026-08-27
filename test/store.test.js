import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TaskStore } from '../src/store.js';

test('adds a task and lists it', () => {
  const store = new TaskStore();
  const task = store.add('Write docs');
  assert.equal(task.title, 'Write docs');
  assert.equal(task.done, false);
  assert.equal(store.list().length, 1);
});

test('trims titles and rejects empty ones', () => {
  const store = new TaskStore();
  assert.equal(store.add('  spaced  ').title, 'spaced');
  assert.throws(() => store.add('   '), /title is required/);
  assert.throws(() => store.add(), /title is required/);
});

test('toggles completion state', () => {
  const store = new TaskStore();
  const task = store.add('Toggle me');
  assert.equal(store.toggle(task.id).done, true);
  assert.equal(store.toggle(task.id).done, false);
  assert.equal(store.toggle('missing'), null);
});

test('removes tasks', () => {
  const store = new TaskStore();
  const task = store.add('Delete me');
  assert.equal(store.remove(task.id), true);
  assert.equal(store.remove(task.id), false);
  assert.equal(store.list().length, 0);
});

test('clears only completed tasks', () => {
  const store = new TaskStore();
  const a = store.add('Keep');
  const b = store.add('Done');
  store.toggle(b.id);
  assert.equal(store.clearCompleted(), 1);
  assert.deepEqual(store.list().map((t) => t.id), [a.id]);
});

test('seeds tasks from constructor', () => {
  const store = new TaskStore([
    { title: 'Seeded', done: true },
    { title: 'Another' },
  ]);
  assert.equal(store.list().length, 2);
  assert.equal(store.list()[0].done, true);
});
