const statusEl = document.getElementById('status-value');
const uptimeEl = document.getElementById('uptime-value');
const taskCountEl = document.getElementById('task-count');

async function getJson(path) {
  const res = await fetch(path, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

function formatUptime(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

async function loadStatus() {
  const [health, tasks] = await Promise.all([getJson('/api/health'), getJson('/api/tasks')]);
  const list = Array.isArray(tasks) ? tasks : [];
  const remaining = list.filter((task) => !task.done).length;

  statusEl.textContent = String(health.status ?? 'unknown');
  uptimeEl.textContent = formatUptime(health.uptime);
  taskCountEl.textContent = `${list.length} total · ${remaining} remaining`;
}

loadStatus().catch((err) => {
  console.error(err);
  for (const el of [statusEl, uptimeEl, taskCountEl]) {
    el.textContent = 'Unavailable';
  }
});
