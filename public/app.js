const listEl = document.getElementById('task-list');
const formEl = document.getElementById('new-task-form');
const inputEl = document.getElementById('new-task-input');
const counterEl = document.getElementById('counter');
const emptyEl = document.getElementById('empty-state');
const clearEl = document.getElementById('clear-completed');

async function api(path, options) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok && res.status !== 204) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

function render(tasks) {
  listEl.innerHTML = '';
  const remaining = tasks.filter((t) => !t.done).length;
  counterEl.textContent = `${remaining} of ${tasks.length} remaining`;
  emptyEl.hidden = tasks.length > 0;

  for (const task of tasks) {
    const li = document.createElement('li');
    li.className = `task${task.done ? ' task--done' : ''}`;
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task__checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const title = document.createElement('span');
    title.className = 'task__title';
    title.textContent = task.title;

    const del = document.createElement('button');
    del.className = 'task__delete';
    del.type = 'button';
    del.setAttribute('aria-label', `Delete ${task.title}`);
    del.textContent = '\u2715';
    del.addEventListener('click', () => deleteTask(task.id));

    li.append(checkbox, title, del);
    listEl.append(li);
  }
}

async function refresh() {
  render(await api('/api/tasks'));
}

async function addTask(title) {
  await api('/api/tasks', { method: 'POST', body: JSON.stringify({ title }) });
  await refresh();
}

async function toggleTask(id) {
  await api(`/api/tasks/${id}/toggle`, { method: 'PATCH' });
  await refresh();
}

async function deleteTask(id) {
  await api(`/api/tasks/${id}`, { method: 'DELETE' });
  await refresh();
}

formEl.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = inputEl.value.trim();
  if (!title) return;
  inputEl.value = '';
  await addTask(title);
  inputEl.focus();
});

clearEl.addEventListener('click', async () => {
  await api('/api/tasks/clear-completed', { method: 'POST' });
  await refresh();
});

refresh().catch((err) => {
  console.error(err);
  counterEl.textContent = 'Failed to load tasks';
});
